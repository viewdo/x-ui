import { MockWindow } from '@stencil/core/mock-doc'
import { IEventEmitter } from '../../actions/interfaces'
import { INTERFACE_EVENTS } from '../interfaces'
import { interfaceState, onInterfaceChange } from '../state'

export class DefaultInterfaceProvider {
  private body: HTMLBodyElement
  private disposeThemeSubscription!: () => void

  constructor(win: MockWindow | Window = window, eventBus?: IEventEmitter) {
    interfaceState.theme = win?.localStorage.getItem('theme') || 'light'

    this.disposeThemeSubscription = onInterfaceChange('theme', (t) => {
      win?.localStorage.setItem('theme', t || 'light')
      eventBus?.emit(INTERFACE_EVENTS.ThemeChanged, t)
    })

    this.body = win.document.body as HTMLBodyElement
  }

  setTheme(theme: 'dark' | 'light') {
    interfaceState.theme = theme
  }

  elementToggleClass(args: any) {
    const { selector, className } = args
    if (!className) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && className) element.classList.toggle(className)
  }

  elementAddClasses(args: any) {
    const { selector, classes } = args
    if (!classes) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && classes)
      classes.split(' ').forEach((c: string) => {
        element.classList.add(c)
      })
  }

  elementRemoveClasses(args: any) {
    const { selector, classes } = args
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && classes)
      classes?.split(' ').forEach((c: string) => {
        element?.classList.remove(c)
      })
  }

  elementSetAttribute(args: any) {
    const { selector, attribute, value } = args
    if (!attribute) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && attribute) element.setAttribute(attribute, value || '')
  }

  elementRemoveAttribute(args: any) {
    const { selector, attribute } = args
    if (!attribute) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && attribute) element?.removeAttribute(attribute)
  }

  elementCallMethod(args: any) {
    const { selector, method, data } = args
    if (!method) return
    const element = this.body.querySelector(selector)
    if (element) {
      const elementMethod = element[method]
      if (elementMethod && typeof element === 'function') {
        elementMethod(data)
      }
    }
  }

  console(args: any) {
    window?.console.table(args)
  }

  destroy() {
    this.disposeThemeSubscription()
  }
}
