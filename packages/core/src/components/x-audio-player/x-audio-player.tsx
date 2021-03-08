import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { audioState } from '../../services/audio'
import { AudioActionListener } from '../../services/audio/actions'
import { AUDIO_TOPIC } from '../../services/audio/interfaces'
import { debugIf, warn } from '../../services/common'
import { actionBus, eventBus } from '../../services/events'
import { XContentReference } from '../x-content-reference/x-content-reference'

/**
 * Use this element only once per page to enable audio features.
 * It will add a CDN reference to Howler.js:
 * <https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js>
 *
 * @system audio
 * @system presentation
 */
@Component({
  tag: 'x-audio-player',
  styleUrl: 'x-audio-player.css',
  shadow: false,
})
export class XAudioPlayer {
  private listener!: AudioActionListener
  private listenerSubscription!: () => void
  @Element() el!: HTMLXAudioPlayerElement
  @State() hasAudio = false
  @State() isPlaying = false

  /**
   * The display mode for this player. The display
   * is merely a facade to manage basic controls.
   * No track information or duration will be displayed.
   */
  @Prop() display = false

  /**
   * Use debug for verbose logging. Useful for figuring
   * thing out.
   */
  @Prop() debug = false

  async componentWillLoad() {
    if (audioState.hasAudio) {
      warn('x-audio-player: duplicate players have no effect')
      return
    }
    debugIf(this.debug, 'x-audio-player: loading')

    this.listener = new AudioActionListener(
      eventBus,
      actionBus,
      this.debug,
    )

    this.listenerSubscription = eventBus.on(AUDIO_TOPIC, () => {
      this.hasAudio = this.listener.hasAudio()
      this.isPlaying = this.listener.isPlaying()
    })

    audioState.hasAudio = this.listener.hasAudio()
    this.isPlaying = this.listener.isPlaying()
  }

  disconnectedCallback() {
    audioState.hasAudio = false
    this.listenerSubscription?.call(this)
    this.listener?.destroy()
  }

  render() {
    debugIf(this.debug, 'x-audio-player: loaded')

    if (!this.display) {
      return <Host></Host>
    }

    // eslint-disable-next-line @stencil/render-returns-host
    return [
      <XContentReference
        scriptSrc={
          'https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js'
        }
      ></XContentReference>,
      <Host hidden={this.display}>
        <i
          hidden={!this.isPlaying}
          onClick={() => {
            this.listener.pause()
          }}
          class="ri-pause-line fs-2"
        ></i>
        <i
          hidden={this.isPlaying}
          onClick={() => {
            this.listener.resume()
          }}
          class="ri-play-line fs-2"
        ></i>
      </Host>,
    ]
  }
}
