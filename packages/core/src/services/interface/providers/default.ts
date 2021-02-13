import { MockWindow } from '@stencil/core/mock-doc'
import { createStore } from '@stencil/store'
import { IEventEmitter } from '../../actions/interfaces'
import { InterfaceState, INTERFACE_EVENTS } from '../interfaces'

export class DefaultInterfaceProvider {
  private state: InterfaceState
  private body: HTMLBodyElement
  private disposeThemeSubscription!: () => void
  private disposeMuteSubscription!: () => void
  private disposeAutoPlaySubscription!: () => void

  constructor(win: MockWindow | Window = window, eventBus?: IEventEmitter) {
    const { state, onChange } = createStore<InterfaceState>({
      theme: win?.localStorage.getItem('theme') || 'light',
      muted: win?.localStorage.getItem('muted') === 'true',
      autoplay: win?.localStorage.getItem('autoplay') === 'true',
    })

    this.disposeThemeSubscription = onChange('theme', (t) => {
      win?.localStorage.setItem('theme', t.toString())
      eventBus?.emit(INTERFACE_EVENTS.ThemeChanged, t)
    })
    this.disposeMuteSubscription = onChange('muted', (m) => {
      win?.localStorage.setItem('muted', m.toString())
      eventBus?.emit(INTERFACE_EVENTS.SoundChanged, m)
    })
    this.disposeAutoPlaySubscription = onChange('autoplay', (a) => {
      win?.localStorage.setItem('autoplay', a.toString())
      eventBus?.emit(INTERFACE_EVENTS.AutoPlayChanged, a)
    })

    this.state = state
    this.body = win.document.body as HTMLBodyElement
  }

  setTheme(theme: 'dark' | 'light') {
    this.state.theme = theme
  }

  setAutoPlay(autoplay: boolean) {
    this.state.autoplay = autoplay
  }

  setMute(muted: boolean) {
    this.state.muted = muted
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
    this.disposeAutoPlaySubscription()
    this.disposeMuteSubscription()
    this.disposeThemeSubscription()
  }
}
