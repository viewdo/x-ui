import { newSpecPage } from '@stencil/core/testing'
import {
  addDataProvider,
  clearDataProviders,
} from '../../services/data/factory'
import { IDataProvider } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers'
import { videoState } from '../../services/video'
import { XAppAutoplay } from './x-app-autoplay'
describe('x-app-autoplay', () => {
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

    let value = await storage.get('autoplay')

    expect(value).toBe('false')

    videoState.autoplay = true

    value = await storage.get('autoplay')

    expect(value).toBe('true')

    page.body.querySelector('x-app-autoplay')?.remove()
  })
})
