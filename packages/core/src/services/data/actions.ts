import { commonState, debounce, debugIf } from '../common'
import {
  EventAction,
  IEventActionListener,
  IEventEmitter,
} from '../events'
import { addDataProvider, getDataProvider } from './factory'
import {
  DataProviderRegistration,
  DATA_COMMANDS,
  DATA_EVENTS,
  DATA_TOPIC,
  IDataProvider,
  SetData,
} from './interfaces'

export class DataListener implements IEventActionListener {
  private eventBus!: IEventEmitter
  disposeHandles: Array<() => void> = []
  emitChange!: Function
  public initialize(
    _window: Window,
    actionBus: IEventEmitter,
    eventBus: IEventEmitter,
  ) {
    this.eventBus = eventBus
    const handle = actionBus.on(DATA_TOPIC, e => {
      this.handleAction(e)
    })
    this.disposeHandles.push(handle)

    //this.registerBrowserProviders(window)

    this.emitChange = debounce(
      300,
      () => {
        this.eventBus.emit(DATA_EVENTS.DataChanged, {})
      },
      false,
    )
  }

  // registerBrowserProviders(win: Window) {
  //   if (storageAvailable(win, 'sessionStorage')) {
  //     this.registerProvider(DATA_PROVIDER.SESSION, new SessionProvider())
  //   } else {
  //     warn('data-provider: session not supported')
  //   }
  //   if (storageAvailable(win, 'localStorage')) {
  //     this.registerProvider(DATA_PROVIDER.STORAGE, new StorageProvider())
  //   } else {
  //     warn('data-provider: storage not supported')
  //   }
  // }

  registerProvider(name: string, provider: IDataProvider) {
    const handle = provider.changed.on(
      DATA_EVENTS.DataChanged,
      () => {
        debugIf(commonState.debug, `data-provider: ${name} changed`)
        this.emitChange()
      },
    )
    this.disposeHandles.push(handle)
    addDataProvider(name, provider)
  }

  async handleAction(
    actionEvent: EventAction<DataProviderRegistration | SetData>,
  ): Promise<void> {
    debugIf(
      commonState.debug,
      `data-listener: action received {command:${actionEvent.command}}`,
    )
    if (actionEvent.command === DATA_COMMANDS.RegisterDataProvider) {
      const {
        name,
        provider,
      } = actionEvent.data as DataProviderRegistration
      if (name && provider) {
        this.registerProvider(name, provider)
      }
    } else if (actionEvent.command === DATA_COMMANDS.SetData) {
      const { provider } = actionEvent.data as SetData
      let data = actionEvent.data as SetData
      debugIf(
        commonState.debug,
        `data-provider: ${provider} set-data`,
      )
      if (provider) {
        const instance = await getDataProvider(provider)
        if (instance) {
          await Promise.all(
            Object.keys(data)
              .filter(k => k != 'provider')
              .map(key => instance.set(key, data[key])),
          )
        }
      }
    }
  }

  destroy() {
    this.disposeHandles.forEach(h => h?.call(this))
  }
}
