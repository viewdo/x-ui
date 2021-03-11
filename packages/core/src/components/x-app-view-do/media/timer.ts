import { debugIf, EventEmitter } from '../../../services/common'
import { TIMER_EVENTS } from './interfaces'

export class ElementTimer extends EventEmitter {
  private timer: number = 0
  public elapsed?: {
    hours: number
    minutes: number
    seconds: number
    elapsed: number
  }
  constructor(
    private provider: AnimationFrameProvider,
    public limit: number = 0,
    public start = performance.now(),
    private debug: boolean = false,
  ) {
    super()

    debugIf(
      this.debug,
      `element-timer: starting timer w/ ${limit} duration`,
    )
  }

  beginInternalTimer() {
    this.timer = this.provider.requestAnimationFrame(current => {
      this.interval(current)
    })
  }

  private interval(time: number) {
    const difference = elapsedTime(this.start, time)
    if (this.limit && difference.elapsed > this.limit) {
      debugIf(
        this.debug,
        `element-timer: presentation ended at ${time} [not redirecting]`,
      )
      this.provider.cancelAnimationFrame(this.timer)
      this.emit(TIMER_EVENTS.OnEnd)
    } else {
      this.elapsed = difference
      this.emitTime()
      this.timer = this.provider.requestAnimationFrame(current => {
        this.interval(current)
      })
    }
  }

  public emitTime() {
    debugIf(this.debug, `element-timer: ${this.elapsed?.elapsed}`)
    this.emit(TIMER_EVENTS.OnInterval, this.elapsed?.elapsed)
  }

  destroy() {
    this.removeAllListeners()
    try {
      this.provider.cancelAnimationFrame(this.timer)
    } catch {}
  }
}

export function elapsedTime(start: number, time: number) {
  const elapsed = (time - start) / 1000
  if (elapsed >= 0) {
    return {
      hours: Math.floor((elapsed / 3600) % 24),
      minutes: Math.floor((elapsed / 60) % 60),
      seconds: Math.floor(elapsed % 60),
      elapsed,
    }
  }
  return {
    hours: 0,
    minutes: 0,
    seconds: 0,
    elapsed,
  }
}
