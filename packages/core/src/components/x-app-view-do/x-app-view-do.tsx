import {
  Component,
  Element,
  forceUpdate,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { debugIf, slugify } from '../../services/common'
import { warn } from '../../services/common/logging'
import { getRemoteContent } from '../../services/content/remote'
import { DATA_EVENTS } from '../../services/data'
import {
  ElementTimer,
  replaceHtmlInElement,
  resolveChildElementXAttributes,
} from '../../services/elements'
import {
  ActionActivationStrategy,
  actionBus,
  eventBus,
} from '../../services/events'
import { VisitStrategy } from '../../services/navigation'
import { MatchResults, Route } from '../../services/routing'
import { ViewDoService } from './view-do'

/**
 * The \<x-app-view-do\> element represents a specialized child-route for a parent \<x-app-view\> component.
 * It represents a sub-route that has special presentation and workflow behaviors.
 *
 * They are used to create presentation, wizards, input workflows, or step by step instructions or
 * wherever you want guided or automatic navigation. These are the only routes that support
 * audio, video and timed actions.
 *
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
  private service?: ViewDoService

  // private videoListener?: VideoActionListener
  // private elementTimer?: ElementTimer

  @Element() el!: HTMLXAppViewDoElement
  @State() match: MatchResults | null = null
  @State() contentElement: HTMLElement | null = null
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
  @Prop() mode: RequestMode = 'cors'

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

  private get parentView() {
    return this.el.closest('x-app-view')
  }

  private get routeContainer() {
    return this.el.closest('x-app')
  }

  private get actionActivators(): HTMLXActionActivatorElement[] {
    return Array.from(this.el.querySelectorAll('x-action-activator'))
  }

  componentWillLoad() {
    debugIf(this.debug, `x-app-view-do: ${this.url} loading`)

    if (!this.routeContainer) {
      warn(
        `x-app-view-do: ${this.url} cannot load outside of an x-app element`,
      )
      return
    }

    if (!this.parentView) {
      warn(
        `x-app-view-do: ${this.url} cannot load outside of an x-app element`,
      )
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

    this.dataSubscription = eventBus.on(
      DATA_EVENTS.DataChanged,
      () => {
        debugIf(this.debug, 'x-app-view-do: data changed ')
        if (this.match?.isExact) forceUpdate(this.el)
      },
    )

    this.contentKey = `remote-content-${slugify(
      this.contentSrc || 'none',
    )}`
  }

  async componentWillRender() {
    debugIf(this.debug, `x-app-view-do: ${this.url} will render`)

    if (this.match?.isExact) {
      debugIf(this.debug, `x-app-view-do: ${this.url} on-enter`)

      this.service = new ViewDoService(
        this.el,
        new ElementTimer(
          window,
          this.nextAfter,
          performance.now(),
          this.debug,
        ),
        this.route,
        this.url,
        this.visit,
        actionBus,
        eventBus,
        this.videoTarget,
        this.videoTimeEvent,
        this.videoEndEvent,
        this.nextAfter,
        this.debug,
      )
      this.contentElement = await this.resolveContentElement()
      if (this.contentElement)
        await this.service.captureChildElements(this.contentElement)

      await this.service.beginTimer()
    } else {
      this.service?.cleanup()
    }
  }

  private async resolveContentElement() {
    if (!this.contentSrc) {
      return null
    }

    try {
      const content = await getRemoteContent(
        window,
        this.contentSrc!,
        this.mode,
        this.resolveTokens,
      )
      if (content == null) return null

      const div = document.createElement('div')
      div.slot = 'content'
      div.innerHTML = content
      div.id = this.contentKey!
      await resolveChildElementXAttributes(div)
      this.route.captureInnerLinks(div)
      return div
    } catch {
      warn(
        `x-app-view-do: ${this.url} Unable to retrieve from ${this.contentSrc}`,
      )
      return null
    }
  }

  render() {
    debugIf(this.debug, `x-app-view-do: ${this.url} render`)
    replaceHtmlInElement(
      this.el,
      `#${this.contentKey}`,
      this.contentElement,
    )
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
      await this.route?.activateActions(
        this.actionActivators,
        ActionActivationStrategy.OnEnter,
      )
    } else if (this.route?.didExit()) {
      await this.route?.activateActions(
        this.actionActivators,
        ActionActivationStrategy.OnExit,
      )
    }
    await this.route?.loadCompleted()
  }

  disconnectedCallback() {
    this.dataSubscription?.call(this)
    this.service?.cleanup?.call(this)
    this.route.destroy()
  }
}
