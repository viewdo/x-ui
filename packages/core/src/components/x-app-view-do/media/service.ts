import { ActionActivationStrategy } from '../../../services/actions/interfaces'
import { IEventEmitter } from '../../../services/common/interfaces'
import { debugIf } from '../../../services/common/logging'
import { VisitStrategy } from '../../../services/navigation/interfaces'
import { recordVisit } from '../../../services/navigation/visits'
import { IRoute } from '../../../services/routing/interfaces'
import { VideoActionListener } from '../../../services/video/actions'
import { videoState } from '../../../services/video/state'
import {
  captureElementChildTimedNodes,
  captureXBackClickEvent,
  captureXLinkClickEvent,
  captureXNextClickEvent,
  getChildInputValidity,
  resolveElementChildTimedNodesByTime,
  restoreElementChildTimedNodes,
} from './elements'
import { TimedNode, TIMER_EVENTS } from './interfaces'
import { ElementTimer } from './timer'

export class ViewDoService {
  private timedNodes: TimedNode[] = []
  private videoListener?: VideoActionListener

  private get childVideo(): HTMLVideoElement | null {
    return this.el.querySelector(this.videoTarget)
  }

  private get actionActivators(): HTMLXActionActivatorElement[] {
    return Array.from(this.el.querySelectorAll('x-action-activator'))
  }

  constructor(
    private el: HTMLElement,
    private elementTimer: ElementTimer,
    private route: IRoute,
    private url: string,
    private visit: VisitStrategy,
    private actionBus: IEventEmitter,
    private eventBus: IEventEmitter,
    private videoTarget: string = 'video',
    private videoTimeEvent: string = 'timeupdate',
    private videoEndEvent: string = 'ended',
    private limit: number = 0,
    private debug: boolean = false,
  ) {
    this.captureChildElements()
    this.timedNodes = captureElementChildTimedNodes(
      this.el,
      this.limit,
    )

    const activated: any = []
    this.elementTimer.on(
      TIMER_EVENTS.OnInterval,
      async (elapsed: number) => {
        resolveElementChildTimedNodesByTime(
          this.el,
          this.timedNodes,
          elapsed,
          limit,
          debug,
        )

        await this.route.activateActions(
          this.actionActivators,
          ActionActivationStrategy.AtTime,
          activator => {
            if (activated.includes(activator)) return false
            if (activator.time && elapsed >= activator.time) {
              activated.push(activator)
              return true
            }
            return false
          },
        )
      },
    )

    this.elementTimer.on(TIMER_EVENTS.OnEnd, async () => {
      if (videoState.autoplay) {
        restoreElementChildTimedNodes(this.el, this.timedNodes)
        await this.next('timer', TIMER_EVENTS.OnEnd)
      }
    })

    debugIf(
      this.debug && this.timedNodes.length > 0,
      `element-timer:  found time-child nodes: ${this.timedNodes.length}`,
    )
  }

  public async beginTimer() {
    const video = this.childVideo
    await recordVisit(this.visit, this.url)
    if (video) {
      this.videoListener = new VideoActionListener(
        video,
        this.eventBus,
        this.actionBus,
        this.debug,
      )

      video.addEventListener(this.videoTimeEvent, () => {
        this.elementTimer!.emit(
          TIMER_EVENTS.OnInterval,
          video.currentTime,
        )
      })

      video.addEventListener(this.videoEndEvent, () => {
        this.elementTimer!.emit(TIMER_EVENTS.OnEnd)
      })

      if (videoState.autoplay) {
        await this.videoListener.play()
      }
    } else {
      this.elementTimer.beginInternalTimer()
    }
  }

  public async captureChildElements(el: HTMLElement = this.el) {
    debugIf(
      this.debug,
      `x-app-view-do: ${this.url} resolve children called`,
    )

    captureXBackClickEvent(el, tag => this.back(tag, 'click'))

    captureXNextClickEvent(el, (tag, route) =>
      this.next(tag, 'click', route),
    )

    captureXLinkClickEvent(el, (tag, route) =>
      this.next(tag, 'click', route),
    )
  }

  public back(element: string, eventName: string) {
    debugIf(
      this.debug,
      `x-app-view-do: back fired from ${element}:${eventName}`,
    )
    this.cleanup()
    this.route.goBack()
  }

  public async next(
    element: string,
    eventName: string,
    path?: string | null,
  ) {
    debugIf(
      this.debug,
      `x-app-view-do: next fired from ${element}:${eventName}`,
    )
    const valid = getChildInputValidity(this.el)
    if (valid) {
      if (path) {
        this.route.goToRoute(path)
      } else {
        this.route.goToParentRoute()
      }
      this.cleanup()
    }
  }

  public cleanup() {
    this.elementTimer?.removeAllListeners()
    restoreElementChildTimedNodes(this.el, this.timedNodes)
    this.childVideo?.pause?.call(this)
    this.videoListener?.destroy()
    this.elementTimer?.destroy()
  }
}
