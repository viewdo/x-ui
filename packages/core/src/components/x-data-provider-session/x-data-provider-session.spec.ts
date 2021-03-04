jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { getDataProvider } from '../../services/data/factory'
import { XApp } from '../x-app/x-app'
import { XDataProviderSession } from './x-data-provider-session'

describe('x-data-provider-session', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataProviderSession],
      html: `<x-data-provider-session></x-data-provider-session>`,
    })
    expect(page.root).toEqualHtml(`
      <x-data-provider-session  hidden="">
      </x-data-provider-session>
    `)
  })

  it('sessionProvider: is functional', async () => {
    const page = await newSpecPage({
      components: [XApp, XDataProviderSession],
      html: `<x-app>
        <x-data-provider-session></x-data-provider-session>
      </x-app>`,
      supportsShadowDom: true,
    })

    await page.waitForChanges()

    const subject = page.body.querySelector('x-data-provider-session')!

    const provider = await getDataProvider('session')
    expect(provider).not.toBeNull()

    await provider!.set('test', 'value')

    const result = page.win.sessionStorage.getItem('test')
    expect(result).toBe('value')

    const verified = await provider!.get('test')
    expect(verified).toBe(result)

    subject.remove()
  })
})
