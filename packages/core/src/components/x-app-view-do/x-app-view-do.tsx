import { Component, Element, forceUpdate, h, Host, Prop, State } from '@stencil/core'
import { debugIf, slugify } from '../../services/common'
import { warn } from '../../services/common/logging'
import { getRemoteContent } from '../../services/content/remote'
import { DATA_EVENTS } from '../../services/data'
import {
  captureXBackClickEvent,
  captureXLinkClickEvent,
  captureXNextClickEvent,
  ElementTimer,
  getChildInputValidity,
  resolveChildElementXAttributes,
  TIMER_EVENTS
} from '../../services/elements'
import { ActionActivationStrategy, actionBus, eventBus } from '../../services/events'
import { recordVisit, VisitStrategy } from '../../services/navigation'
import { MatchResults, Route } from '../../services/routing'
import { VideoActionListener, videoState } from '../../services/video'

/**
 *  @system routing
 *  @system presentation
 */
@Component({
  tag: 'x-app-view-do',
  styleUrl: 'x-app-view-do.scss',
  shadow: true,
})
export class XAppViewDo {
  private dataSubscription!: () => void
  private route!: Route
  private videoListener?: VideoActionListener
  private elementTimer?: ElementTimer

  @Element() el!: HTMLXAppViewDoElement
  @State() match: MatchResults | null = null
  @State() contentElement: HTMLElement|null = null
  private contentKey?: string | null

  /**
   * The title for this view. This is prefixed
   * before the app title configured in x-app
   *
   */
  @Prop() pageTitle = ''

  /**
   * Header height or offset for scroll-top on this
   * view.
   */
  @Prop() scrollTopOffset?: number

  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop() transition?: string

  /**
   * The url for this route, including the parent's
   * routes.
   *
   */
  @Prop({ mutable: true, reflect: true }) url!: string

  /**
   * The url for this route should only be matched
   * when it is exact.
   */
  @Prop() exact: boolean = true

  /**
   * The visit strategy for this do.
   * once: persist the visit and never force it again
   * always: do not persist, but don't don't show again in-session
   * optional: do not force this view-do ever. It will be available by URL
   */
  @Prop() visit: VisitStrategy = VisitStrategy.once

  /**
   * If present, the expression must
   * evaluate to true for this route
   * to be sequenced by the parent view.
   * The existence of this value overrides
   * the visit strategy
   */
  @Prop() when?: string

  /**
   * When this value exists, the page will
   * automatically progress when the duration in seconds has passed.
   */
  @Prop() nextAfter = 0

  /**
   * Remote URL for this Route's content.
   */
  @Prop() contentSrc?: string

  /**
   * Cross Origin Mode if the content is pulled from
   * a remote location
   */
  @Prop() mode: RequestMode = "cors"

  /**
   * Before rendering remote HTML, replace any data-tokens with their
   * resolved values. This also commands this component to
   * re-render it's HTML for data-changes. This can affect
   * performance.
   *
   * IMPORTANT: ONLY WORKS ON REMOTE HTML
   */
  @Prop() resolveTokens: boolean = false

  /**
   * To debug timed elements, set this value to true.
   */
  @Prop() debug = false

  /**
   * Provide the element selector for the
   * providing media object that can provide
   * time and end events. Default is video
   */
  @Prop() videoTarget: string = 'video'

  /**
   * Provide the time-event name.
   * Default is timeupdate
   */
  @Prop() videoTimeEvent: string = 'timeupdate'

  /**
   * Provider the end event name.
   * Default is ended
   */
  @Prop() videoEndEvent: string = 'ended'

  private get duration() {
    return this.childVideo?.duration || this.nextAfter
  }

  private get parentView() {
    return this.el.closest('x-app-view')
  }

  private get routeContainer() {
    return this.el.closest('x-app')
  }

  private get childVideo(): HTMLVideoElement | null {
    return this.el.querySelector(this.videoTarget)
  }

  private get actionActivators(): HTMLXActionActivatorElement[] {
    return Array.from(this.el.querySelectorAll('x-action-activator'))
  }

  componentWillLoad() {
    debugIf(this.debug, `x-app-view-do: ${this.url} loading`)

    if (!this.routeContainer) {
      warn(`x-app-view-do: ${this.url} cannot load outside of an x-app element`)
      return
    }

    if (!this.parentView) {
      warn(`x-app-view-do: ${this.url} cannot load outside of an x-app element`)
      return
    }

    this.route = this.routeContainer.router.createRoute(
      this.el,
      this.url,
      this.exact,
      this.pageTitle,
      this.transition || this.parentView.transition || null,
      this.scrollTopOffset || 0,
      (match: MatchResults | null) => {
        this.match = match ? { ...match } : null
      },
    )

    this.dataSubscription = eventBus.on(DATA_EVENTS.DataChanged, () => {
      debugIf(this.debug, 'x-app-view-do: data changed ')
      if (this.match?.isExact) forceUpdate(this.el)
    })

    this.contentKey = `remote-content-${slugify(this.contentSrc || 'none')}`
  }

