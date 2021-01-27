jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { actionBus, eventBus } from '../../..';
import { clearDataProviders, getDataProvider } from '../../../services/data/providers/factory';
import { XUI } from '../../x-ui/x-ui';
import { XDataProviderCookie } from '../x-data-provider-cookie';

describe('x-data-provider-cookie', () => {
  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    clearDataProviders()
  })

  it('no render when hide', async () => {
    const page = await newSpecPage({
      components: [XDataProviderCookie],
      html: `<x-data-provider-cookie hide-when="true">
          </x-data-provider-cookie>`
    });
    expect(page.root).toEqualHtml(`
    <x-data-provider-cookie hidden="" hide-when="true">
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
    </x-data-provider-cookie>
    `)
  })

  it('renders a dialog, click consent', async () => {
    const page = await newSpecPage({
      components: [XUI, XDataProviderCookie],
      html: `
        <x-ui>
          <x-data-provider-cookie>
            <button x-accept>Accept</button>
            <button x-reject>Reject</button>
          </x-data-provider-cookie>
        </x-ui>`,
    })

    const subject = page.body.querySelector('x-data-provider-cookie')!

    const acceptButton = page.body.querySelector('button[x-accept]')! as HTMLButtonElement

    await acceptButton.click()

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-ui>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <x-data-provider-cookie hidden="">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <button x-accept>Accept</button>
          <button x-reject>Reject</button>
        </x-data-provider-cookie>
      </x-ui>
    `)

    const provider = getDataProvider('cookie')
    expect(provider).not.toBeNull()

    let value = await provider.get('consent')

    expect(value).toBe('true')

    subject?.remove()

  })

  it('renders a dialog, click reject', async () => {
    const page = await newSpecPage({
      components: [XUI, XDataProviderCookie],
      html: `
        <x-ui>
          <x-data-provider-cookie>
            <button x-accept>Accept</button>
            <button x-reject>Reject</button>
          </x-data-provider-cookie>
        </x-ui>`,
    })

    const subject = page.body.querySelector('x-data-provider-cookie')!

    const rejectButton = page.body.querySelector('button[x-reject]')! as HTMLButtonElement

    await rejectButton.click()

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-ui>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <x-data-provider-cookie hidden="">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <button x-accept>Accept</button>
          <button x-reject>Reject</button>
        </x-data-provider-cookie>
      </x-ui>
    `)

    const provider = getDataProvider('cookie') || null
    expect(provider).toBeNull()

    subject?.remove()
  })
})
