import { Component, h, Host, Prop, State } from '@stencil/core';
import { DATA_EVENTS, evaluatePredicate, eventBus, ROUTE_EVENTS } from '../..';

/**
 *  @system data
 */
@Component({
  tag: 'x-data-show',
  shadow: false,
})
export class XDataShow {
  private subscriptionData!: () => void
  private subscriptionRoutes!: () => void
  @State() show = true

  /**
   The data expression to obtain a predicate for conditionally rendering
   the inner-contents of this element.
   @example {session:user.name}
   */
  @Prop() when!: string

  componentWillLoad() {
    this.subscriptionData = eventBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.evaluatePredicate()
    })
    this.subscriptionRoutes = eventBus.on(ROUTE_EVENTS.RouteChanged, async () => {
      await this.evaluatePredicate()
    })
  }

  async componentWillRender() {
    await this.evaluatePredicate()
  }

  private async evaluatePredicate() {
    this.show = await evaluatePredicate(this.when)
  }

  disconnectedCallback() {
    this.subscriptionData()
    this.subscriptionRoutes()
  }

  render() {
    if (this.show) {
      return (
        <Host>
          <slot />
        </Host>
      )
    }

    return (
      <Host hidden>
        <slot />
      </Host>
    )
  }
}
