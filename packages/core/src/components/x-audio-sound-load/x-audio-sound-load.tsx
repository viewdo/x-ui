import { Component, Element, h, Host, Prop } from '@stencil/core'
import { actionBus } from '../../services/events'
import {
  AudioType,
  AUDIO_TOPIC,
  DiscardStrategy,
  LoadStrategy,
} from '../x-audio-player/audio/interfaces'

/**
 * This component declares audio used within this \<x-app-view-do\> route.
 * The \<x-audio-sound-load\> instructs the player to load audio files
 * while defining play behaviors.
 *
 * The audio player will pre-load or play when the route is active.
 * The player manages them according to their settings.
 *
 * @system audio
 * @system presentation
 */
@Component({
  tag: 'x-audio-sound-load',
  shadow: true,
})
export class XAudioSoundLoad {
  @Element() el!: HTMLXAudioSoundLoadElement

  /**
   * The path to the audio-file.
   */
  @Prop() src!: string

  /**
   * The identifier for this music track
   */
  @Prop() trackId!: string

  /**
   * This is the topic this action-command is targeting.
   */
  @Prop() mode: LoadStrategy = LoadStrategy.Load

  /**
   * The discard strategy the player should use for this file.
   */
  @Prop() discard: DiscardStrategy = DiscardStrategy.Route

  /**
   * Set this attribute to have the audio file tracked
   * in session effectively preventing it from playing
   * again..
   */
  @Prop() track = false

  private getAction() {
    return {
      topic: AUDIO_TOPIC,
      command: this.mode || LoadStrategy.Load,
      data: {
        trackId: this.trackId || this.src,
        src: this.src,
        discard: this.discard || DiscardStrategy.Route,
        loop: false,
        track: this.track,
        type: AudioType.Sound,
        mode: this.mode || LoadStrategy.Load,
      },
    }
  }

  componentDidLoad() {
    actionBus.emit(AUDIO_TOPIC, this.getAction())
  }

  render() {
    return <Host hidden></Host>
  }
}
