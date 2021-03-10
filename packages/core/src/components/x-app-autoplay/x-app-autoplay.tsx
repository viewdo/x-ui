import { Component, h, Host, Prop, State } from '@stencil/core'
import { getDataProvider } from '../../services/data/factory'
import { IServiceProvider } from '../../services/data/interfaces'
import { eventBus } from '../../services/events'
import {
  onVideoChange,
  videoState,
  VIDEO_EVENTS,
} from '../../services/video'

/**
 * This component displays a checkbox to control the autoplay setting,
 * used for video playback - as well as automatic navigation to the
 * next page, when a video ends. Default: enabled
 *
 * @system presentation
 */
@Component({
  tag: 'x-app-autoplay',
  shadow: false,
})
export class XAppAutoplay {
  private enabledKey = 'autoplay'
  private checkbox?: HTMLInputElement
  private videoSubscription!: () => void
  private storage: IServiceProvider | null = null
  @State() autoPlay = true

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
    this.autoPlay = videoState.autoplay

    this.storage = (await getDataProvider(
      this.dataProvider,
    )) as IServiceProvider

    if (this.storage) {
      const autoplay = await this.storage.get(this.enabledKey)
      videoState.autoplay = autoplay !== 'false'
    }

    this.videoSubscription = onVideoChange('autoplay', async a => {
      this.autoPlay = a
      await this.storage?.set(this.enabledKey, a.toString())
      eventBus?.emit(VIDEO_EVENTS.AutoPlayChanged, a)
    })
  }

  private toggleAutoPlay() {
    videoState.autoplay = this.checkbox?.checked || false
  }

  disconnectedCallback() {
    this.videoSubscription?.call(this)
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
          onChange={() => this.toggleAutoPlay()}
          checked={this.autoPlay}
        ></input>
      </Host>
    )
  }
}
