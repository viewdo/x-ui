jest.mock('../../../services/data/evaluate.worker')

import { newSpecPage, SpecPage } from '@stencil/core/testing'
import { sleep } from '../../../services/common/promises'
import { EventEmitter } from '../../../services/events'
import { ROUTE_EVENTS } from '../../../services/routing'
import { AudioActionListener } from './actions'
import {
  AudioInfo,
  AudioType,
  AUDIO_COMMANDS,
  AUDIO_EVENTS,
  AUDIO_TOPIC,
  DiscardStrategy,
  LoadStrategy,
} from './interfaces'
import { AudioTrack } from './track'
import { clearTracked } from './tracked'

describe('audio-listener:', () => {
  let audio: any = {}
  let listener: AudioActionListener
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  let events: Array<any[]>
  let page: SpecPage

  beforeAll(async () => {
    page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    events = []
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()

    page.win['Howler'] = ({
      unload: () => this,
      volume: () => 0,
    } as unknown) as Howler

    listener = new AudioActionListener(page.win, eventBus, actionBus)

    eventBus.on('*', (...args: any[]) => {
      events.push(...args)
    })

    AudioTrack.createSound = (
      info: AudioInfo,
      onload,
      onend,
      onerror,
    ) => {
      let _state = ''
      const instance = Object.assign(info, audio, {
        onload,
        onend,
        onerror,
        play: () => (_state = 'playing'),
        pause: () => (_state = 'paused'),
        fade: () => this,
        start: () => (_state = 'playing'),
        stop: () => (_state = 'stopped'),
        mute: (mute: boolean) =>
          (_state = mute ? 'muted' : 'playing'),
        state: () => _state,
        seek: (time: number) => (_state = `${_state}:${time}`),
        volume: (_value: number) => this,
        player: () => true,
        playing: () => _state.startsWith('playing'),
        unload: () => (_state = ''),
      })
      _state = 'loaded'
      setTimeout(() => {
        instance.onload()
      }, 1)
      return instance
    }
  })

  it('music: queued, played, pause, resume and end', async () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Queue,
      data: {
        src: '/fake/path.mp3',
        trackId: 'queued-music-1',
        type: AudioType.Music,
        discard: DiscardStrategy.Route,
        loop: true,
      },
    })

    // when queued, and nothing is playing, the audio
    let playing = listener.onDeck[AudioType.Music]
    expect(playing).not.toBeNull()

    await sleep(10)
    expect(listener.isPlaying).toBe(true)
    expect(listener.hasAudio).toBe(true)

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.Pause,
      data: {},
    })

    expect(listener.isPlaying).toBe(false)
    expect(listener.hasAudio).toBe(true)

    // calling pause again, should cause no harm
    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.Pause,
      data: {},
    })

    expect(listener.isPlaying).toBe(false)
    expect(listener.hasAudio).toBe(true)

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.Resume,
      data: {},
    })

    expect(listener.isPlaying).toBe(true)
    expect(listener.hasAudio).toBe(true)

    // Calling resume again, should have no harm
    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.Resume,
      data: {},
    })

    expect(listener.isPlaying).toBe(true)
    expect(listener.hasAudio).toBe(true)

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})

    playing = listener.onDeck[AudioType.Music]
    expect(playing).toBeNull()
    expect(listener.isPlaying).toBe(false)
    expect(listener.hasAudio).toBe(false)
  })

  it('music: play immediately', () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Queue,
      data: {
        src: '/fake/path1.mp3',
        trackId: 'queued-music-1',
        type: AudioType.Music,
        discard: DiscardStrategy.Route,
        loop: true,
      },
    })

    // when queued, and nothing is playing, the audio
    let playing = listener.onDeck[AudioType.Music]
    expect(playing).not.toBeNull()
    expect(playing?.state()).toBe('playing')
    expect(listener.isPlaying).toBe(true)
    expect(listener.hasAudio).toBe(true)

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Play,
      data: {
        src: '/fake/path2.mp3',
        trackId: 'play-music-1',
        type: AudioType.Music,
        discard: DiscardStrategy.Route,
        loop: true,
      },
    })

    playing = listener.onDeck[AudioType.Music]
    expect(playing).not.toBeNull()
    expect(playing!.state()).toBe('playing')
    expect(listener.isPlaying).toBe(true)
    expect(listener.hasAudio).toBe(true)

    expect(playing?.src).toBe('/fake/path2.mp3')
  })

  it('sound: load, play, pause, resume and end', async () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Load,
      data: {
        src: '/fake/path.mp3',
        trackId: 'sound-1',
        type: AudioType.Sound,
        discard: DiscardStrategy.Route,
      },
    })

    // when loaded, and nothing is playing, the audio
    // should wait
    let playing = listener.onDeck[AudioType.Sound]
    expect(playing).toBeNull()

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.Start,
      data: {
        type: AudioType.Sound,
        trackId: 'sound-1',
      },
    })

    expect(listener.isPlaying).toBe(true)
    expect(listener.hasAudio).toBe(true)

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.Pause,
      data: {},
    })

    expect(listener.isPlaying).toBe(false)
    expect(listener.hasAudio).toBe(true)

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.Resume,
      data: {},
    })

    expect(listener.isPlaying).toBe(true)
    expect(listener.hasAudio).toBe(true)

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})

    playing = listener.onDeck[AudioType.Music]
    expect(playing).toBeNull()
    expect(listener.isPlaying).toBe(false)
    expect(listener.hasAudio).toBe(false)
  })

  it('music: play, seek, mute and set volume', () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Play,
      data: {
        src: '/fake/path2.mp3',
        trackId: 'play-1',
        type: AudioType.Music,
        discard: DiscardStrategy.Route,
        loop: true,
      },
    })

    let playing = listener.onDeck[AudioType.Music]
    expect(playing).not.toBeNull()
    expect(playing!.state()).toBe('playing')
    expect(listener.isPlaying).toBe(true)
    expect(listener.hasAudio).toBe(true)
    expect(playing?.src).toBe('/fake/path2.mp3')

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Seek,
      data: {
        type: AudioType.Music,
        trackId: 'play-1',
        value: 100,
      },
    })

    expect(playing!.state()).toBe('playing:100')

    // bad seek
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Seek,
      data: {
        type: AudioType.Music,
        trackId: 'bad-id',
        value: 50,
      },
    })

    expect(playing!.state()).toBe('playing:100')

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Volume,
      data: {
        value: 5,
      },
    })

    expect(listener.isPlaying).toBe(true)

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Mute,
      data: {
        value: true,
      },
    })

    expect(listener.isPlaying).toBe(false)
  })

  it('sound: ends and is marked to not play again', () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Play,
      data: {
        src: '/fake/path2.mp3',
        trackId: 'play-1',
        type: AudioType.Sound,
        discard: DiscardStrategy.Next,
        track: true,
        mode: LoadStrategy.Play,
      },
    })

    let playing = listener.onDeck[AudioType.Sound]
    expect(playing).not.toBeNull()
    expect(playing!.state()).toBe('playing')
    expect(listener.isPlaying).toBe(true)
    expect(listener.hasAudio).toBe(true)
    expect(playing?.src).toBe('/fake/path2.mp3')

    playing?.events.emit(AUDIO_EVENTS.Ended, 'play-1')

    playing = listener.onDeck[AudioType.Sound]
    expect(playing).toBeNull()

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Play,
      data: {
        src: '/fake/path2.mp3',
        trackId: 'play-1',
        type: AudioType.Sound,
        discard: DiscardStrategy.Next,
        track: true,
        mode: LoadStrategy.Play,
      },
    })

    playing = listener.onDeck[AudioType.Sound]
    expect(playing).toBeNull()

    clearTracked()

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.Play,
      data: {
        src: '/fake/path2.mp3',
        trackId: 'play-1',
        type: AudioType.Sound,
        discard: DiscardStrategy.Next,
        track: true,
        mode: LoadStrategy.Play,
      },
    })

    playing = listener.onDeck[AudioType.Sound]
    expect(playing).not.toBeNull()

    listener.destroy()
  })
})
