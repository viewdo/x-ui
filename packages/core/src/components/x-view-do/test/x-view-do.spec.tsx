jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { XUI } from '../../x-ui/x-ui';
import { XView } from '../../x-view/x-view';
import { XViewDo } from '../x-view-do';

describe('x-view-do', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XUI, XView, XViewDo],
      url: 'http://test/',
      html: `<x-ui><x-view url='/'><x-view-do visit="optional" url="/go"></x-view-do></x-view></x-ui>`,
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
        <x-view-do hidden="" class="" url="/go" visit="optional">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-view-do>
      </x-view>
    </x-ui>
    `)

    const subject = page.body.querySelector('x-view-do')
    subject?.remove()
  })
})
