import { Component, h, Host, Prop, State } from '@stencil/core';
import { audioState } from '../..';
import { onAudioStateChange } from '../../services';

/**
 * @system presentation
 */
@Component({
  tag: 'x-ui-audio',
  shadow: false,
})
export class XUiAudio {
  private slider?: HTMLInputElement
  private muteSubscription!: () => void
  @State() muted!: boolean

  /**
   *
   */
  @Prop() classes?: string

  /**
   *
   */
  @Prop() inputId?: string

  componentWillLoad() {
    this.muted = audioState.muted

    this.muteSubscription = onAudioStateChange('muted', (m) => {
      this.muted = m
    })
  }

  private toggleSound() {
    audioState.muted = this.slider?.checked || false
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
