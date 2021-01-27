jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { XUI } from '../../x-ui/x-ui';
import { XView } from '../../x-view/x-view';
import { XViewDo } from '../x-view-do';

describe('x-view-do', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XUI, XView, XViewDo],
      url: 'http://test',
      html: `<x-ui ><x-view url='/'><x-view-do url="/go"></x-view-do></x-view></x-ui>`,
    })
    expect(page.root).toEqualHtml(`
    <x-ui>
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
      <x-view class="active-route" url="/">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <x-view-do class="" url="/go">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-view-do>
      </x-view>
    </x-ui>
    `)
  })
})
