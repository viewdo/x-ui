import { newSpecPage } from '@stencil/core/testing'
import { interfaceState, interfaceStateDispose } from '../../services/interface'
import { XAppThemeDark } from './x-app-theme-dark'

describe('x-app-theme-dark', () => {
  beforeEach(() => {
    interfaceStateDispose()
  })

  it('checkbox shows accurate state: null', async () => {
    interfaceState.theme = null
    const page = await newSpecPage({
      components: [XAppThemeDark],
      autoApplyChanges: true,
      html: `<x-app-theme-dark></x-app-theme-dark>`,
    })

    expect(page.root).toEqualHtml(`
      <x-app-theme-dark>
        <input type="checkbox"/>
      </x-app-theme-dark>
    `)

    const subject = page.body.querySelector('x-app-theme-dark')
    subject?.remove()
  })

  it('checkbox shows accurate state: dark', async () => {
    interfaceState.theme = 'dark'
    const page = await newSpecPage({
      components: [XAppThemeDark],
      html: `<x-app-theme-dark></x-app-theme-dark>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-app-theme-dark>
        <input checked="" type="checkbox">
      </x-app-theme-dark>
    `)
    const subject = page.body.querySelector('x-app-theme-dark')
    subject?.remove()
  })

  it('checkbox shows accurate state: light', async () => {
    interfaceState.theme = 'light'
    const page = await newSpecPage({
      components: [XAppThemeDark],
      html: `<x-app-theme-dark></x-app-theme-dark>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-app-theme-dark>
        <input type="checkbox">
      </x-app-theme-dark>
    `)

    const subject = page.body.querySelector('x-app-theme-dark')
    subject?.remove()
  })

  it('checkbox click changes theme', async () => {
    interfaceState.theme = 'dark'
    const page = await newSpecPage({
      components: [XAppThemeDark],
      html: `<x-app-theme-dark></x-app-theme-dark>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-app-theme-dark>
       <input checked="" type="checkbox"/>
      </x-app-theme-dark>
    `)

    const control = page.body.querySelector('x-app-theme-dark')
    const input = control?.querySelector('input')
    input!.checked = true
    input!.dispatchEvent(new Event('change'))

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <x-app-theme-dark>
      <input type="checkbox"/>
     </x-app-theme-dark>
    `)

    expect(interfaceState.theme).not.toEqual('dark')

    const subject = page.body.querySelector('x-app-theme-dark')
    subject?.remove()
  })
})
