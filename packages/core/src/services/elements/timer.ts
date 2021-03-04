import { debugIf } from '../common'
import { EventEmitter } from '../events'
import { captureElementChildTimedNodes, resolveElementChildTimedNodesByTime, restoreElementChildTimedNodes } from './functions'
import { TimedNode, TIMER_EVENTS } from './interfaces'

export class ElementTimer extends EventEmitter {
  private timedNodes: TimedNode[] = []
  private timer?: NodeJS.Timeout
  public lastTime = 0

  constructor(private rootElement: HTMLElement, private duration: number, private debug: boolean) {
    super()
    this.lastTime = 0
    debugIf(this.debug, `element-timer: starting timer w/ ${duration} duration`)

    // Capture timed nodes
    this.timedNodes = captureElementChildTimedNodes(this.rootElement, this.duration)
    debugIf(this.debug && this.timedNodes.length > 0, `element-timer:  found time-child nodes: ${JSON.stringify(this.timedNodes)}`)

    // self-register to manage them
    this.on(TIMER_EVENTS.OnInterval, time => {
      resolveElementChildTimedNodesByTime(this.rootElement, this.timedNodes, time, duration, debug)
      this.lastTime = time
    })

    this.on(TIMER_EVENTS.OnEnd, () => {
      restoreElementChildTimedNodes(this.rootElement, this.timedNodes)
    })
  }

  beginInternalTimer() {
    let time = 0
    const { duration, debug } = this

    this.timer = setInterval(() => {
      time = time + 0.5
      this.emitTime(time)
      if (duration > 0 && time > duration) {
        debugIf(debug, `element-timer: presentation ended at ${time} [not redirecting]`)
        clearInterval(this.timer!)
        this.emit(TIMER_EVENTS.OnEnd)
      }
    }, 500)
  }

  public emitTime(time: number) {
    debugIf(this.debug, `element-timer: ${this.lastTime} - ${time}`)
    this.emit(TIMER_EVENTS.OnInterval, time)
  }

  destroy() {
    restoreElementChildTimedNodes(this.rootElement, this.timedNodes)
    this.removeAllListeners()
    clearInterval(this.timer!)
  }
}
