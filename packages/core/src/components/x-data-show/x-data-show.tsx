import { Component, Element, forceUpdate, h, Host, Prop, State } from '@stencil/core'
import { eventBus } from '../../services/actions'
import { DATA_EVENTS, evaluatePredicate } from '../../services/data'
import { ROUTE_EVENTS } from '../../services/routing'

/**
 *  @system data
 */
@Component({
  tag: 'x-data-show',
  shadow: false,
})
export class XDataShow {
  @Element() el!: HTMLXDataShowElement
  private subscriptionData!: () => void
  private subscriptionRoutes!: () => void
  @State() show = true

  /**
   The data expression to obtain a predicate for conditionally rendering
   the inner-contents of this element.
   {{session:user.name}}
   */
  @Prop() when!: string

  componentWillLoad() {
    this.subscriptionData = eventBus.on(DATA_EVENTS.DataChanged, () => {
      forceUpdate(this.el)
    })

    this.subscriptionRoutes = eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
      forceUpdate(this.el)
    })
  }

  async componentWillRender() {
    this.show = await evaluatePredicate(this.when)
  }

  disconnectedCallback() {
    this.subscriptionData()
    this.subscriptionRoutes()
  }

  render() {
    return (
      <Host hidden={!this.show}>
        <slot />
      </Host>
    )
  }
}
