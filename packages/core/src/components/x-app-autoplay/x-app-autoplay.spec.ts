import { newSpecPage } from '@stencil/core/testing'
import { videoState } from '../../services/video'
import { XAppAutoplay } from './x-app-autoplay'

describe('x-app-autoplay', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XAppAutoplay],
      html: `<x-app-autoplay></x-app-autoplay>`,
    })
    expect(page.root).toEqualHtml(`
      <x-app-autoplay>
        <input checked="" type="checkbox">
      </x-app-autoplay>
    `)

    videoState.autoplay = true

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-app-autoplay>
        <input type="checkbox" checked="">
      </x-app-autoplay>
    `)

    const control = page.body.querySelector('input')
    control!.checked = false
    control!.dispatchEvent(new Event('change'))

    expect(page.root).toEqualHtml(`
      <x-app-autoplay>
        <input type="checkbox" >
      </x-app-autoplay>
    `)

    page.body.querySelector('x-app-autoplay')?.remove()
  })
})