  async componentWillRender() {
    debugIf(this.debug, `x-app-view-do: ${this.url} will render`)

    if (this.match?.isExact) {
      debugIf(this.debug, `x-app-view-do: ${this.url} on-enter`)
      this.contentElement = await this.resolveContentElement()
      await this.captureChildElements(this.el)
      if (this.contentElement)
        await this.captureChildElements(this.contentElement)
      await this.setupTimer()
      //this.el.removeAttribute('hidden')
    } else {
      //this.el.setAttribute('hidden', '')
      this.cleanup()
    }
  }

  private async resolveContentElement() {
    if (!this.contentSrc) {
      return null
    }

    try {
      const content = await getRemoteContent(window, this.contentSrc!, this.mode, this.resolveTokens)
      if (content == null) return null
      const div = document.createElement('div')
      div.slot = 'content'
      div.innerHTML = content
      div.id = this.contentKey!
      await resolveChildElementXAttributes(div)
      this.route.captureInnerLinks(div)
      return div
    } catch {
      warn(`x-app-view-do: ${this.url} Unable to retrieve from ${this.contentSrc}`)
      return null
    }
  }

  private async setupTimer() {
    const video = this.childVideo

    this.elementTimer = new ElementTimer(this.el, this.duration, this.debug)

    if (video) {
      this.videoListener = new VideoActionListener(window, video, eventBus, actionBus, this.debug)

      video.addEventListener(this.videoTimeEvent, () => {
        this.elementTimer!.emit(TIMER_EVENTS.OnInterval, video.currentTime)
      })

      video.addEventListener(this.videoEndEvent, () => {
        this.elementTimer!.emit(TIMER_EVENTS.OnEnd)
      })

      if (videoState.autoplay) {
        await video?.play()
      }
    } else {
      this.elementTimer.beginInternalTimer()
    }

    const activated: any = []
    this.elementTimer.on(TIMER_EVENTS.OnInterval, async (time: number) => {
      await this.route.activateActions(this.actionActivators, ActionActivationStrategy.AtTime, (activator) => {
        if (activated.includes(activator)) return false
        if (activator.time && time >= activator.time) {
          activated.push(activator)
          return true
        }
        return false
      })
    })

    this.elementTimer.on(TIMER_EVENTS.OnEnd, async () => {
      if (videoState.autoplay) {
        await this.next('timer', TIMER_EVENTS.OnEnd)
      }
    })
  }

  private async captureChildElements(el:HTMLElement) {
    debugIf(this.debug, `x-app-view-do: ${this.url} resolve children called`)

    captureXBackClickEvent(el, (tag) => {
      this.back(tag, 'clicked')
    })

    captureXNextClickEvent(el, (tag, route) => {
      this.next(tag, 'clicked', route)
    })

    captureXLinkClickEvent(el, (tag, route) => {
      this.next(tag, 'clicked', route)
    })
  }

  private cleanup() {
    const remoteContent = this.el.querySelector(`#${this.contentKey}`)
    remoteContent?.remove()
    this.childVideo?.pause()
    this.videoListener?.destroy()
    this.elementTimer?.destroy()
  }

  private back(element: string, eventName: string) {
    debugIf(this.debug, `x-app-view-do: back fired from ${element}:${eventName}`)
    this.cleanup()
    this.route?.router.history.goBack()
  }

  private async next(element: string, eventName: string, route?: string | null) {
    debugIf(this.debug, `x-app-view-do: next fired from ${element}:${eventName}`)
    const valid = getChildInputValidity(this.el)
    if (valid) {
      recordVisit(this.visit, this.url)
      this.cleanup()
      if (route) {
        this.route.goToRoute(route)
      } else {
        this.route.router.goToParentRoute()
      }
    }
  }

  render() {
    debugIf(this.debug, `x-app-view-do: ${this.url} render`)
    this.el.querySelector(`#${this.contentKey}`)?.remove()
    if (this.contentElement && this.match?.isExact)
      this.el.append(this.contentElement)
    return (
      <Host hidden={!this.match?.isExact}>
        <slot />
        <slot name="content" />
      </Host>
    )
  }

  async componentDidRender() {
    debugIf(this.debug, `x-app-view-do: ${this.url} did render`)
    if (this.match?.isExact) {
      await this.route?.activateActions(this.actionActivators, ActionActivationStrategy.OnEnter)
    } else if (this.route?.didExit()) {
      await this.route?.activateActions(this.actionActivators, ActionActivationStrategy.OnExit)
    }
    await this.route?.loadCompleted()
  }

  disconnectedCallback() {
    this.cleanup()
    this.dataSubscription?.call(this)
    this.route.destroy()
  }
}
