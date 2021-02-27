import { Component, Element } from '@stencil/core'
import { interfaceState, onInterfaceChange } from '../../services/interface'

@Component({
  tag: 'x-app-theme',
  shadow: true,
})
export class XAppTheme {
  @Element() el!: HTMLXAppThemeElement
  private subscriptionDispose!: () => void

  componentWillLoad() {
    this.subscriptionDispose = onInterfaceChange('theme', (theme) => {
      this.toggleDarkTheme(theme === 'dark')
    })

    if (interfaceState.theme != null) {
      this.toggleDarkTheme(interfaceState.theme === 'dark')
    } else {
      const prefersDark = window?.matchMedia('(prefers-color-scheme: dark)')
      if (prefersDark?.addEventListener) {
        prefersDark.addEventListener('change', (ev) => {
          this.toggleDarkTheme(ev.matches)
        })
        this.toggleDarkTheme(prefersDark.matches)
      }
    }
  }

  private toggleDarkTheme(dark: boolean) {
    this.el.ownerDocument.body.classList.toggle('dark', dark)
  }

  disconnectedCallback() {
    this.subscriptionDispose()
  }
}
