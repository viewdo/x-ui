import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import {
  ActionActivationStrategy,
  actionBus,
  DATA_EVENTS,
  debugIf,
  eventBus,
  interfaceState,
  MatchResults,
  recordVisit,
  Route,
  VideoActionListener,
  VisitStrategy,
  warn
} from '../..';
import {
  captureXBackClickEvent,
  captureXLinkClickEvent,
  captureXNextClickEvent, ElementTimer,

  getChildInputValidity, resolveChildElementXAttributes,
  TIMER_EVENTS
} from '../../services/elements';
import { createKey } from '../../services/routing/utils/location-utils';

/**
 *  @system routing
 */
@Component({
  tag: 'x-view-do',
  styleUrl: 'x-view-do.scss',
  shadow: true,
})
export class XViewDo {
  private dataChangedSubscription!: () => void
  private route!: Route
  private videoListener?: VideoActionListener
  private elementTimer?: ElementTimer

  @Element() el!: HTMLXViewDoElement
  @State() match: MatchResults | null = null
  @State() contentKey?: string | null

  /**
   * The title for this view. This is prefixed
   * before the app title configured in x-ui
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
  @Prop() url!: string

  /**
   * The url for this route should only be matched
   * when it is exact.
   */
  @Prop() exact:boolean = true

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
   *  How should this page be presented
   *  (coming soon)
   */
  @Prop() display: 'page' | 'modal' | 'full' = 'page'

  /**
   * To debug timed elements, set this value to true.
   */
  @Prop() debug = false

  private get duration() {
    return this.childVideo?.duration || this.nextAfter
  }

  private get parentView() {
    return this.el.closest('x-view')
  }

  private get routeContainer() {
    return this.el.closest('x-ui')
  }

  private get childVideo(): HTMLVideoElement | null {
    return this.el.querySelector('vm-player,video')
  }

  private get actionActivators(): HTMLXActionActivatorElement[] {
    return Array.from(this.el.querySelectorAll('x-action-activator'))
  }

  async componentWillLoad() {
    debugIf(this.debug, `x-view-do: ${this.url} loading`)

    if (!this.routeContainer) {
      warn(`x-view-do: ${this.url} cannot load outside of an x-ui element`)
      return
    }

    if (!this.parentView) {
      warn(`x-view-do: ${this.url} cannot load outside of an x-ui element`)
      return
    }

    this.route = this.routeContainer.router.createRoute(
      this.el,
      this.url,
      this.exact,
      this.pageTitle,
      this.transition || this.parentView.transition || null,
      this.scrollTopOffset || 0,
      (match) => {
        this.match = match
      },
    )
    this.match = this.route.match

    this.dataChangedSubscription = eventBus.on(DATA_EVENTS.DataChanged, async () => {
      debugIf(this.debug, 'x-view-do: data changed ')
      await resolveChildElementXAttributes(this.el)
    })
  }

  private activateActions(
    forEvent: ActionActivationStrategy,
    filter: (activator: HTMLXActionActivatorElement) => boolean = (_a) => true,
  ) {
    this.actionActivators
      .filter((activator) => activator.activate === forEvent)
      .filter(filter)
      .forEach(async (activator) => {
        await activator.activateActions()
      })
  }

  async componentWillRender() {
    debugIf(this.debug, `x-view-do: ${this.url} will render`)
    await this.resolveView()
  }

  private async resolveView() {
    debugIf(this.debug, `x-view-do: ${this.url} resolve view called`)

    if (this.match?.isExact) {
      debugIf(this.debug, `x-view-do: ${this.url} on-enter`)
      await this.fetchHtml()
      await this.activateView()
      this.el.removeAttribute('hidden')
    } else {
      this.cleanup()
      this.el.setAttribute('hidden', '')
    }
  }

  private async activateView() {
    this.activateActions(ActionActivationStrategy.OnEnter)
    await this.setupTimer()
    await this.route.loadCompleted()
    await this.captureChildElements()
  }

