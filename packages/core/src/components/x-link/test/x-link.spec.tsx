jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing'
import { XViewLink } from '../x-link'

describe('x-link', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XViewLink],
      html: `<x-link></x-link>`,
    })
    expect(page.root).toEqualHtml(`
      <x-link>
        <a class="link-active"></a>
      </x-link>
    `)
  })
})
