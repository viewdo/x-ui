jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { audioState } from '../../services/audio'
import {
  addDataProvider,
  clearDataProviders,
} from '../../services/data/factory'
import { IDataProvider } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import { XAudioEnabled } from './x-audio-enabled'

describe('x-audio-enabled', () => {
  let storage: IDataProvider
  beforeEach(async () => {
    storage = new InMemoryProvider()
    addDataProvider('storage', storage)
  })

  afterEach(async () => {
    clearDataProviders()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XAudioEnabled],
      html: `<x-audio-enabled></x-audio-enabled>`,
    })
    expect(page.root).toEqualHtml(`
      <x-audio-enabled>
        <input type="checkbox"  checked="">
      </x-audio-enabled>
    `)

    audioState.enabled = false

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-audio-enabled>
        <input type="checkbox">
      </x-audio-enabled>
    `)

    const control = page.body.querySelector('input')
    control!.checked = true
    control!.dispatchEvent(new Event('change'))

    expect(page.root).toEqualHtml(`
      <x-audio-enabled>
        <input type="checkbox"  checked="">
      </x-audio-enabled>
    `)

    audioState.enabled = false

    let value = await storage.get('audio')

    expect(value).toBe('false')

    audioState.enabled = true

    value = await storage.get('audio')

    expect(value).toBe('true')

    page.body.querySelector('x-audio-enabled')?.remove()
  })
})
