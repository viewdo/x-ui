jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { actionBus, eventBus } from '../../../services';
import { XAppView } from '../../x-app-view/x-app-view';
import { XApp } from '../../x-app/x-app';
import { XAppViewDo } from '../x-app-view-do';

describe('x-app-view-do', () => {

  beforeEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  it('renders inactive', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html: `<x-app><x-app-view url='/foo'><x-app-view-do url="/go"></x-app-view-do></x-app-view></x-app>`,
    })

    expect(page.win.location.pathname).toBe('/')

    expect(page.root).toEqualHtml(`
    <x-app>
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
      <x-app-view class="active-route active-route-exact" url="/foo">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <x-app-view-do hidden="" class="" url="/go" >
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-app-view-do>
      </x-app-view>
    </x-app>
    `)

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('renders active', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html: `
      <x-app>
        <x-app-view url='/'>
          <x-app-view-do url="/go">
            <a x-next>Next</a>
          </x-app-view-do>
        </x-app-view>
      </x-app>`,
      autoApplyChanges: true
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
        <x-app-view-do class="" url="/go" >
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <a x-attached-click="" x-attached-keydown="" x-next="">Next</a>
        </x-app-view-do>
      </x-app-view>
    </x-app>
    `)

    const xui = page.body.querySelector('x-app')
    expect(xui?.router.location.pathname).toBe('/go')

    const next = page.body.querySelector('a')
    next!.click()

    expect(xui?.router.location.pathname).toBe('/')

    xui?.remove()
  })
})
