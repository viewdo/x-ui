import { Component, Element, Prop } from '@stencil/core'
import {
  interfaceState,
  onInterfaceChange,
} from '../../services/interface'

/**
 * This component checks for the preferred light/dark theme preference of the
 * user and sets the interface state: theme, accordingly.
 *
 * @system interface
 */
@Component({
  tag: 'x-app-theme',
  shadow: true,
})
export class XAppTheme {
  @Element() el!: HTMLXAppThemeElement

  /**
   * Skip adding the class to the body tag, just
   * update the interface state.
   */
  @Prop() skipClass: boolean = false
  private interfaceSubscription!: () => void

  /**
   * Change the class name that is added to the
   * body tag when the theme is determined to
   * be dark.
   */
  @Prop() darkClass: string = 'dark'

  componentWillLoad() {
    this.interfaceSubscription = onInterfaceChange('theme', theme => {
      this.toggleDarkTheme(theme === 'dark')
    })

    if (interfaceState.theme != null) {
      this.toggleDarkTheme(interfaceState.theme === 'dark')
    } else {
      const prefersDark = window?.matchMedia(
        '(prefers-color-scheme: dark)',
      )
      if (prefersDark?.addEventListener) {
        prefersDark.addEventListener('change', ev => {
          interfaceState.theme = ev.matches ? 'dark' : 'light'
        })
        interfaceState.theme = 'dark'
      }
    }
  }

  private toggleDarkTheme(dark: boolean) {
    if (!this.skipClass)
      this.el.ownerDocument.body.classList.toggle(
        this.darkClass,
        dark,
      )
  }

  disconnectedCallback() {
    this.interfaceSubscription?.call(this)
  }
}
