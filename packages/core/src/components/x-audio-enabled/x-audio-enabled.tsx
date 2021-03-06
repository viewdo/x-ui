import { Component, h, Host, Prop, State } from '@stencil/core'
import {
  audioState,
  AUDIO_EVENTS,
  AUDIO_TOPIC,
  onAudioStateChange,
} from '../../services/audio'
import { getDataProvider } from '../../services/data/factory'
import { IDataProvider } from '../../services/data/interfaces'
import { eventBus } from '../../services/events'

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
  private enabledKey = 'audio'
  private checkbox?: HTMLInputElement
  private muteSubscription!: () => void
  private storage: IDataProvider | null = null
  @State() enabled!: boolean

  /**
   * Any classes to add to the input-element directly.
   */
  @Prop() classes?: string

  /**
   * The id field to add to the input-element directly.
   */
  @Prop() inputId?: string

  /**
   * The data provider to store the audio-enabled state in.
   */
  @Prop() dataProvider: string = 'storage'

  async componentWillLoad() {
    this.enabled = audioState.enabled

    this.storage = await getDataProvider(this.dataProvider)

    if (this.storage) {
      const enabled = await this.storage?.get(this.enabledKey)
      if (enabled != null) {
        audioState.enabled = enabled == 'true'
      }
    }

    this.muteSubscription = onAudioStateChange('enabled', async m => {
      this.enabled = m
      await this.storage?.set(this.enabledKey, m.toString())
      eventBus.emit(AUDIO_TOPIC, AUDIO_EVENTS.SoundChanged, m)
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