  private async fetchHtml() {
    if (!this.contentSrc || this.contentKey) {
      return
    }

    try {
      const response = await fetch(this.contentSrc)
      if (response.status === 200) {
        this.contentKey = `remote-content-${createKey(10)}`
        const innerContent = await response.text()
        const content = this.el.ownerDocument.createElement('div')
        content.slot = 'content'
        content.id = this.contentKey!
        content.innerHTML = innerContent
        if (this.route.transition) content.className = this.route.transition
        await resolveChildElementXAttributes(content)
        this.el.append(content)
      } else {
        warn(`x-view-do: ${this.url} Unable to retrieve from ${this.contentSrc}`)
      }
    } catch {
      warn(`x-view-do: ${this.url} Unable to retrieve from ${this.contentSrc}`)
    }
  }

  private async captureChildElements() {
    debugIf(this.debug, `x-view-do: ${this.url} resolve children called`)

    captureXBackClickEvent(this.el, (tag) => {
      this.back(tag, 'clicked')
    })

    captureXNextClickEvent(this.el, (tag, route) => {
      this.next(tag, 'clicked', route)
    })

    captureXLinkClickEvent(this.el, (tag, route) => {
      this.next(tag, 'clicked', route)
    })

    await resolveChildElementXAttributes(this.el)

    this.route.captureInnerLinks()
  }

  private async setupTimer() {
    const video = this.childVideo

    const timeUpdateEvent = 'vmCurrentTimeChange'

    this.elementTimer = new ElementTimer(
      this.el,
      this.duration,
      this.debug)

    if (video) {
      this.videoListener = new VideoActionListener(video, eventBus, actionBus, this.debug)

      video.addEventListener(timeUpdateEvent, () => {
        this.elementTimer!.emit(
          TIMER_EVENTS.OnInterval,
          video.currentTime)
      })

      video.addEventListener('vmPlaybackEnded', () => {
        this.elementTimer!.emit(
          TIMER_EVENTS.OnEnd)
      })

      video.addEventListener('end', () => {
        this.elementTimer!.emit(
          TIMER_EVENTS.OnEnd)
      })

      if (interfaceState.autoplay) {
        await video?.play()
      }
    } else {
      this.elementTimer.beginInternalTimer()
    }

    this.elementTimer.on(TIMER_EVENTS.OnInterval, (time: number) => {
      this.activateActions(ActionActivationStrategy.AtTime, (activator) =>
        activator.time ? time >= activator.time : false,
      )
    })

    this.elementTimer.on(TIMER_EVENTS.OnEnd, () => {
      if (interfaceState.autoplay) {
        this.cleanup()
        this.next('timer', TIMER_EVENTS.OnEnd)
      }
    })
  }

  componentDidRender() {
    debugIf(this.debug, `x-view-do: ${this.url} did render`)
  }

  private resetContent() {
    const remoteContent = this.el.querySelector(`#${this.contentKey}`)
    remoteContent?.remove()
    this.contentKey = null
    this.match = null
  }

  private cleanup() {
    this.resetContent()
    this.childVideo?.pause()
    this.videoListener?.destroy()
    this.elementTimer?.destroy()
  }

  private back(element: string, eventName: string) {
    debugIf(this.debug, `x-view-do: back fired from ${element}:${eventName}`)
    this.cleanup()
    this.route?.router.history.goBack()
  }

  private next(element: string, eventName: string, route?: string | null) {
    debugIf(this.debug, `x-view-do: next fired from ${element}:${eventName}`)

    const valid = getChildInputValidity(this.el)
    if (valid) {
      recordVisit(this.visit, this.url)
      this.cleanup()
      this.activateActions(ActionActivationStrategy.OnExit)
      if (route) {
        this.route.goToRoute(route)
      } else {
        this.route.router.goToParentRoute()
      }
    }
  }

  disconnectedCallback() {
    this.dataChangedSubscription()
    this.route.destroy()
  }

  render() {
    debugIf(this.debug, `x-view-do: ${this.url} render`)

    return (
      <Host class={this.route?.transition || ''}>
        <slot />
        <slot name="content" />
      </Host>
    )
  }
}
