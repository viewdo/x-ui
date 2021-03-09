import { Component, Element, h, Host, Prop } from '@stencil/core'
import { addDataProvider } from '../../services/data/factory'
import { IDataProvider } from '../../services/data/interfaces'
import { StorageProvider } from './storage/provider'

@Component({
  tag: 'x-data-provider-storage',
  shadow: false,
})

/**
 * This component enables the **Storage Data Provider**, that
 * leverages the browser 'long-term' data storage.
 *
 * @system data
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
    addDataProvider(this.name, this.provider)
  }

  componentWillLoad() {
    this.provider = new StorageProvider(window)
    this.registerProvider()
  }

  render() {
    return <Host hidden></Host>
  }
}
