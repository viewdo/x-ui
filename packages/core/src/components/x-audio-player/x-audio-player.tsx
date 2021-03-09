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
  private listener?: AudioActionListener
  private provider?: AudioDataProvider

  private listenerSubscription!: () => void
  @Element() el!: HTMLXAudioPlayerElement
  @State() hasAudio = false
  @State() isPlaying = false

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

  render() {
    debugIf(this.debug, 'x-audio-player: loaded')

    return (
      <Host hidden={!this.display}>
        <x-content-reference
          onReferenced={ev => this.referenceComplete(ev)}
          script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"
        ></x-content-reference>
      </Host>
    )
  }
}
