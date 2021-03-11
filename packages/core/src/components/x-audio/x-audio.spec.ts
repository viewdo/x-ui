jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')
jest.mock('./audio/track')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { contentStateDispose } from '../../services/content/state'
import { XContentReference } from '../x-content-reference/x-content-reference'
import { audioState, audioStateDispose } from './audio/state'
import { XAudioPlayer } from './x-audio'
describe('x-audio', () => {
  // let data: AudioInfo | any
  beforeEach(() => {
    // data = {
    //   src: '/fake/path.mp3',
    //   trackId: 'queued-music-1',
    //   type: AudioType.Music,
    //   discard: DiscardStrategy.Route,
    //   loop: true,
    //   mode: LoadStrategy.Load,
    // }
  })

  afterEach(async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    contentStateDispose()
    audioStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XAudioPlayer],
      html: `<x-audio></x-audio>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
    <x-audio hidden="">
      <mock:shadow-root>
      <x-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></x-content-reference>
      </mock:shadow-root>
    </x-audio>
    `)
  })

  it('reacts to audioState changes', async () => {
    const page = await newSpecPage({
      components: [XAudioPlayer],
      html: `<x-audio>
      </x-audio>`,
    })

    expect(page.root).toEqualHtml(`
    <x-audio hidden="">
      <mock:shadow-root>
        <x-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></x-content-reference>
      </mock:shadow-root>
    </x-audio>
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
      components: [XAudioPlayer, XContentReference],
      html: `<x-audio display></x-audio>`,
    })

    await page.waitForChanges()

    page.body.querySelector('x-audio')?.remove()

    await page.waitForChanges()
  })

  afterAll(() => {})
})
