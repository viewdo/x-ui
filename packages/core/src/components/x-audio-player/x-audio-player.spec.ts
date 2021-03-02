jest.mock('../../services/common/logging')
jest.mock('../../services/audio/actions')

import { newSpecPage } from '@stencil/core/testing'
import { audioState, audioStore, AudioTrack, AudioType, DiscardStrategy } from '../../services/audio'
import { actionBus, eventBus } from '../../services/events'
import { interfaceStore } from '../../services/interface'
import { XAudioPlayer } from './x-audio-player'

type Audio = {
  play: () => number
  pause: () => any
  fade: () => any
  stop: () => any
  mute: () => any
  state: () => string
  seek: (_time: number) => any
  volume: (_value: number) => any
}

describe('x-audio-player', () => {
  let data

  let audio: Audio
  beforeAll(() => {
    data = {
      src: '/fake/path.mp3',
      trackId: 'queued-music-1',
      type: AudioType.Music,
      discard: DiscardStrategy.Route,
      loop: true,
    }
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()

    audio = {
      play: () => 0,
      pause: () => this,
      fade: () => this,
      stop: () => this,
      mute: () => this,
      state: () => 'loaded',
      seek: (_time: number) => this,
      volume: (_value: number) => this,
    }

    interfaceStore.dispose()
    audioStore.dispose()
  })

  //@ts-ignore
  AudioTrack.createSound = (info: AudioInfo, onload: any, onend: any, onerror: any) => {
    const instance = Object.assign(info, audio, {
      onload,
      onend,
      onerror,
    })
    onload()
    return instance as Audio
  }

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XAudioPlayer],
      html: `<x-audio-player></x-audio-player>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
    <x-audio-player>
      <mock:shadow-root></mock:shadow-root>
    </x-audio-player>
    `)
  })

  it('reacts to audioState changes', async () => {
    const page = await newSpecPage({
      components: [XAudioPlayer],
      html: `<x-audio-player></x-audio-player>`,
    })
    expect(page.root).toEqualHtml(`
    <x-audio-player>
      <mock:shadow-root></mock:shadow-root>
    </x-audio-player>
    `)

    await page.waitForChanges()

    audioState.hasAudio = true

    await page.waitForChanges()

    audioState.enabled = true
  })

  it('reacts to listener changes', async () => {
    const page = await newSpecPage({
      components: [XAudioPlayer],
      html: `<x-audio-player display></x-audio-player>`,
    })

    await page.waitForChanges()

    page.body.querySelector('x-audio-player')?.remove()

    await page.waitForChanges()
  })

  afterAll(() => {})
})
