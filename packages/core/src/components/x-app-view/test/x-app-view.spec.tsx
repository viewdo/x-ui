jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { XApp } from '../../x-app/x-app';
import { XAppView } from '../x-app-view';

describe('x-app-view', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView],
      html: `<x-app ><x-app-view url='/'></x-app-view></x-app>`,
    })
    expect(page.root).toEqualHtml(`
      <x-app>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <x-app-view class="active-route active-route-exact" url="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-app-view>
      </x-app>
    `)
  })
})
