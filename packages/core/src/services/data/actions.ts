import { EventAction, IEventActionListener, IEventEmitter } from '../actions';
import { debounce } from '../common/functions';
import { debugIf, warn } from '../common/logging';
import { interfaceState } from '../interface/state';
import { storageAvailable } from './browser/browser-utils';
import { SessionProvider } from './browser/session';
import { StorageProvider } from './browser/storage';
import {
  DataProviderRegistration,
  DATA_COMMANDS,
  DATA_EVENTS,
  DATA_PROVIDER,
  DATA_TOPIC,
  IDataProvider,
  SetData
} from './interfaces';
import { addDataProvider, getDataProvider } from './providers/factory';

export class DataListener implements IEventActionListener {
  private eventBus!: IEventEmitter
  disposeHandles: Array<() => void> = []
  emitChange!: Function
  public initialize(window: Window, actionBus: IEventEmitter, eventBus: IEventEmitter) {
    this.eventBus = eventBus
    const handle = actionBus.on(DATA_TOPIC, (e) => {
      this.handleAction(e)
    })
    this.disposeHandles.push(handle)

    this.registerBrowserProviders(window)

    this.emitChange = debounce(
      300,
      () => {
        this.eventBus.emit(DATA_EVENTS.DataChanged, {})
      },
      false,
    )
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
      this.emitChange()
    })
    this.disposeHandles.push(handle)
    addDataProvider(name, provider)
  }

  async handleAction(actionEvent: EventAction<DataProviderRegistration | SetData>) {
    debugIf(interfaceState.debug, `data-listener: action received {command:${actionEvent.command}}`)
    if (actionEvent.command === DATA_COMMANDS.RegisterDataProvider) {
      const { name, provider } = actionEvent.data as DataProviderRegistration
      if (name && provider) {
        this.registerProvider(name, provider)
      }
    } else if (actionEvent.command === DATA_COMMANDS.SetData) {
      const { provider } = actionEvent.data as SetData
      let data = actionEvent.data as SetData
      debugIf(interfaceState.debug, `data-provider: ${provider} set-data`)
      if (provider) {
        const instance = await getDataProvider(provider)
        if (instance) {
          Object.keys(data)
            .filter((k) => k != 'provider')
            .forEach(async (key) => {
              await instance.set(key, data[key])
            })
        }
      }
    }
  }

  destroy() {
    this.disposeHandles.forEach((h) => h?.call(this))
  }
}
