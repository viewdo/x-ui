import { Component, Host, h, Method, Prop, Element } from '@stencil/core'
import { AUDIO_TOPIC, AudioType, IActionElement, EventAction, warn } from '../..'

/**
 * This element just holds data to express the actionEvent to fire. This element
 * should always be the child of a x-action-activator.
 *
 * @system audio
 */
@Component({
  tag: 'x-audio-music-action',
  shadow: true,
})
export class XAudioMusicAction implements IActionElement {
  @Element() el!: HTMLXAudioMusicActionElement

  /**
   * The command to execute.
   */
  @Prop() command!: 'start' | 'pause' | 'resume' | 'mute' | 'volume' | 'seek'

  /**
   * The track to target.
   */
  @Prop() trackId?: string

  /**
   * The value payload for the command.
   */
  @Prop() value?: string | boolean | number

  /**
   * Get the underlying actionEvent instance. Used by the x-action-activator element.
   */
  @Method()
  async getAction(): Promise<EventAction<any>> {
    return {
      topic: AUDIO_TOPIC,
      command: this.command,
      data: {
        type: AudioType.Music,
        trackId: this.trackId,
        value: this.value,
      },
    }
  }

  private get parent(): HTMLXActionActivatorElement {
    return this.el.closest('x-action-activator')!
  }

  componentWillLoad() {
    if (this.parent === undefined) {
      warn('The x-audio-music-action component must be wrapped with an x-action-activator component to work.')
    }
  }

  render() {
    return <Host hidden></Host>
  }
}
