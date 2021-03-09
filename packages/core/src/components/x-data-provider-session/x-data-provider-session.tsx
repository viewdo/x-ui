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
import { SessionService } from './session/service'

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
  private provider!: SessionService
  private actionSubscription?: () => void
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
    this.provider = new SessionService(window, eventBus, this.name)
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
