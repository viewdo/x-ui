jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { XViewDo } from '../x-view-do';

describe('x-view-do', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XViewDo],
      html: `<x-view-do url="/go"></x-view-do>`,
    })
    expect(page.root).toEqualHtml(`
      <x-view-do hidden="" class="" url="/go">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-view-do>
    `)
  })
})
