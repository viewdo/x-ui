import { MockWindow } from '@stencil/core/mock-doc'
import { createStore } from '@stencil/store'
import { OnChangeHandler } from '@stencil/store/dist/types'
import { InterfaceProvider, InterfaceState } from '../interfaces'

export class DefaultInterfaceProvider implements InterfaceProvider {
  state: InterfaceState
  onChange: OnChangeHandler<InterfaceState>
  body: HTMLBodyElement
  constructor(win: MockWindow | Window = window) {
    const { state, onChange } = createStore<InterfaceState>({
      theme: win?.localStorage.getItem('theme') || 'light',
      muted: win?.localStorage.getItem('muted') === 'true',
      autoplay: win?.localStorage.getItem('autoplay') === 'true',
    })

    onChange('theme', (t) => win?.localStorage.setItem('theme', t.toString()))
    onChange('muted', (m) => win?.localStorage.setItem('muted', m.toString()))
    onChange('autoplay', (a) => win?.localStorage.setItem('autoplay', a.toString()))

    this.state = state
    this.onChange = onChange
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
    element?.classList.toggle(className)
  }

  elementAddClasses(args: any) {
    const { selector, classes } = args
    if (!classes) return
    const element = this.body.querySelector(selector) as HTMLElement
    classes?.split(' ').forEach((c: string) => {
      element?.classList.add(c)
    })
  }

  elementRemoveClasses(args: any) {
    const { selector, classes } = args
    const element = this.body.querySelector(selector) as HTMLElement
    classes?.split(' ').forEach((c: string) => {
      element?.classList.remove(c)
    })
  }

  elementSetAttribute(args: any) {
    const { selector, attribute, value } = args
    if (!attribute) return
    const element = this.body.querySelector(selector) as HTMLElement
    element?.setAttribute(attribute, value || '')
  }

  elementRemoveAttribute(args: any) {
    const { selector, attribute } = args
    if (!attribute) return
    const element = this.body.querySelector(selector) as HTMLElement
    element?.removeAttribute(attribute)
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
}
