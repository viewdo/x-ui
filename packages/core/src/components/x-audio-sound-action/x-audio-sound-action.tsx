import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
} from '@stencil/core'
import {
  actionBus,
  EventAction,
  IActionElement,
} from '../../services/actions'
import {
  AudioType,
  AUDIO_COMMANDS,
  AUDIO_TOPIC,
} from '../x-audio/audio/interfaces'

/**
 * This element represents an action to be fired. This
 * specialized action encapsulates required parameters
 * needed for audio-based actions, for music.
 *
 * @system audio
 */
@Component({
  tag: 'x-audio-sound-action',
  shadow: true,
})
export class XAudioSoundAction implements IActionElement {
  @Element() el!: HTMLXAudioSoundActionElement

  /**
   * The command to execute.
   */
  @Prop() command: AUDIO_COMMANDS = AUDIO_COMMANDS.Play

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
        type: AudioType.Sound,
        trackId: this.trackId,
        value: this.value,
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

  render() {
    return <Host></Host>
  }
}
