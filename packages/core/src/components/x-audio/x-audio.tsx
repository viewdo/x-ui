import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import {
  actionBus,
  EventAction,
  eventBus,
} from '../../services/actions'
import { debugIf, warn } from '../../services/common/logging'
import { ReferenceCompleteResults } from '../../services/content/interfaces'
import {
  DATA_TOPIC,
  IDataProvider,
} from '../../services/data/interfaces'
import {
  DataProviderRegistration,
  DATA_COMMANDS,
} from '../x-data/data/interfaces'
import { AudioActionListener } from './audio/actions'
import { AudioDataProvider } from './audio/provider'
import { audioState } from './audio/state'

/**
 * Use this element only once per page to enable audio features.
 * It will add a CDN reference to Howler.js:
 * <https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js>
 *
 * @system audio
 */
@Component({
  tag: 'x-audio',
  styleUrl: 'x-audio.css',
  shadow: false,
  scoped: true,
})
export class XAudioPlayer {
  private provider?: AudioDataProvider
  private listenerSubscription!: () => void
  @Element() el!: HTMLXAudioElement
  private volumeInput!: HTMLInputElement
  @State() listener?: AudioActionListener
  @State() muted: boolean = false
  @State() volume: number = 0
  @State() hasAudio: boolean = false
  @State() isPlaying: boolean = false

  /**
   * The Howler.js Script Reference
   */
  @Prop() howlerVersion: string = '2.2.1'

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

  /**
   * Mute Off Icon Url
   */
  @Prop() muteOffIconClass: string = 'mute-off-img'

  /**
   * Mute ON Icon Url
   */
  @Prop() muteOnIconClass: string = 'mute-on-img'

  /**
   * Play Icon Url
   */
  @Prop() playIconClass: string = 'play-img'

  /**
   * Pause Icon Url
   */
  @Prop() pauseIconClass: string = 'pause-img'

  async componentWillLoad() {
    if (audioState.hasAudio) {
      warn('x-audio: duplicate players have no effect')
      return
    }
    if (!audioState.enabled) {
      warn(`x-audio: Audio is disabled`)
    }
    debugIf(this.debug, 'x-audio: loading')
  }

  private referenceComplete(
    results: CustomEvent<ReferenceCompleteResults>,
  ) {
    if (results.detail.loaded) {
      this.listener = new AudioActionListener(
        window,
        eventBus,
        actionBus,
        this.debug,
      )

      this.listener.changed.on('changed', () => {
        this.hasAudio = this.listener!.hasAudio
        this.isPlaying = this.listener!.isPlaying
        this.muted = this.listener!.muted
        this.volume = this.listener!.volume
      })

      this.provider = new AudioDataProvider(this.listener)
      this.registerProvider(this.provider!)
    }
  }

  private registerProvider(provider: IDataProvider) {
    const customEvent = new CustomEvent<
      EventAction<DataProviderRegistration>
    >('x:actions', {
      detail: {
        topic: DATA_TOPIC,
        command: DATA_COMMANDS.RegisterDataProvider,
        data: {
          name: 'audio',
          provider,
        },
      },
    })
    this.el.ownerDocument.body.dispatchEvent(customEvent)
  }

  disconnectedCallback() {
    audioState.hasAudio = false
    this.listenerSubscription?.call(this)
    this.provider?.destroy()
    this.listener?.destroy()
  }

  private setMute(mute: boolean) {
    this.listener?.mute(mute)
  }

  private setVolume(value: number) {
    this.listener?.setVolume(value)
  }

  private pause() {
    this.listener?.pause()
  }

  private resume() {
    this.listener?.resume()
  }

  render() {
    debugIf(this.debug, 'x-audio: loaded')

    if (!audioState.enabled) return <Host hidden></Host>

    return (
      <Host hidden={!this.display}>
        <x-content-reference
          onReferenced={ev => this.referenceComplete(ev)}
          script-src={`https://cdn.jsdelivr.net/npm/howler@${this.howlerVersion}/dist/howler.core.min.js`}
        ></x-content-reference>
        {this.listener ? (
          <div class="row">
            {this.muted ? (
              <div
                title="Enable Sound"
                class="button"
                onClick={() => {
                  this.setMute(false)
                }}
              >
                <img class={this.muteOffIconClass} />
              </div>
            ) : (
              <div
                title="Mute Sound"
                class="button"
                onClick={() => {
                  this.setMute(true)
                }}
              >
                <img class={this.muteOnIconClass} />
              </div>
            )}

            <input
              title="Set volume"
              ref={el => (this.volumeInput = el!)}
              onChange={() => {
                this.setVolume(this.volumeInput.valueAsNumber)
              }}
              type="range"
              id="volume-slider"
              max="1"
              step="0.1"
              value={this.volume}
            />
            <div
              style={{ display: this.hasAudio ? 'block' : 'none' }}
            >
              {this.isPlaying ? (
                <div
                  title="Pause Audio"
                  class="button"
                  onClick={() => {
                    this.pause()
                  }}
                >
                  <img class={this.pauseIconClass} />
                </div>
              ) : (
                <div
                  title="Resume Audio"
                  class="button"
                  onClick={() => {
                    this.resume()
                  }}
                >
                  <img class={this.playIconClass} />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Host>
    )
  }
}
