import { debugIf } from '../../../services/common/logging'
import {
  EventAction,
  EventEmitter,
  IEventEmitter,
} from '../../../services/events'
import { ROUTE_EVENTS } from '../../../services/routing'
import {
  AudioInfo,
  AudioRequest,
  AudioType,
  AUDIO_COMMANDS,
  AUDIO_EVENTS,
  AUDIO_TOPIC,
  DiscardStrategy,
  LoadStrategy,
} from './interfaces'
import { audioState, onAudioStateChange } from './state'
import { AudioTrack } from './track'
import { hasPlayed } from './tracked'

export class AudioActionListener {
  changed: IEventEmitter
  private readonly audioStateSubscription: () => void
  private readonly actionSubscription: () => void
  private readonly eventSubscription: () => void

  public onDeck: Record<string, AudioTrack | null> = {
    [AudioType.Music]: null,
    [AudioType.Sound]: null,
  }
  public queued: Record<string, AudioTrack[]> = {
    [AudioType.Music]: [],
    [AudioType.Sound]: [],
  }
  public loaded: Record<string, AudioTrack[]> = {
    [AudioType.Music]: [],
    [AudioType.Sound]: [],
  }

  public enabled!: boolean

  constructor(
    private readonly window: Window,
    private readonly eventBus: IEventEmitter,
    private readonly actionBus: IEventEmitter,
    private readonly debug: boolean = false,
  ) {
    this.changed = new EventEmitter()

    if (this.window.Howler?.volume())
      this.volume = this.window.Howler!.volume()

    this.audioStateSubscription = onAudioStateChange(
      'enabled',
      enabled => {
        this.enabled = enabled
        if (enabled == false) {
          this.window.Howler.unload()
        }
      },
    )

    this.actionSubscription = this.actionBus.on(
      AUDIO_TOPIC,
      (ev: EventAction<any>) => {
        debugIf(
          this.debug,
          `audio-listener: event received ${ev.topic}:${ev.command}`,
        )
        this.commandReceived(ev.command, ev.data)
        audioState.hasAudio = this.hasAudio
      },
    )

    this.eventSubscription = this.eventBus.on(
      ROUTE_EVENTS.RouteChanged,
      () => {
        debugIf(this.debug, 'audio-listener: route changed received')
        this.routeChanged()
      },
    )
  }

  // Public Members

  public enable() {
    audioState.enabled = true
    this.changed.emit('changed')
  }

  public disable() {
    audioState.enabled = false
    this.changed.emit('changed')
  }

  public get isPlaying(): boolean {
    return (
      this.onDeck[AudioType.Music]?.playing() ||
      this.onDeck[AudioType.Sound]?.playing() ||
      false
    )
  }

  public get hasAudio(): boolean {
    return (
      this.onDeck[AudioType.Music] != null ||
      this.onDeck[AudioType.Sound] != null ||
      this.queued[AudioType.Music]?.length > 0 ||
      this.queued[AudioType.Sound]?.length > 0 ||
      this.loaded[AudioType.Music]?.length > 0 ||
      this.loaded[AudioType.Sound]?.length > 0
    )
  }

  public pause() {
    this.onDeck[AudioType.Music]?.pause()
    this.onDeck[AudioType.Sound]?.pause()
    this.changed.emit('changed')
  }

  public resume() {
    this.onDeck[AudioType.Music]?.resume()
    this.onDeck[AudioType.Sound]?.resume()
    this.changed.emit('changed')
  }

  public muted: boolean = !audioState.enabled

  public mute(mute = this.isPlaying) {
    this.onDeck[AudioType.Music]?.mute(mute)
    this.onDeck[AudioType.Sound]?.mute(mute)
    this.muted = mute
    this.changed.emit('changed')
  }

  public seek(type: AudioType, trackId: string, seek: number) {
    const current = this.onDeck[type]
    if (current && current.trackId === trackId) {
      current.seek(seek)
      this.changed.emit('changed')
    }
  }

  public volume: number = 0

  public setVolume(value: number) {
    this.onDeck[AudioType.Music]?.volume(value)
    this.onDeck[AudioType.Sound]?.volume(value)

    this.muted = value == 0
    this.volume = value
    this.changed.emit('changed')
  }

  // Private members

  private commandReceived(
    command: string,
    data: AudioInfo | AudioRequest | boolean,
  ) {
    switch (command) {
      case AUDIO_COMMANDS.Enable: {
        this.enable()
        break
      }

      case AUDIO_COMMANDS.Disable: {
        this.disable()
        break
      }

      case AUDIO_COMMANDS.Load: {
        const audio = this.createQueuedAudioFromTrack(
          data as AudioInfo,
        )
        this.loadTrack(audio)
        break
      }

      case AUDIO_COMMANDS.Play: {
        const audio = this.createQueuedAudioFromTrack(
          data as AudioInfo,
        )
        this.replaceActiveTrack(audio)
        break
      }

      case AUDIO_COMMANDS.Queue: {
        const audio = this.createQueuedAudioFromTrack(
          data as AudioInfo,
        )
        this.addTrackToQueue(audio)
        break
      }

      case AUDIO_COMMANDS.Start: {
        this.startLoadedTrack(data as AudioRequest)
        break
      }

      case AUDIO_COMMANDS.Pause: {
        this.pause()
        break
      }

      case AUDIO_COMMANDS.Resume: {
        this.resume()
        break
      }

      case AUDIO_COMMANDS.Mute: {
        const value = data as boolean
        this.mute(value)
        break
      }

      case AUDIO_COMMANDS.Seek: {
        const request = data as AudioRequest
        if (request.trackId) {
          this.seek(request.type, request.trackId, request.value)
        }

        break
      }

      case AUDIO_COMMANDS.Volume: {
        const { value } = data as AudioRequest
        this.setVolume(value)
        break
      }

      default:
    }
  }

