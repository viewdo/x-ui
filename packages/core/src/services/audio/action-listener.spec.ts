import { Howl } from 'howler';
import { EventEmitter } from '../actions/event-emitter';
import { AudioActionListener, AudioInfo, AUDIO_COMMANDS } from '../index';
import { AudioTrack } from './audio';
import { AudioType, AUDIO_TOPIC, DiscardStrategy } from './interfaces';

describe('audio-listener:', () => {
  let audio: any
  let listener: AudioActionListener
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  beforeAll(() => {
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
    listener = new AudioActionListener(eventBus, actionBus)
    audio = {
      play: () => 0,
      pause: () => this,
      fade: () => this,
      stop: () => this,
      mute: () => this,
      state: () => 'loaded',
      seek: (_time: number) => this,
      volume: (_value: number) => this,
      player: () => true,
    }
    AudioTrack.createSound = (info: AudioInfo, onload, onend, onerror) => {
      const instance = Object.assign(info, audio, {
        onload,
        onend,
        onerror,
      })
      return instance
    }
  })

  it('queue music: should play', async () => {
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

    const audio = new Howl({
      src: 'fake',
    })

    audio.play()
  })
})
