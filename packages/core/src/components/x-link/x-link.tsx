import { Component, Element, forceUpdate, h, Host, Prop, State } from '@stencil/core';
import { debugIf, eventBus, MatchResults, RouterService, ROUTE_EVENTS } from '../..';

/**
 *  @system navigation
 */
@Component({
  tag: 'x-link',
  styleUrl: 'x-link.scss',
  shadow: true,
})
export class XLink {
  private subscriptionDispose!: () => void
  @Element() el!: HTMLXLinkElement
  @State() match?: MatchResults | null

  private get router(): RouterService | undefined {
    return this.el.closest('x-ui')?.router
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
   * Only active on the exact href match
   * no not on child routes
   */
  @Prop() exact = true

  /**
   * Only active on the exact href match
   * using every aspect of the URL.
   */
  @Prop() strict = true

  /**
   *
   */
  @Prop() debug = false


  get parentUrl() {
    return this.el.closest('x-view-do')?.url || this.el.closest('x-view')?.url
  }

  componentWillLoad() {
    this.subscriptionDispose = eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
      const match = this.router!.matchPath({
        path: this.href,
        exact: this.exact,
        strict: this.strict,
      })

      if (this.match != match) {
        debugIf(this.debug, `x-link: ${this.href} FORCING CHANGE`)
        forceUpdate(this)
      }
      this.match = match
    })
    this.match = this.router?.matchPath({
      path: this.href,
      exact: this.exact,
      strict: this.strict,
    })
  }

  private handleClick(e: MouseEvent) {
    const router = this.router
    if (!router || router?.isModifiedEvent(e) || !router?.history || !this.href) {
      return
    }

    e.preventDefault()
    const path = router.resolvePathname(this.href, this.parentUrl)
    router.history.push(path)
  }

  disconnectedCallback() {
    this.subscriptionDispose?.call(this)
  }

  // Get the URL for this route link without the root from the router
  render() {
    debugIf(this.debug, `x-link: ${this.href} matched: ${this.match != null}`)

    const classes = {
        [this.activeClass]: this.match !== null,
        [this.el.className]: true
    }

    let anchorAttributes: Record<string, any> = {
      title: this.el.title,
      role: this.el.getAttribute('aria-role'),
      tabindex: this.el.tabIndex,
      id: this.el.id,
      class: classes
    }

    return (
      <Host onClick={(e:MouseEvent) => this.handleClick(e)}>
        <a href={this.href} title={this.el.title}
          {...anchorAttributes} part="anchor"
          x-attached-click
          onClick={(e:MouseEvent) => e.preventDefault()}>
          <slot />
        </a>
      </Host>
    )
  }
}
