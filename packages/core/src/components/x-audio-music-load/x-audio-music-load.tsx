import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
} from '@stencil/core'
import { actionBus, EventAction } from '../../services/actions'
import {
  AudioType,
  AUDIO_TOPIC,
  DiscardStrategy,
  LoadStrategy,
} from '../x-audio/audio/interfaces'

/**
 * This component declares audio used within this \<x-app-view-do\> route.
 * The \<x-audio-sound-load\> instructs the player to load audio files
 * while defining play behaviors.
 *
 * The audio player will pre-load or play when the route is active.
 * The player manages them according to their settings.
 *
 * @system audio
 */
@Component({
  tag: 'x-audio-music-load',
  shadow: true,
})
export class XAudioMusicLoad {
  @Element() el!: HTMLXAudioMusicLoadElement

  /**
   * The path to the audio-file.
   * @required
   */
  @Prop() src!: string

  /**
   * The identifier for this music track
   */
  @Prop() trackId!: string

  /**
   * This is the topic this action-command is targeting.
   */
  @Prop() mode: LoadStrategy = LoadStrategy.Queue

  /**
   * The discard strategy the player should use for this file.
   */
  @Prop() discard: DiscardStrategy = DiscardStrategy.Route

  /**
   * Set this to true to have the audio file loop.
   */
  @Prop() loop = false

  /**
   * Set this attribute to have the audio file tracked
   * in session effectively preventing it from playing
   * again..
   */
  @Prop() track = false

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad = false

  /**
   * Get the underlying actionEvent instance.
   */
  @Method()
  public async getAction(): Promise<EventAction<any> | null> {
    return {
      topic: AUDIO_TOPIC,
      command: this.mode,
      data: {
        trackId: this.trackId || this.src,
        src: this.src,
        discard: this.discard,
        loop: this.loop,
        track: this.track,
        type: AudioType.Music,
        mode: this.mode,
      },
    }
  }

  /**
   * Send this action to the the action messaging system.
   */
  @Method()
  async sendAction(data?: Record<string, any>) {
    const action = await this.getAction()
    if (action) {
      if (data) Object.assign(action.data, data)
      actionBus.emit(action.topic, action)
    }
  }

  componentWillRender() {
    if (this.deferLoad) return
    actionBus.emit(AUDIO_TOPIC, this.getAction())
  }

  render() {
    return <Host></Host>
  }
}
