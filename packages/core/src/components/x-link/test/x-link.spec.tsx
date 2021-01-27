jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { XUI } from '../../x-ui/x-ui';
import { XView } from '../../x-view/x-view';
import { XLink } from '../x-link';

describe('x-link', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XLink],
      html: `<x-link></x-link>`,
    })
    expect(page.root).toEqualHtml(`
      <x-link>
        <a class="link-active" x-attached-click="">
        </a>
      </x-link>
    `)
    let anchor = page.body.querySelector('a')
    anchor!.click()
    page.body.querySelector('x-link')?.remove()
  })

  it('renders with view', async () => {
    const page = await newSpecPage({
      components: [XUI, XView, XLink],
      html: `
      <x-ui>
        <x-link href="/foo">Go to Foo</x-link>
        <x-view url="/foo">
        </x-view>
      </x-ui>`,
    })

    const xui = page.body.querySelector('x-ui')
    let linkEl = page.body.querySelector('x-link')
    let anchor = page.body.querySelector('a')
    expect(anchor?.classList.contains('link-active')).toBe(false)

    anchor!.click()
    await page.waitForChanges()

    expect(xui!.router.location.pathname).toBe('/foo')

    expect(anchor?.classList.contains('link-active')).toBe(true)
    linkEl?.remove()

    xui!.remove()
  })
})
