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
  tag: 'x-audio-state-switch',
  shadow: false,
})
export class XAudioEnabled {
  private checkbox?: HTMLInputElement
  private muteSubscription!: () => void
  private storage: IDataProvider | null = null

  private get stateKey() {
    return `audio-${this.setting}`
  }

  @State() value!: boolean

  /**
   * Which state property this switch controls.
   */
  @Prop() setting: 'muted' | 'enabled' = 'enabled'

  /**
   * Any classes to add to the input-element directly.
   */
  @Prop() classes?: string

  /**
   * The id field to add to the input-element directly.
   */
  @Prop() inputId?: string

  /**
   * The data provider to store the audio state in.
   */
  @Prop() dataProvider: string = 'storage'

  async componentWillLoad() {
    this.value = audioState[this.setting]

    this.storage = await getDataProvider(this.dataProvider)

    if (this.storage) {
      const value = await this.storage?.get(this.stateKey)
      if (value != null) {
        audioState[this.setting] = value == 'true'
      }
    }

    this.muteSubscription = onAudioStateChange(
      this.setting,
      async m => {
        this.value = m
        await this.storage?.set(this.stateKey, m.toString())
        eventBus.emit(AUDIO_TOPIC, AUDIO_EVENTS.SoundChanged, m)
      },
    )
  }

  private toggle() {
    audioState[this.setting] = this.checkbox?.checked || false
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
          checked={this.value}
        ></input>
      </Host>
    )
  }
}
