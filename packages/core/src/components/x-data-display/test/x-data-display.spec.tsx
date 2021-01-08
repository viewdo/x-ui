jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing'
import { XDataDisplay } from '../x-data-display'
import { InMemoryProvider } from '../../../services/data/providers/memory'
import { addDataProvider } from '../../../services/data/providers/factory'

describe('x-data-display', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    session = new InMemoryProvider()
    addDataProvider('session', session)
  })

  it('renders simple strings', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display text="foo"></x-data-display>`,
      supportsShadowDom: false,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-display text="foo">
        foo
      </x-data-display>
    `)
  })

  it('renders simple strings with classes', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display text="foo" class="name"></x-data-display>`,
      supportsShadowDom: false,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display text="foo" class="name">
        foo
      </x-data-display>
    `)
  })

  it('renders child template', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display text="test">
              <template>
                <p>Hello Jason!</p>
              </template>
             </x-data-display>`,
      supportsShadowDom: false,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display innerhtml=" <p>Hello Jason!</p> " text="test">
        <p>Hello Jason!</p>
        test
      </x-data-display>
    `)
  })

  it('renders text value in child template', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display text="test">
              <template>
                <p>Hello Jason!</p>
              </template>
             </x-data-display>`,
      supportsShadowDom: false,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display innerhtml=" <p>Hello Jason!</p> " text="test">
        <p>Hello Jason!</p>
        test
      </x-data-display>
    `)
  })

  it('renders inline data to child template', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display>
              <script type="application/json">
              { "name": "Forrest" }
              </script>
              <template>
                <p>Hello {data:name}!</p>
              </template>
             </x-data-display>`,
      supportsShadowDom: false,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display innerHtml=" <p>Hello Forrest!</p> ">
        <p>Hello Forrest!</p>
      </x-data-display>
    `)
  })

  it('renders session data to child template', async () => {
    await session.set('name', 'Tom')
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display>
              <template>
                <p>Hello {session:name}!</p>
              </template>
             </x-data-display>`,
      supportsShadowDom: false,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display innerHtml=" <p>Hello Tom!</p> ">
        <p>Hello Tom!</p>
      </x-data-display>
    `)
  })
})
