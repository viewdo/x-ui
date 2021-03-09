import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { audioState } from '../../services/audio/state'
import { debugIf, warn } from '../../services/common/logging'
import { ReferenceCompleteResults } from '../../services/content/interfaces'
import {
  DataProviderRegistration,
  DATA_COMMANDS,
  DATA_TOPIC,
  IDataProvider,
} from '../../services/data/interfaces'
import {
  actionBus,
  EventAction,
  eventBus,
} from '../../services/events'
import { AudioActionListener } from './audio/actions'
import { AudioDataProvider } from './audio/provider'

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
  shadow: true,
})
export class XAudioPlayer {
  private provider?: AudioDataProvider
  private listenerSubscription!: () => void
  @Element() el!: HTMLXAudioPlayerElement
  private volumeInput!: HTMLInputElement
  @State() listener?: AudioActionListener
  @State() muted: boolean = false
  @State() volume: number = 0
  @State() hasAudio: boolean = false
  @State() isPlaying: boolean = false

  /**
   * The Howler.js Script Reference
   */
  @Prop() howlerUrl: string =
    'https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js'

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
  @Prop() muteOffIconUrl: string =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none'  d='M0 0h24v24H0z'/%3E%3Cpath d='M10 7.22L6.603 10H3v4h3.603L10 16.78V7.22zM5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm14.525-4l3.536 3.536-1.414 1.414L19 13.414l-3.536 3.536-1.414-1.414L17.586 12 14.05 8.464l1.414-1.414L19 10.586l3.536-3.536 1.414 1.414L20.414 12z'/%3E%3C/svg%3E"

  /**
   * Mute ON Icon Url
   */
  @Prop() muteOnIconUrl: string =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none'  d='M0 0h24v24H0z'/%3E%3Cpath d='M10 7.22L6.603 10H3v4h3.603L10 16.78V7.22zM5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z'/%3E%3C/svg%3E"

  /**
   * Play Icon Url
   */
  @Prop() playIconUrl: string =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none'  d='M0 0h24v24H0z'/%3E%3Cpath d='M16.394 12L10 7.737v8.526L16.394 12zm2.982.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z'/%3E%3C/svg%3E"

  /**
   * Pause Icon Url
   */
  @Prop() pauseIconUrl: string =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none'  d='M0 0h24v24H0z'/%3E%3Cpath d='M6 5h2v14H6V5zm10 0h2v14h-2V5z'/%3E%3C/svg%3E"

  async componentWillLoad() {
    if (audioState.hasAudio) {
      warn('x-audio-player: duplicate players have no effect')
      return
    }
    if (!audioState.enabled) {
      warn(`x-audio-player: Audio is disabled`)
    }
    debugIf(this.debug, 'x-audio-player: loading')
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
    debugIf(this.debug, 'x-audio-player: loaded')

    if (!audioState.enabled) return <Host hidden></Host>

    return (
      <Host hidden={!this.display}>
        <x-content-reference
          onReferenced={ev => this.referenceComplete(ev)}
          script-src={this.howlerUrl}
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
                <img src={this.muteOffIconUrl} />
              </div>
            ) : (
              <div
                title="Mute Sound"
                class="button"
                onClick={() => {
                  this.setMute(true)
                }}
              >
                <img src={this.muteOnIconUrl} />
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
                  <img src={this.pauseIconUrl} />
                </div>
              ) : (
                <div
                  title="Resume Audio"
                  class="button"
                  onClick={() => {
                    this.resume()
                  }}
                >
                  <img src={this.playIconUrl} />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Host>
    )
  }
}
