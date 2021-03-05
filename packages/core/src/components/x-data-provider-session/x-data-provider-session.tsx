import { Component, Element, h, Host, Prop } from '@stencil/core'
import {
  DataProviderRegistration,
  DATA_COMMANDS,
  DATA_TOPIC,
  IDataProvider,
} from '../../services/data/interfaces'
import { EventAction } from '../../services/events'
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
    const customEvent = new CustomEvent<
      EventAction<DataProviderRegistration>
    >('x:actions', {
      detail: {
        topic: DATA_TOPIC,
        command: DATA_COMMANDS.RegisterDataProvider,
        data: {
          name: this.name,
          provider: this.provider,
        },
      },
    })
    this.el.ownerDocument.body.dispatchEvent(customEvent)
  }

  async componentWillLoad() {
    this.provider = new SessionProvider()
    this.registerProvider()
  }

  render() {
    return <Host hidden></Host>
  }
}
