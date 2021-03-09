import {
  AudioInfo,
  AudioType,
  AUDIO_EVENTS,
  DiscardStrategy,
  LoadStrategy,
} from '../../../services/audio/interfaces'
import { trackPlayed } from '../../../services/audio/tracked'
import { warn } from '../../../services/common/logging'
import { EventEmitter } from '../../../services/events'

export class AudioTrack implements AudioInfo {
  private readonly sound?: Howl
  events: EventEmitter = new EventEmitter()

  static createSound = (
    audio: AudioInfo,
    onload?: () => void,
    onend?: () => void,
    onerror?: (id: number, error: any) => void,
  ) => {
    const { loop, src, type } = audio
    if (src && type) {
      return new Howl({
        src,
        loop: type === 'music' ? loop : false,
        onload,
        onend,
        onloaderror: onerror,
        onplayerror: onerror,
      })
    }
  }

  constructor(
    audio: AudioInfo,
    private readonly baseVolume: number = 1,
    private readonly fadeSpeed: number = 2,
  ) {
    Object.assign(this, audio)

    const { trackId, events } = this

    if (trackId == null || this.src == null) return

    this.sound = AudioTrack.createSound(
      audio,
      () => {
        events.emit(AUDIO_EVENTS.Loaded, trackId)
      },
      () => {
        if (this.loop) events.emit(AUDIO_EVENTS.Looped, trackId)
        else events.emit(AUDIO_EVENTS.Ended, trackId)
      },
      (_id, error) => {
        warn(
          `x-audio: An error occurred for audio track ${trackId}: ${error}`,
        )
        events.emit(AUDIO_EVENTS.Errored, trackId)
      },
    )
    if (this.sound) {
      this.baseVolume = baseVolume || this.sound?.volume()
    }
  }

  public trackId!: string
  public type!: AudioType
  public src!: string
  public mode!: LoadStrategy
  public discard: DiscardStrategy = DiscardStrategy.Route
  public track: boolean = false
  public loop: boolean = false

  public get state() {
    return this.sound?.state()
  }

  public get playing() {
    return this.sound?.playing()
  }

  public play() {
    this.sound?.volume(0)
    this.sound?.play()
    this.sound?.fade(0, this.baseVolume, this.fadeSpeed)
    this.events.emit(AUDIO_EVENTS.Played, this.trackId)
    if (this.track && this.trackId) {
      trackPlayed(this.trackId)
    }
  }

  public stop() {
    this.sound?.fade(this.baseVolume, 0, this.fadeSpeed)
    this.sound?.stop()
    this.events.emit(AUDIO_EVENTS.Stopped, this.trackId)
  }

  public pause() {
    this.sound?.pause()
    this.events.emit(AUDIO_EVENTS.Paused, this.trackId)
  }

  public mute(mute: boolean) {
    this.sound?.mute(mute)
    this.events.emit(AUDIO_EVENTS.Muted, this.trackId)
  }

  public resume() {
    this.sound?.play()
    this.events.emit(AUDIO_EVENTS.Resumed, this.trackId)
  }

  public start() {
    if (this.state === 'loaded') {
      this.play()
    } else if (this.state === 'loading') {
      this.events.once(AUDIO_EVENTS.Loaded, () => {
        this.play()
      })
    }
  }

  public seek(time: number) {
    this.sound?.seek(time)
  }

  public destroy() {
    this.events.emit(AUDIO_EVENTS.Discarded, this.trackId)
    this.sound?.unload()
    this.events.removeAllListeners()
  }
}
