jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing'
import { XView } from '../x-view'

describe('x-view', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XView],
      html: `<x-view></x-view>`,
    })
    expect(page.root).toEqualHtml(`
      <x-view>
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-view>
    `)
  })
})
