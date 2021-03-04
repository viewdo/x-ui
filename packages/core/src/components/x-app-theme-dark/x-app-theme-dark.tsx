import { Component, h, Host, Prop, State } from '@stencil/core'
import { interfaceState, onInterfaceChange } from '../../services/interface'

@Component({
  tag: 'x-app-theme-dark',
  shadow: false,
})
export class XAppThemeDark {
  private interfaceSubscriptionon!: () => void

  @State() dark: boolean = false

  /**
   * The class to add to the inner input.
   */
  @Prop() classes?: string

  /**
   * The inner input ID
   */
  @Prop() inputId?: string

  componentWillLoad() {
    this.dark = interfaceState.theme == 'dark'
    this.interfaceSubscriptionon = onInterfaceChange('theme', (theme) => {
      this.toggleDarkTheme(theme === 'dark')
    })
  }

  private toggleDarkTheme(dark: boolean) {
    this.dark = dark
    interfaceState.theme = this.dark ? 'dark' : 'light'
  }

  disconnectedCallback() {
    this.interfaceSubscriptionon()
  }

  render() {
    return (
      <Host>
        <input
          type="checkbox"
          class={this.classes}
          id={this.inputId}
          onChange={() => this.toggleDarkTheme(!this.dark)}
          checked={this.dark}
        />
      </Host>
    )
  }
}
