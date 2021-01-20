import { EventAction, IEventActionListener, IEventEmitter } from '../actions'
import { interfaceState } from '../interface/state'
import { debugIf, warn } from '../logging'
import { storageAvailable } from '../routing/utils/browser-utils'
import {
  DataProviderRegistration,
  DATA_COMMANDS,
  DATA_EVENTS,
  DATA_PROVIDER,
  DATA_TOPIC,
  IDataProvider,
  SetData,
} from './interfaces'
import { addDataProvider, getDataProvider } from './providers/factory'
import { SessionProvider } from './providers/session'
import { StorageProvider } from './providers/storage'

export class DataListener implements IEventActionListener {
  private eventBus!: IEventEmitter
  disposeHandles: Array<() => void> = []
  public initialize(window: Window, actionBus: IEventEmitter, eventBus: IEventEmitter) {
    this.eventBus = eventBus
    const handle = actionBus.on(DATA_TOPIC, (e) => {
      this.handleAction(e)
    })
    this.disposeHandles.push(handle)

    this.registerBrowserProviders(window)
  }

  registerBrowserProviders(win: Window) {
    if (storageAvailable(win, 'sessionStorage')) {
      this.registerProvider(DATA_PROVIDER.SESSION, new SessionProvider())
    } else {
      warn('data-provider: session not supported')
    }

    if (storageAvailable(win, 'localStorage')) {
      this.registerProvider(DATA_PROVIDER.STORAGE, new StorageProvider())
    } else {
      warn('data-provider: storage not supported')
    }
  }

  registerProvider(name: string, provider: IDataProvider) {
    const handle = provider.changed.on(DATA_EVENTS.DataChanged, () => {
      debugIf(interfaceState.debug, `data-provider: ${name} changed`)
      this.eventBus.emit(DATA_EVENTS.DataChanged, {})
    })
    this.disposeHandles.push(handle)
    addDataProvider(name, provider)
  }

  handleAction(actionEvent: EventAction<DataProviderRegistration | SetData>) {
    debugIf(interfaceState.debug, `data-listener: action received {command:${actionEvent.command}}`)
    if (actionEvent.command === DATA_COMMANDS.RegisterDataProvider) {
      const { name, provider } = actionEvent.data as DataProviderRegistration
      if (name && provider) {
        this.registerProvider(name, provider)
      }
    } else if (actionEvent.command === DATA_COMMANDS.SetData) {
      const { provider, values } = actionEvent.data as SetData
      debugIf(interfaceState.debug, `data-provider: ${provider} set-data`)
      if (provider && values) {
        const instance = getDataProvider(provider)
        if (instance) {
          Object.keys(values).forEach(async (key) => {
            await instance.set(key, values[key])
          })
        }
      }
    }
  }

  destroy() {
    this.disposeHandles.forEach((h) => h?.call(this))
  }
}
