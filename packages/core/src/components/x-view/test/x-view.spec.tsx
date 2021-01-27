jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { XUI } from '../../x-ui/x-ui';
import { XView } from '../x-view';

describe('x-view', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XUI, XView],
      html: `<x-ui ><x-view url='/'></x-view></x-ui>`,
    })
    expect(page.root).toEqualHtml(`
      <x-ui>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <x-view class="active-route active-route-exact" url="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-view>
      </x-ui>
    `)
  })
})
