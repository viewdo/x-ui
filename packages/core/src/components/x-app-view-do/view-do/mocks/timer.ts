/* istanbul ignore file */
//  @ts-no-check
import { EventEmitter } from '../../../../services/events/emitter'
import { TimedNode } from '../interfaces'

export class ElementTimer extends EventEmitter {
  private timedNodes: TimedNode[] = []
  private timer?: NodeJS.Timeout
  public lastTime = 0

  constructor(
    private _rootElement: HTMLElement,
    private _duration: number,
    private _debug: boolean,
  ) {
    super()
  }

  beginInternalTimer() {}

  public emitTime(_time: number) {}

  destroy() {}
}
