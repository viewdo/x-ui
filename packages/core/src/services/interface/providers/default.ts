import { MockWindow } from '@stencil/core/mock-doc'
import { log, warn } from '../../common/logging'
import { IEventEmitter } from '../../events/interfaces'
import { INTERFACE_EVENTS } from '../interfaces'
import { interfaceState, onInterfaceChange } from '../state'

export class DefaultInterfaceProvider {
  private disposeThemeSubscription!: () => void

  constructor(win: MockWindow | Window = window, eventBus?: IEventEmitter) {
    interfaceState.theme = win?.localStorage.getItem('theme') || null

    this.disposeThemeSubscription = onInterfaceChange('theme', (t) => {
      win?.localStorage.setItem('theme', t || 'light')
      eventBus?.emit(INTERFACE_EVENTS.ThemeChanged, t)
    })
  }

  setTheme(theme: 'dark' | 'light') {
    interfaceState.theme = theme
  }

  log(args: any) {
    const { message } = args
    if (message) {
      log(message)
    } else {
      console.table(args)
    }
  }

  warn(args: any) {
    const { message } = args
    if (message) {
      warn(message)
    } else {
      console.table(args)
    }
  }

  dir(args: any) {
    console.dir(args)
  }

  destroy() {
    this.disposeThemeSubscription()
  }
}
