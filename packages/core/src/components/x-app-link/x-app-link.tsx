import {
  Component,
  Element,
  forceUpdate,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { debugIf } from '../../services/common'
import { eventBus } from '../../services/events'
import {
  MatchResults,
  RouterService,
  ROUTE_EVENTS,
} from '../../services/routing'

/**
 * The element should be used in-place of an `a` tag to navigate without
 * refreshing the page. This element supports an active-class that will
 * be applied when the route in **href** matches the route of the app.
 *
 * This is helpful for displaying active routes in menus, bread-crumbs and tabs.
 *
 * @system navigation
 */
@Component({
  tag: 'x-app-link',
  styleUrl: `x-app-link.scss`,
  shadow: false,
})
export class XLink {
  private routeSubscription!: () => void
  @Element() el!: HTMLXAppLinkElement
  @State() match?: MatchResults | null

  private get router(): RouterService | undefined {
    return this.el.closest('x-app')?.router
  }

  /**
   * The destination route for this link
   */
  @Prop({ mutable: true }) href!: string

  /**
   * The class to add when this HREF is active
   * in the browser
   */
  @Prop() activeClass = 'link-active'

  /**
   * Only active on the exact href match,
   * and not on child routes
   */
  @Prop() exact = false

  /**
   * Only active on the exact href match
   * using every aspect of the URL including
   * parameters.
   */
  @Prop() strict = true

  /**
   * Provide log messages for path matching.
   */
  @Prop() debug = false

  get parentUrl() {
    return (
      this.el.closest('x-app-view-do')?.url ||
      this.el.closest('x-app-view')?.url
    )
  }

  componentWillLoad() {
    if (this.router)
      this.href = this.router!.resolvePathname(
        this.href,
        this.parentUrl || '/',
      )

    this.routeSubscription = eventBus.on(
      ROUTE_EVENTS.RouteChanged,
      () => {
        const match = this.router!.matchPath({
          path: this.href,
          exact: this.exact,
          strict: this.strict,
        })

        if (this.match != match) {
          debugIf(
            this.debug,
            `x-app-link: ${this.href} FORCING CHANGE`,
          )
          forceUpdate(this)
        }
        this.match = match
      },
    )
    this.match = this.router?.matchPath({
      path: this.href,
      exact: this.exact,
      strict: this.strict,
    })
  }

  private handleClick(e: MouseEvent) {
    const router = this.router
    if (
      !router ||
      router?.isModifiedEvent(e) ||
      !router?.history ||
      !this.href
    ) {
      return
    }

    e.preventDefault()
    router.goToRoute(this.href)
  }

  disconnectedCallback() {
    this.routeSubscription?.call(this)
  }

  // Get the URL for this route link without the root from the router
  render() {
    debugIf(
      this.debug,
      `x-app-link: ${this.href} matched: ${this.match != null}`,
    )

    const classes = {
      [this.activeClass]: this.match !== null,
    }

    let anchorAttributes: Record<string, any> = {
      title: this.el.title,
      role: this.el.getAttribute('aria-role'),
      id: this.el.id,
    }

    return (
      <Host>
        <a
          href={this.href}
          title={this.el.title}
          {...anchorAttributes}
          x-attached-click
          class={classes}
          onClick={(e: MouseEvent) => this.handleClick(e)}
        >
          <slot />
        </a>
      </Host>
    )
  }
}
