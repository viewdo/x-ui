jest.mock('../../../services/data/evaluate.worker')

import { MockWindow } from '@stencil/core/mock-doc'
import { commonState } from '../../../services/common'
import { addDataProvider } from '../../../services/data/factory'
import { IDataProvider } from '../../../services/data/interfaces'
import { resolveTokens } from '../../../services/data/tokens'
import { EventEmitter } from '../../../services/events/emitter'
import { AudioActionListener } from './actions'
import { AudioDataProvider } from './provider'

describe('audio-provider', () => {
  let listener: AudioActionListener | any
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  let win: Window | any
  let subject: IDataProvider
  beforeEach(() => {
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
    win = new MockWindow(false)
    listener = new AudioActionListener(
      win,
      eventBus,
      actionBus,
      false,
    )
    commonState.providerTimeout = 1
    subject = new AudioDataProvider(listener)
    addDataProvider('audio', subject)
  })

  it('get:hasAudio', async () => {
    listener.onDeck['sound'] = {
      trackId: 'track-1',
      playing: () => true,
    }

    let result = await resolveTokens('{{audio:hasAudio}}')
    // Expect result
    expect(result).toBe('true')

    result = await resolveTokens('{{audio:isPlaying}}')
    // Expect result
    expect(result).toBe('true')
  })

  it('get:currentMusic', async () => {
    listener.onDeck['sound'] = {
      trackId: 'track-1',
      isPlaying: true,
    }

    let result = await resolveTokens('{{audio:currentMusic.trackId}}')
    // Expect result
    expect(result).toBe('track-1')

    result = await resolveTokens('{{audio:hasAudio}}')
    // Expect result
    expect(result).toBe('true')
  })

  it('get:loadedMusic', async () => {
    listener.loaded['music'] = [
      {
        trackId: 'track-1',
        src: './some-file.mp3',
      },
      {
        trackId: 'track-2',
        src: './some-file.mp3',
      },
    ]

    let result = await resolveTokens('{{audio:loadedMusic}}')
    // Expect result
    expect(result).toBe(
      `[{"trackId":"track-1","src":"./some-file.mp3"},{"trackId":"track-2","src":"./some-file.mp3"}]`,
    )

    // Expect result
    result = await resolveTokens('{{audio:loadedMusic.length}}')
    // Expect result
    expect(result).toBe('2')
  })

  it('get:queuedMusic', async () => {
    listener.queued['music'] = [
      {
        trackId: 'track-1',
        src: './some-file.mp3',
      },
      {
        trackId: 'track-2',
        src: './some-file.mp3',
      },
    ]

    let result = await resolveTokens('{{audio:queuedMusic}}')
    // Expect result
    expect(result).toBe(
      `[{"trackId":"track-1","src":"./some-file.mp3"},{"trackId":"track-2","src":"./some-file.mp3"}]`,
    )

    // Expect result
    result = await resolveTokens('{{audio:queuedMusic.length}}')
    // Expect result
    expect(result).toBe('2')
  })

  it('get:currentSound', async () => {
    listener.onDeck['sound'] = {
      trackId: 'track-1',
      isPlaying: true,
    }

    let result = await resolveTokens('{{audio:currentSound.trackId}}')
    // Expect result
    expect(result).toBe('track-1')

    result = await resolveTokens('{{audio:hasAudio}}')
    // Expect result
    expect(result).toBe('true')
  })

  it('get:loadedSounds', async () => {
    listener.loaded['sound'] = [
      {
        trackId: 'track-1',
        src: './some-file.mp3',
      },
      {
        trackId: 'track-2',
        src: './some-file.mp3',
      },
    ]

    let result = await resolveTokens('{{audio:loadedSounds}}')
    // Expect result
    expect(result).toBe(
      `[{"trackId":"track-1","src":"./some-file.mp3"},{"trackId":"track-2","src":"./some-file.mp3"}]`,
    )

    // Expect result
    result = await resolveTokens('{{audio:loadedSounds.length}}')
    // Expect result
    expect(result).toBe('2')
  })

  it('get:queuedSounds', async () => {
    listener.queued['sound'] = [
      {
        trackId: 'track-1',
        src: './some-file.mp3',
      },
      {
        trackId: 'track-2',
        src: './some-file.mp3',
      },
    ]

    let result = await resolveTokens('{{audio:queuedSounds}}')
    // Expect result
    expect(result).toBe(
      `[{"trackId":"track-1","src":"./some-file.mp3"},{"trackId":"track-2","src":"./some-file.mp3"}]`,
    )

    // Expect result
    result = await resolveTokens('{{audio:queuedSounds.length}}')
    // Expect result
    expect(result).toBe('2')
  })
})
