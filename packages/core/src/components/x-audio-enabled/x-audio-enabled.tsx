import { Component, h, Host, Prop, State } from '@stencil/core'
import { audioState, onAudioStateChange } from '../../services/audio'

/**
 * This component exposes a checkbox to enable or disable global audio for background sounds and video.
 *
 * @system audio
 * @system presentation
 */
@Component({
  tag: 'x-audio-enabled',
  shadow: false,
})
export class XAudioEnabled {
  private checkbox?: HTMLInputElement
  private muteSubscription!: () => void
  @State() enabled!: boolean

  /**
   * Any classes to add to the input-element directly.
   */
  @Prop() classes?: string

  /**
   * The id field to add to the input-element directly.
   */
  @Prop() inputId?: string

  componentWillLoad() {
    this.enabled = audioState.enabled

    this.muteSubscription = onAudioStateChange('enabled', m => {
      this.enabled = m
    })
  }

  private toggle() {
    audioState.enabled = this.checkbox?.checked || false
  }

  disconnectedCallback() {
    this.muteSubscription?.call(this)
  }

  render() {
    return (
      <Host>
        <input
          type="checkbox"
          class={this.classes}
          id={this.inputId}
          ref={e => {
            this.checkbox = e
          }}
          onChange={() => this.toggle()}
          checked={this.enabled}
        ></input>
      </Host>
    )
  }
}
