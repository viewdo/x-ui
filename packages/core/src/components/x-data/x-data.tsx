import { Component, h, Host, Prop } from '@stencil/core'
import { debugIf } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { DataListener } from '../../services/data/actions'
import { clearDataProviders } from '../../services/data/factory'
import { dataState } from '../../services/data/state'

@Component({
  tag: 'x-data',
  shadow: true,
})
export class XData {
  private listener!: DataListener

  /**
   * The wait-time, in milliseconds to wait for
   * un-registered data providers found in an expression.
   * This is to accommodate a possible lag between
   * evaluation before the first view-do 'when' predicate
   * an the registration process.
   */
  @Prop() providerTimeout: number = 500

  componentWillLoad() {
    debugIf(
      commonState.debug,
      `x-data: Data services enabled. Data listener registered`,
    )

    this.listener = new DataListener()
    dataState.enabled = true
    dataState.providerTimeout = this.providerTimeout
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }

  disconnectedCallback() {
    this.listener.destroy()
    clearDataProviders()
  }
}
