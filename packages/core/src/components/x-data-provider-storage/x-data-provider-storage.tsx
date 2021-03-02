import { Component, Element, h, Host, Prop } from '@stencil/core'
import { DataProviderRegistration, DATA_COMMANDS, DATA_TOPIC, IDataProvider } from '../../services/data'
import { EventAction } from '../../services/events'
import { StorageProvider } from './storage/provider'

@Component({
  tag: 'x-data-provider-storage',
  shadow: false,
})

/**
 *  @system data
 */
export class XDataProviderStorage {
  private provider!: IDataProvider
  @Element() el!: HTMLXDataProviderStorageElement

  /**
  * The key prefix to use in storage
  */
  @Prop() keyPrefix?: string

  /**
   * Provider name to use in x-ui expressions.
   */
  @Prop() name: string = 'storage'


  private registerProvider() {
    const customEvent = new CustomEvent<EventAction<DataProviderRegistration>>('x:actions', {
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
    this.provider = new StorageProvider()
    this.registerProvider()
  }

  render() {
    return (
      <Host hidden>
      </Host>
    )
  }

  

}
