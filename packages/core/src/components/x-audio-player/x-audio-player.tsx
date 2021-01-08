import { Component, Element, h, Host, Prop, State } from '@stencil/core'
import { actionBus, audioState, eventBus, onInterfaceChange, warn } from '../..'
import { AudioActionListener } from '../../services/audio/action-listener'

/**
 *
 * @system audio
 */
@Component({
  tag: 'x-audio-player',
  styleUrl: 'x-audio-player.scss',
  shadow: true,
})
export class XAudioPlayer {
  private listener!: AudioActionListener
  private listenerSubscription!: () => void
  private muteSubscription!: () => void

  @Element() el!: HTMLXAudioPlayerElement

  @State() hasAudio: boolean = false
  @State() isPlaying: boolean = false

  /**
   * The display mode for this player. The display
   * is merely a facade to manage basic controls.
   * No track information or duration will be displayed.
   */
  @Prop() display: boolean = false

  /**
   * Use debug for verbose logging. Useful for figuring
   * thing out.
   */
  @Prop() debug: boolean = false

  async componentWillLoad() {
    if (audioState.hasAudio) {
      warn('x-audio-player: duplicate players have no effect')
      return
    }

    this.listener = new AudioActionListener(eventBus, actionBus, this.debug)

    this.listenerSubscription = this.listener.events.on('*', () => {
      this.hasAudio = this.listener.hasAudio()
      this.isPlaying = this.listener.isPlaying()
    })

    this.muteSubscription = onInterfaceChange('muted', (muted: boolean) => {
      this.listener.mute(muted)
    })

    audioState.hasAudio = true
  }

  disconnectedCallback() {
    audioState.hasAudio = false
    this.listenerSubscription?.call(this)
    this.muteSubscription?.call(this)
    this.listener?.destroy()
  }

  render() {
    if (!this.display || !this.hasAudio) {
      return <Host></Host>
    }

    return (
      <Host>
        <i
          hidden={!this.isPlaying}
          onClick={() => {
            this.listener.pause()
          }}
          class="ri-pause-fill fs-2"
        ></i>
        <i
          hidden={this.isPlaying}
          onClick={() => {
            this.listener.resume()
          }}
          class="ri-speaker-2-line fs-2"
        ></i>
      </Host>
    )
  }
}
