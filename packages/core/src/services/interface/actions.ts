import { MockWindow } from '@stencil/core/mock-doc'
import { EventAction, IEventActionListener, IEventEmitter } from '../actions'
import { debugIf } from '../common/logging'
import { kebabToCamelCase } from '../common/strings'
import { INTERFACE_COMMANDS, INTERFACE_TOPIC } from './interfaces'
import { DefaultInterfaceProvider } from './providers/default'
import { getInterfaceProvider, setInterfaceProvider } from './providers/factory'
import { interfaceState } from './state'

export class InterfaceActionListener implements IEventActionListener {
  actionsSubscription!: () => void
  defaultProvider!: any
  eventBus!: IEventEmitter

  initialize(win: Window | MockWindow, actionBus: IEventEmitter, eventBus: IEventEmitter): void {
    this.eventBus = eventBus
    this.actionsSubscription = actionBus.on(INTERFACE_TOPIC, (e) => {
      this.handleAction(e)
    })
    this.defaultProvider = new DefaultInterfaceProvider(win, eventBus)
  }

  handleAction(actionEvent: EventAction<any>) {
    debugIf(interfaceState.debug, `document-listener: action received ${JSON.stringify(actionEvent)}`)

    if (actionEvent.command === INTERFACE_COMMANDS.RegisterProvider) {
      const { name = 'unknown', provider } = actionEvent.data
      if (provider) {
        setInterfaceProvider(name, provider)
      }
    } else {
      const currentProvider = getInterfaceProvider() as any
      const commandFuncKey = kebabToCamelCase(actionEvent.command)

      // Use the registered provider unless it doesn't implement this command
      let commandFunc = currentProvider ? currentProvider[commandFuncKey] : null
      if (!commandFunc) commandFunc = this.defaultProvider[commandFuncKey]

      if (commandFunc && typeof commandFunc === 'function') {
        commandFunc.call(this.defaultProvider, actionEvent.data)
      }
    }
  }

  destroy() {
    this.actionsSubscription()
    this.defaultProvider?.destroy()
  }
}
