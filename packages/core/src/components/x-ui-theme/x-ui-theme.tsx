import { Component, h, Host, State } from '@stencil/core';
import { interfaceState } from '../..';
import { onInterfaceChange } from '../../services';

@Component({
  tag: 'x-ui-theme',
  styleUrl: 'x-ui-theme.css',
  shadow: true,
})
export class XUiTheme {
  private subscriptionDispose!: () => void
  @State() dark!: boolean

  componentWillLoad() {
    this.dark = interfaceState.theme === 'dark'

    this.subscriptionDispose = onInterfaceChange('theme', (theme) => {
      this.dark = (theme == 'dark')
      this.toggleDarkTheme(this.dark)
    })

    if (interfaceState.theme === null) {
      const prefersDark = window?.matchMedia('(prefers-color-scheme: dark)')
      if (prefersDark?.addEventListener) {
        this.toggleDarkTheme(prefersDark.matches)
        prefersDark.addEventListener('change', (ev) => this.toggleDarkTheme(ev.matches))
        this.toggleDarkTheme(prefersDark.matches)
      }
    } else {
      this.toggleDarkTheme(this.dark)
    }
  }

  private toggleDarkTheme(dark?: boolean) {
    const enableDark = dark === undefined ? !this.dark : dark
    document.body.classList.toggle('dark', enableDark)
    interfaceState.theme = enableDark ? 'dark' : 'light'
    this.dark = enableDark
  }

  disconnectedCallback() {
    this.subscriptionDispose()
  }

  render() {
    return (
      <Host>
        <label id="switch" class="switch">
          <input
            aria-label="Change Theme"
            type="checkbox"
            onChange={() => this.toggleDarkTheme()}
            id="slider"
            checked={!this.dark}
          />
          <span class="slider round"></span>
        </label>
      </Host>
    )
  }
}
