jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { getDataProvider } from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { eventBus } from '../../services/events'
import { XApp } from '../x-app/x-app'
import { StorageService } from './storage/service'
import { XDataProviderStorage } from './x-data-provider-storage'

describe('x-data-provider-storage', () => {
  afterEach(() => {
    eventBus.removeAllListeners()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataProviderStorage],
      html: `<x-data-provider-storage></x-data-provider-storage>`,
    })
    expect(page.root).toEqualHtml(`
      <x-data-provider-storage>
      </x-data-provider-storage>
    `)
  })

  it('localStorage: is functional', async () => {
    const page = await newSpecPage({
      components: [XApp, XDataProviderStorage],
      html:
        '<x-app><x-data-provider-storage></x-data-provider-storage></x-app>',
      supportsShadowDom: true,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector(
      'x-data-provider-storage',
    )!

    const provider = (await getDataProvider(
      'storage',
    )) as StorageService
    expect(provider).toBeDefined()

    await provider!.set('test', 'value')

    const result = page.win.localStorage.getItem('test')
    expect(result).toBe('value')

    const verified = await provider!.get('test')
    expect(verified).toBe(result)

    let changed = false
    eventBus.on(DATA_EVENTS.DataChanged, () => {
      changed = true
    })

    page.win.dispatchEvent(new CustomEvent('storage'))
    page.win.localStorage.setItem('fake', 'value')

    await page.waitForChanges()

    expect(changed).toBeTruthy()

    subject.remove()
  })
})
