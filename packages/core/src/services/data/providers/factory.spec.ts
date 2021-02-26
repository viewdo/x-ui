jest.mock('../../logging')

import { newSpecPage } from '@stencil/core/testing';
import { XApp } from '../../../components/x-app/x-app';
import { actionBus, eventBus } from '../../actions';
import { CookieProvider } from '../cookies/cookie';
import { addDataProvider, clearDataProviders, getDataProvider, removeDataProvider } from './factory';
import { InMemoryProvider } from './memory';

describe('provider-factory', () => {
  let custom: InMemoryProvider

  beforeEach(() => {
    custom = new InMemoryProvider()
    addDataProvider('custom', custom)
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  it('getProvider: incorrect name should return null', async () => {
    const provider = await getDataProvider('bad')
    expect(provider).toBe(null)
  })

  it('getProvider: returns custom provider', async () => {
    const provider = await getDataProvider('custom')
    expect(provider).toBe(custom)
  })

  it('removeProvider: removes correctly', async () => {
    removeDataProvider('custom')
    const provider = await getDataProvider('custom')
    expect(provider).toBe(null)
  })

  it('clearDataProviders: removes correctly', async () => {
    clearDataProviders()
    const provider = await getDataProvider('custom')
    expect(provider).toBe(null)
  })

  it('sessionProvider: is functional', async () => {
    const page = await newSpecPage({
      components: [XApp],
      html: '<x-app></x-app>',
      supportsShadowDom: true,
    })
    const provider = await getDataProvider('session')
    expect(provider).toBeDefined()

    await provider!.set('test', 'value')

    const result = page.win.sessionStorage.getItem('test')
    expect(result).toBe('value')

    const verified = await provider!.get('test')
    expect(verified).toBe(result)
  })

  it('localStorage: is functional', async () => {
    const page = await newSpecPage({
      components: [XApp],
      html: '<x-app></x-app>',
      supportsShadowDom: true,
    })
    await page.waitForChanges()

    const provider = await getDataProvider('storage')
    expect(provider).toBeDefined()

    await provider!.set('test', 'value')

    const result = page.win.localStorage.getItem('test')
    expect(result).toBe('value')

    const verified = await provider!.get('test')
    expect(verified).toBe(result)
  })

  it('cookieProvider: is functional', async () => {
    const page = await newSpecPage({
      components: [XApp],
      html: '<x-app></x-app>',
      supportsShadowDom: true,
    })

    const cookieProvider = new CookieProvider(page.doc)

    await cookieProvider.set('test', 'value')
    const verified = await cookieProvider.get('test')
    expect(verified).toBe('value')
  })
})
