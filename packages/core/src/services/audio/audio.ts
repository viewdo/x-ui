import { Howl } from 'howler'
import { AUDIO_EVENTS } from './interfaces'
import { AudioInfo } from './audio-info'
import { EventEmitter } from '../actions/event-emitter'
import { debug, warn } from '../logging'
import { trackPlayed } from './tracked'

export class AudioTrack extends AudioInfo {
  private readonly sound: Howl
  events: EventEmitter = new EventEmitter()

  static createSound = (audio: AudioInfo, onload?: () => void, onend?: () => void, onerror?: (id: number, error: any) => void) => {
    const { loop, src, type } = audio
    debug(`Loading howl: ${src}`)
    return new Howl({
      src,
      loop: type == 'music' ? loop : false,
      onload,
      onend,
      onloaderror: onerror,
      onplayerror: onerror,
    })
  }

  constructor(audio: AudioInfo, private readonly baseVolume: number = 1, private readonly fadeSpeed: number = 2) {
    super()
    Object.assign(this, audio)

    const events = this.events

    const { trackId } = audio

    this.sound = AudioTrack.createSound(
      audio,
      () => {
        events.emit(AUDIO_EVENTS.Loaded, trackId)
      },
      () => {
        this.loop ? events.emit(AUDIO_EVENTS.Looped, trackId) : events.emit(AUDIO_EVENTS.Ended, trackId)
      },
      (_id, error) => {
        warn(`x-audio: An error occurred for audio track ${trackId}: ${error}`)
        events.emit(AUDIO_EVENTS.Errored, trackId)
      },
    )
    this.baseVolume = baseVolume || this.sound.volume()
  }

  get state() {
    return this.sound.state()
  }

  get isPlaying() {
    return this.sound.playing()
  }

  play() {
    this.sound.volume(0)
    this.sound.play()
    this.sound.fade(0, this.baseVolume, this.fadeSpeed)
    this.events.emit(AUDIO_EVENTS.Played, this.trackId)
    if (this.track) {
      trackPlayed(this.trackId)
    }
  }

  stop() {
    this.sound.fade(this.baseVolume, 0, this.fadeSpeed)
    this.sound.stop()
    this.events.emit(AUDIO_EVENTS.Stopped, this.trackId)
  }

  pause() {
    this.sound.pause()
    this.events.emit(AUDIO_EVENTS.Paused, this.trackId)
  }

  resume() {
    this.sound.play()
    this.events.emit(AUDIO_EVENTS.Resumed, this.trackId)
  }

  start() {
    if (this.state == 'loaded') {
      this.play()
    } else if (this.state == 'loading') {
      this.events.once(AUDIO_EVENTS.Loaded, () => {
        this.play()
      })
    }
  }

  seek(time: number) {
    this.sound.seek(time)
  }

  destroy() {
    this.events.emit(AUDIO_EVENTS.Discarded, this.trackId)
    this.sound.unload()
    this.events.removeAllListeners()
    this.events = null
  }
}
