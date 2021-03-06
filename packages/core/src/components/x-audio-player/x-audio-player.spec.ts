jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/audio/audio')

import { newSpecPage } from '@stencil/core/testing'
import {
  AudioInfo,
  audioState,
  audioStore,
  AudioType,
  DiscardStrategy,
  LoadStrategy,
} from '../../services/audio'
import { actionBus, eventBus } from '../../services/events'
import { interfaceStore } from '../../services/interface'
import { XAudioPlayer } from './x-audio-player'

describe('x-audio-player', () => {
  let data: AudioInfo | any
  beforeEach(() => {
    data = {
      src: '/fake/path.mp3',
      trackId: 'queued-music-1',
      type: AudioType.Music,
      discard: DiscardStrategy.Route,
      loop: true,
      mode: LoadStrategy.Load,
    }
  })

  afterEach(async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    interfaceStore.dispose()
    audioStore.dispose()
  })

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

    audioState.hasAudio = false
    audioState.enabled = false
    await page.waitForChanges()

    // actionBus.emit(AUDIO_TOPIC, {
    //   topic: AUDIO_TOPIC,
    //   command: AUDIO_COMMANDS.Load,
    //   data,
    // })

    await page.waitForChanges()

    // expect(audioState.hasAudio).toBe(true)
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
