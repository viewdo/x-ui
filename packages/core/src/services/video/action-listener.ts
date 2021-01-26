import { EventAction, IEventEmitter } from '../actions';
import { debugIf } from '../logging';
import { VIDEO_COMMANDS, VIDEO_EVENTS, VIDEO_TOPIC } from './interfaces';

export class VideoActionListener {
  disposeHandle: () => void

  constructor(
    private childVideo: HTMLVideoElement,
    private eventBus: IEventEmitter,
    private actionBus: IEventEmitter,
    private debug: boolean,) {

    this.disposeHandle = this.actionBus.on(VIDEO_TOPIC, async (ev: EventAction<any>) => {
      debugIf(this.debug, `x-video-listener: event received ${ev.topic}:${ev.command}`)
      await this.commandReceived(ev.command, ev.data)
    })
  }

  public mute(muted: boolean) {
    if (!this.childVideo) {
      return
    }

    this.childVideo.muted = muted
    if (muted) {
      this.eventBus.emit(VIDEO_EVENTS.Muted)
    } else {
      this.eventBus.emit(VIDEO_EVENTS.Unmuted)
    }
  }

  public async play() {
    await this.childVideo?.play()
    this.eventBus.emit(VIDEO_EVENTS.Played)
  }

  public pause() {
    this.childVideo?.pause()
    this.eventBus.emit(VIDEO_EVENTS.Paused)
  }

  public async resume() {
    await this.childVideo?.play()
    this.eventBus.emit(VIDEO_EVENTS.Resumed)
  }

  private async commandReceived(command: string, data: any) {
    switch (command) {
      case VIDEO_COMMANDS.Play: {
        await this.play()
        break
      }

      case VIDEO_COMMANDS.Pause: {
        this.pause()
        this.eventBus.emit(VIDEO_EVENTS.Paused)
        break
      }

      case VIDEO_COMMANDS.Resume: {
        await this.resume()
        this.eventBus.emit(VIDEO_EVENTS.Resumed)
        break
      }

      case VIDEO_COMMANDS.Mute: {
        this.mute(data.value)
        this.eventBus.emit(VIDEO_EVENTS.Muted)
        break
      }

      default:
    }
  }

  destroy() {
    this.disposeHandle?.call(this)
  }
}
