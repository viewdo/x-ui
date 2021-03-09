import { Component, Element, h, Host, Prop } from '@stencil/core'
import { addDataProvider } from '../../services/data/factory'
import { IDataProvider } from '../../services/data/interfaces'
import { SessionProvider } from './session/provider'

@Component({
  tag: 'x-data-provider-session',
  shadow: false,
})

/**
 *  This component enables the **Session Data Provider**.
 *  It leverages the short-lived browser storage.
 *
 *  @system data
 */
export class XDataProviderSession {
  private provider!: IDataProvider
  @Element() el!: HTMLXDataProviderSessionElement

  /**
   * The key prefix to use in storage
   */
  @Prop() keyPrefix?: string

  /**
   * Provider name to use in x-ui expressions.
   */
  @Prop() name: string = 'session'

  private registerProvider() {
    addDataProvider(this.name, this.provider)
  }

  componentWillLoad() {
    this.provider = new SessionProvider()
    this.registerProvider()
  }

  render() {
    return <Host hidden></Host>
  }
}
