import { AudioRequest, AudioType, AUDIO_EVENTS, EventEmitter } from '../..'

export class AudioActionListener {
  timer: NodeJS.Timeout

  constructor(public eventBus: EventEmitter, public actionBus: EventEmitter, public debug: boolean = false) {
    this.events = new EventEmitter()
  }

  // Public Members

  public isPlaying(): boolean {
    return true
  }

  public hasAudio(): boolean {
    return true
  }

  public events: EventEmitter

  public pause() {}

  public resume() {}

  public mute(_mute = false) {}

  public seek(_type: AudioType, _trackId: string, _seek: number) {}

  public volume(_request: AudioRequest) {}

  destroy() {
    clearInterval(this.timer)
  }
}
