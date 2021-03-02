jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { audioState } from '../../services/audio'
import { XAudioEnabled } from './x-audio-enabled'

describe('x-audio-enabled', () => {
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

    page.body.querySelector('x-audio-enabled')?.remove()
  })
})