  private createQueuedAudioFromTrack(data: AudioInfo) {
    const audio = new AudioTrack(data)
    audio.events.once(AUDIO_EVENTS.Ended, () => {
      this.soundEnded(audio)
    })

    audio.events.on('*', (...args) => {
      const [event, trackId] = args

      if (event) {
        debugIf(
          this.debug,
          `event-listener: audio event ${event} ${trackId}`,
        )
        this.eventBus.emit(AUDIO_TOPIC, ...args)
      }
    })
    this.changed.emit('changed')

    return audio
  }

  // Event Handlers

  private soundEnded(audio: AudioTrack) {
    const { type, discard, mode } = audio
    if (mode === LoadStrategy.Load) {
      return
    }

    if (mode === LoadStrategy.Play) {
      this.discardActive(AudioType.Sound, DiscardStrategy.Next)
      this.playNextTrackFromQueue(type)
    }

    if (discard === DiscardStrategy.None) {
      // If this track shouldn't be discarded, requeue it
      this.addTrackToQueue(audio)
    }

    if (mode === LoadStrategy.Queue) {
      this.playNextTrackFromQueue(type)
    }
  }

  private routeChanged() {
    if (!this.hasAudio) return

    // Discard any route-based audio
    this.discardActive(AudioType.Sound, DiscardStrategy.Route)
    this.discardTracksFromQueue(
      AudioType.Sound,
      DiscardStrategy.Route,
    )
    this.discardTracksFromLoaded(
      AudioType.Sound,
      DiscardStrategy.Route,
    )

    this.discardActive(AudioType.Music, DiscardStrategy.Route)
    this.discardTracksFromQueue(
      AudioType.Music,
      DiscardStrategy.Route,
    )
    this.discardTracksFromLoaded(
      AudioType.Music,
      DiscardStrategy.Route,
    )
  }

  // Queue Management

  private loadTrack(audio: AudioTrack) {
    const { type } = audio
    if (!this.loaded[type]?.includes(audio)) {
      this.loaded[type].push(audio)
      this.eventBus.emit(
        AUDIO_TOPIC,
        AUDIO_EVENTS.Loaded,
        audio.trackId,
      )
      this.changed.emit('changed')
    }
  }

  private addTrackToQueue(audio: AudioTrack) {
    const { type } = audio
    if (!this.queued[type]?.includes(audio)) {
      this.queued[type].push(audio)
      this.eventBus.emit(
        AUDIO_TOPIC,
        AUDIO_EVENTS.Queued,
        audio.trackId,
      )
      this.changed.emit('changed')
    }

    if (!this.onDeck[audio.type]) {
      this.playNextTrackFromQueue(audio.type)
    }
  }

  private getNextAudioFromQueue(type: AudioType) {
    const audio = this.queued[type]?.pop()
    if (audio) {
      this.eventBus.emit(
        AUDIO_TOPIC,
        AUDIO_EVENTS.Dequeued,
        audio.trackId,
      )
      this.changed.emit('changed')
    }

    return audio
  }

  private discardTracksFromQueue(
    type: AudioType,
    ...reasons: DiscardStrategy[]
  ) {
    const eligibleAudio = (audio: AudioTrack) =>
      !reasons.includes(audio.discard)
    this.queued[type] = this.queued[type]?.filter(i =>
      eligibleAudio(i),
    )
    this.changed.emit('changed')
  }

  private discardTracksFromLoaded(
    type: AudioType,
    ...reasons: DiscardStrategy[]
  ) {
    const eligibleAudio = (audio: AudioTrack) =>
      !reasons.includes(audio.discard)
    this.loaded[type] = this.loaded[type]?.filter(i =>
      eligibleAudio(i),
    )
    this.changed.emit('changed')
  }

  // AudioTrack workflow

  private startLoadedTrack(startRequest: AudioRequest) {
    const audio = this.loaded[startRequest.type]?.find(
      a => a.trackId === startRequest.trackId,
    )
    if (audio) {
      this.replaceActiveTrack(audio)
      this.eventBus.emit(
        AUDIO_TOPIC,
        AUDIO_EVENTS.Started,
        audio.trackId,
      )
      this.changed.emit('changed')
    }
  }

  private playNextTrackFromQueue(type: AudioType) {
    debugIf(this.debug, `event-listener: play next for ${type}`)
    const audio = this.getNextAudioFromQueue(type)
    if (!audio) {
      return
    }
    this.replaceActiveTrack(audio)
    this.changed.emit('changed')
  }

  private replaceActiveTrack(nextUp: AudioTrack) {
    debugIf(this.debug, `event-listener: play now ${nextUp.trackId}`)
    if (nextUp.track && hasPlayed(nextUp.trackId)) {
      nextUp.destroy()
      return
    }
    this.discardActive(nextUp.type, DiscardStrategy.Next)
    this.onDeck[nextUp.type] = nextUp
    this.playActiveTrack(nextUp.type)
    this.changed.emit('changed')
  }

  private playActiveTrack(type: AudioType) {
    this.onDeck[type]?.start()
    this.changed.emit('changed')
  }

  private discardActive(type: AudioType, reason: DiscardStrategy) {
    const audio = this.onDeck[type]
    if (audio && audio.discard === reason) {
      audio.stop()
      audio.destroy()
      this.onDeck[type] = null
      this.changed.emit('changed')
    }
  }

  destroy() {
    this.pause()
    this.eventSubscription()
    this.actionSubscription()
    this.audioStateSubscription()
  }
}
