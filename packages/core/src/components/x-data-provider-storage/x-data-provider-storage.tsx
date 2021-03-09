import { Component, Element, Prop } from '@stencil/core'
import {
  addDataProvider,
  removeDataProvider,
} from '../../services/data/factory'
import {
  DATA_COMMANDS,
  SetData,
} from '../../services/data/interfaces'
import {
  actionBus,
  EventAction,
  eventBus,
} from '../../services/events'
import { StorageService } from './storage/service'

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
  private provider!: StorageService
  private actionSubscription?: () => void
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
    this.actionSubscription = actionBus.on(
      this.name,
      async (action: EventAction<SetData>) => {
        if (action.command == DATA_COMMANDS.SetData) {
          const { data } = action
          await Promise.all(
            Object.keys(action.data).map(key =>
              this.provider.set(key, data[key]),
            ),
          )
        }
      },
    )
  }

  componentWillLoad() {
    this.provider = new StorageService(window, eventBus, this.name)
    this.registerProvider()
  }

  disconnectedCallback() {
    removeDataProvider(this.name)
    this.actionSubscription?.call(this)
  }

  render() {
    return null
  }
}
