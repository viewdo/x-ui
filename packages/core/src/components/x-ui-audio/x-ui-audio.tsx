import { Component, h, Host, Prop, State } from '@stencil/core'
import { interfaceState } from '../..'
import { onInterfaceChange } from '../../services'

@Component({
  tag: 'x-ui-audio',
  shadow: false,
})
export class XUiAudio {
  slider?: HTMLInputElement
  private muteSubscription!: () => void
  @State() muted!: boolean

  @Prop() classes?: string
  @Prop() inputId?: string

  componentWillLoad() {
    this.muted = interfaceState.muted

    this.muteSubscription = onInterfaceChange('muted', (m) => {
      this.muted = m
    })
  }

  private toggleSound() {
    interfaceState.muted = this.slider?.checked || false
  }

  disconnectedCallback() {
    this.muteSubscription()
  }

  render() {
    return (
      <Host>
        <input
          type="checkbox"
          class={this.classes}
          id={this.inputId}
          ref={(e) => {
            this.slider = e
          }}
          onChange={() => this.toggleSound()}
          checked={this.muted}
        ></input>
      </Host>
    )
  }
}
