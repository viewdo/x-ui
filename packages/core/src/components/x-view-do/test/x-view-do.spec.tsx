jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { actionBus, eventBus } from '../../../services';
import { XUI } from '../../x-ui/x-ui';
import { XView } from '../../x-view/x-view';
import { XViewDo } from '../x-view-do';

describe('x-view-do', () => {

  beforeEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  it('renders inactive', async () => {
    const page = await newSpecPage({
      components: [XUI, XView, XViewDo],
      url: 'http://test/',
      html: `<x-ui><x-view url='/foo'><x-view-do url="/go"></x-view-do></x-view></x-ui>`,
    })

    expect(page.win.location.pathname).toBe('/')

    expect(page.root).toEqualHtml(`
    <x-ui>
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
      <x-view class="active-route active-route-exact" url="/foo">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <x-view-do hidden="" class="" url="/go" >
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-view-do>
      </x-view>
    </x-ui>
    `)

    const subject = page.body.querySelector('x-ui')
    subject?.remove()
  })

  it('renders active', async () => {
    const page = await newSpecPage({
      components: [XUI, XView, XViewDo],
      url: 'http://test/',
      html: `
      <x-ui>
        <x-view url='/'>
          <x-view-do url="/go">
            <a x-next>Next</a>
          </x-view-do>
        </x-view>
      </x-ui>`,
      autoApplyChanges: true
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
        <x-view-do class="" url="/go" >
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <a x-attached-click="" x-next="">Next</a>
        </x-view-do>
      </x-view>
    </x-ui>
    `)

    const xui = page.body.querySelector('x-ui')
    expect(xui?.router.location.pathname).toBe('/go')

    const next = page.body.querySelector('a')
    next!.click()

    expect(xui?.router.location.pathname).toBe('/')

    xui?.remove()
  })
})
