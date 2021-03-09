import { newSpecPage } from '@stencil/core/testing'
import { XElements } from './x-elements'

describe('x-elements', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XElements],
      html: `<x-elements></x-elements>`,
    })
    expect(page.root).toEqualHtml(`
      <x-elements>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-elements>
    `)
  })
})
