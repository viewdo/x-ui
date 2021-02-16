import { Component, Element, h, Host, State } from '@stencil/core';
import { interfaceState, onInterfaceChange } from '../../services/interface';

@Component({
  tag: 'x-ui-theme',
  styleUrl: 'x-ui-theme.css',
  shadow: true,
})
export class XUITheme {
  @Element() el!: HTMLXUiThemeElement
  private checkbox?: HTMLInputElement
  private subscriptionDispose!: () => void

  @State() dark: boolean = false

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
          this.toggleDarkTheme(ev.matches);
        })
        this.toggleDarkTheme(prefersDark.matches)
      }
    }
  }

  private toggleDarkTheme(dark: boolean) {
    this.dark = dark
    interfaceState.theme = dark ? 'dark' : 'light'
  }

  componentDidRender() {
    this.el.ownerDocument.body.classList.toggle('dark', this.dark)
  }

  disconnectedCallback() {
    this.subscriptionDispose()
  }

  render() {
    return (
      <Host>
        <label id="switch" class="switch">
          <input
            ref={(e) => this.checkbox = e}
            aria-label="Change Theme"
            type="checkbox"
            onChange={() => this.toggleDarkTheme(!this.checkbox!.checked)}
            id="slider"
            checked={!this.dark}
          />
          <span class="slider round"></span>
        </label>
      </Host>
    )
  }
}
