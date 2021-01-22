import { EventEmitter } from '../actions/event-emitter';
import { debugIf } from '../logging';
import { captureElementChildTimedNodes, resolveElementChildTimedNodesByTime, restoreElementChildTimedNodes } from './functions';
import { TimedNode, TIMER_EVENTS } from './interfaces';

export class ElementTimer extends EventEmitter {
  private timedNodes: TimedNode[] = []
  private timer: any
  private animationFrame: any
  public lastTime = 0
  private started!: number;

  constructor(
    private rootElement: HTMLElement,
    private duration: number,
    private debug: boolean) {
    super()
    this.lastTime = 0
    debugIf(this.debug, `element-timer: starting timer w/ ${duration} duration`)

    // Capture timed nodes
    this.timedNodes = captureElementChildTimedNodes(this.rootElement, this.duration)
    debugIf(
      this.debug && this.timedNodes.length > 0,
      `element-timer:  found time-child nodes: ${JSON.stringify(this.timedNodes)}`,
    )

    // self-register to manage them
    this.on(TIMER_EVENTS.OnInterval, (time) => {
      resolveElementChildTimedNodesByTime(this.rootElement, this.timedNodes, time, duration, debug)
      this.lastTime = time
    })

    this.on(TIMER_EVENTS.OnEnd, () => {
      restoreElementChildTimedNodes(this.rootElement, this.timedNodes)
    })
  }

  beginInternalTimer() {
    const time = 0
    this.started = performance.now()
    this.timer = requestAnimationFrame(() => {
      this.emitTime(time)
    })
  }

  public emitTime(time: number) {
    const { duration, debug } = this
    time = (performance.now() - this.started) / 1000
    debugIf(this.debug, `element-timer: ${this.lastTime} - ${time}`)

    this.emit(TIMER_EVENTS.OnInterval, time)

    if ((duration > 0 && time < duration) || duration === 0) {
      this.timer = setTimeout(() => {
        this.animationFrame = requestAnimationFrame(() => {
          this.emitTime(time)
        })
      }, 500)

      if (duration > 0 && time > duration) {
        debugIf(debug, `element-timer: presentation ended at ${time} [not redirecting]`)
        cancelAnimationFrame(this.timer)
        this.emit(TIMER_EVENTS.OnEnd)
      }
    }
  }



  destroy() {
    restoreElementChildTimedNodes(this.rootElement, this.timedNodes)
    this.removeAllListeners()
    clearInterval(this.timer)
    cancelAnimationFrame(this.animationFrame)
  }

}
