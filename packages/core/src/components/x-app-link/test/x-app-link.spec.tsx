jest.mock('../../../services/common/logging')
jest.mock('../../../workers/expr-eval.worker')

import { newSpecPage } from '@stencil/core/testing'
import { XAppView } from '../../x-app-view/x-app-view'
import { XApp } from '../../x-app/x-app'
import { XLink } from '../x-app-link'

describe('x-app-link', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XLink],
      html: `<x-app-link></x-app-link>`,
    })
    expect(page.root).toEqualHtml(`
      <x-app-link>
        <a class="link-active" x-attached-click="">
        </a>
      </x-app-link>
    `)
    let anchor = page.body.querySelector('a')
    anchor!.click()
    page.body.querySelector('x-app-link')?.remove()
  })

  it('renders with view', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XLink],
      html: `
      <x-app>
        <x-app-link href="/foo">Go to Foo</x-app-link>
        <x-app-view url="/foo">
        </x-app-view>
      </x-app>`,
    })

    const xui = page.body.querySelector('x-app')
    let linkEl = page.body.querySelector('x-app-link')
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
