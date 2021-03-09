import { newSpecPage } from '@stencil/core/testing'
import { XData } from './x-data'

describe('x-data', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XData],
      html: `<x-data></x-data>`,
    })
    expect(page.root).toEqualHtml(`
      <x-data>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-data>
    `)
  })
})
