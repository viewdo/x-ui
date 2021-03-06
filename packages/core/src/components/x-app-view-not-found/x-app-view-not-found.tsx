import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/events'
import { ROUTE_EVENTS } from '../../services/routing'
import { RouterService } from '../../services/routing/router'

/**
 * This component should be placed at the end of the content,
 * inside the x-app component. It shows up when no views
 * above it resolve.
 *
 * @system routing
 */
@Component({
  tag: 'x-app-view-not-found',
  shadow: true,
  styles: `:host { display: block; }`,
})
export class XAppViewNotFound {
  private routeSubscription!: () => void
  private finalizeSubscription!: () => void
  @Element() el!: HTMLXAppViewNotFoundElement
  @State() show = false

  /**
   * The router-service instance  (internal)
   *
   */
  @Prop({ mutable: true }) router!: RouterService

  /**
   * The title for this view. This is prefixed
   * before the app title configured in x-app
   *
   */
  @Prop() pageTitle = 'Not Found'

  /**
   * Header height or offset for scroll-top on this
   * view.
   */
  @Prop() scrollTopOffset = 0

  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop() transition?: string

  private get routeContainer() {
    return this.el.closest('x-app')
  }

  componentWillLoad() {
    if (!this.routeContainer || !this.routeContainer.router) {
      return
    }

    this.router = this.routeContainer.router

    this.finalizeSubscription = eventBus.on(
      ROUTE_EVENTS.Finalized,
      () => {
        this.show = this.router.exactRoutes.length == 0
        this.routeSubscription = eventBus.on(
          ROUTE_EVENTS.RouteChanged,
          () => {
            this.show = this.router.exactRoutes.length == 0
          },
        )
      },
    )
  }

  async componentDidRender() {
    this.router.viewsUpdated({
      scrollTopOffset: this.scrollTopOffset,
    })
    if (this.show) {
      await this.router.adjustTitle(this.pageTitle)
    }
  }

  disconnectedCallback() {
    this.finalizeSubscription?.call(this)
    this.routeSubscription?.call(this)
  }

  render() {
    return (
      <Host hidden={!this.show} class={this.transition}>
        <slot />
      </Host>
    )
  }
}
