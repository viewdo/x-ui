import { Component, Element, h, Prop, State } from '@stencil/core'
import { eventBus, MatchResults, RouterService, ROUTE_EVENTS } from '../..'

/**
 *  @system navigation
 */
@Component({
  tag: 'x-link',
  shadow: false,
})
export class XViewLink {
  private subscription!: () => void
  @Element() el!: HTMLXLinkElement
  @State() match?: MatchResults | null

  private get router(): RouterService | undefined {
    return this.el.closest('x-ui')?.router
  }

  /**
   *
   */
  @Prop({ mutable: true }) href!: string

  /**
   *
   */
  @Prop() activeClass = 'link-active'

  /**
   *
   */
  @Prop() exact = false

  /**
   *
   */
  @Prop() strict = true

  /**
   *
   */
  @Prop() custom = 'a'

  /**
   *
   */
  @Prop() anchorClass?: string

  /**
   *
   */
  @Prop() anchorRole?: string

  /**
   *
   */
  @Prop() anchorTitle?: string

  /**
   *
   */
  @Prop() anchorTabIndex?: string

  /**
   *
   */
  @Prop() anchorId?: string

  /**
   *
   */
  @Prop() ariaHaspopup?: string

  /**
   *
   */
  @Prop() ariaPosinset?: string

  /**
   *
   */
  @Prop() ariaSetsize?: number

  /**
   *
   */
  @Prop() ariaLabel?: string

  get parentUrl() {
    return this.el.closest('x-view-do')?.url || this.el.closest('x-view')?.url
  }

  componentWillLoad() {
    this.subscription = eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
      this.match = this.router?.matchPath({
        path: this.href,
        exact: this.exact,
        strict: this.strict,
      })
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
    this.subscription?.call(this)
  }

  // Get the URL for this route link without the root from the router
  render() {
    let anchorAttributes: Record<string, any> = {
      class: {
        [this.activeClass]: this.match !== null,
      },
      onClick: this.handleClick.bind(this),
    }

    if (this.anchorClass) {
      anchorAttributes.class[this.anchorClass] = true
    }

    if (this.custom === 'a') {
      anchorAttributes = {
        ...anchorAttributes,
        'href': this.href,
        'title': this.anchorTitle,
        'role': this.anchorRole,
        'tabindex': this.anchorTabIndex,
        'aria-haspopup': this.ariaHaspopup,
        'id': this.anchorId,
        'aria-posinset': this.ariaPosinset,
        'aria-setsize': this.ariaSetsize,
        'aria-label': this.ariaLabel,
        'x-link-attached': '',
      }
    }

    return (
      <this.custom {...anchorAttributes}>
        <slot />
      </this.custom>
    )
  }
}
