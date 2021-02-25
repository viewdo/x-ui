jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { actionBus, eventBus } from '../../../services';
import { XAppView } from '../../x-app-view/x-app-view';
import { XApp } from '../../x-app/x-app';
import { XAppViewDo } from '../x-app-view-do';

describe('x-app-view-do', () => {

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('renders inactive', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html:
      `<x-app>
        <x-app-view url='/foo'>
          <x-app-view-do url="/go">
          </x-app-view-do>
        </x-app-view>
      </x-app>`,
    })

    expect(page.win.location.pathname).toBe('/')

    expect(page.root).toEqualHtml(`
    <x-app>
      <x-app-view url="/foo">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <x-app-view-do hidden="" url="/go" >
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
          <div slot="content">
            Hello
          </div>
        </x-app-view>
      </x-app>`,
      autoApplyChanges: true
    })


    expect(page.root).toEqualHtml(`
    <x-app>
      <x-app-view class="active-route" url="/">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content">
          </slot>
        </mock:shadow-root>
        <x-app-view-do class="active-route active-route-exact" url="/go" >
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <a x-attached-click="" x-attached-keydown="" x-next="">Next</a>
        </x-app-view-do>
        <div slot="content">
            Hello
          </div>
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

  it('navigate two steps and back to home', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html:
      `<x-app start-url='/start'>
        <x-app-view url='/start'>
          <x-app-view-do url="step-1">
            <a id='s1' x-next>NEXT</a>
          </x-app-view-do>
          <x-app-view-do url="step-2">
            <a id='b2' x-back>BACK</a>
            <a id='s2' x-next>NEXT</a>
          </x-app-view-do>
          done!
        </x-app-view>
      </x-app>`,
    })

    const router = page.body.querySelector('x-app')?.router

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-1')

    const next1 = page.body.querySelector('a#s1') as HTMLAnchorElement
    next1.click()

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-2')

    const next2 = page.body.querySelector('a#s2') as HTMLAnchorElement
    next2.click()

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start')

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('navigate forward, then back', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html:
      `<x-app start-url='/start'>
        <x-app-view url='/start'>
          <x-app-view-do url="step-1">
            <a id='s1' x-next>NEXT</a>
          </x-app-view-do>
          <x-app-view-do url="step-2">
            <a id='b2' x-back>BACK</a>
            <a id='s2' x-next>NEXT</a>
          </x-app-view-do>
          done!
        </x-app-view>
      </x-app>`,
    })

    const router = page.body.querySelector('x-app')?.router

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-1')

    const next1 = page.body.querySelector('a#s1') as HTMLAnchorElement
    next1.click()

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-2')

    const back = page.body.querySelector('a#b2') as HTMLAnchorElement
    back.click()

    await page.waitForChanges()

    // expect(router!.location.pathname).toBe('/start/step-1')

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('hide if no router', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html:
      `<x-app-view>
        <x-app-view-do url="/go">
        </x-app-view-do>
      </x-app-view>
      `,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <x-app-view>
      <mock:shadow-root>
        <slot></slot>
        <slot name="content"></slot>
      </mock:shadow-root>
      <x-app-view-do hidden="" url="/go" >
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view-do>
    </x-app-view>
      `)

      const subject = page.body.querySelector('x-app-vew')
      subject?.remove()
  })

  it('hide if no parent', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html:
      `
      <x-app-view-do url="/go">
      </x-app-view-do>
      `,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-app-view-do hidden="" url="/go" >
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view-do>
      `)

    const subject = page.body.querySelector('x-app-view-do')
    subject?.remove()

  })

  it('renders remote content', async () => {

    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/test'    ,
    })

    page.win.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      status: 200,
      text: () => Promise.resolve(`<h1>HI WORLD!</h1>`)
    }))

    page.setContent( `
    <x-app>
      <x-app-view url="/">
        <x-app-view-do content-src="fake.html" url="/test">
        </x-app-view-do>
      </x-app-view>
    </x-app>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-app>
        <x-app-view class="active-route" url="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <x-app-view-do class="active-route active-route-exact" content-src="fake.html" url="/test">
            <mock:shadow-root>
              <slot></slot>
              <slot name="content"></slot>
            </mock:shadow-root>
            <div id="remote-content-fakehtml">
              <h1>
                HI WORLD!
              </h1>
            </div>
          </x-app-view-do>
        </x-app-view>
      </x-app>
      `)

    const subject = page.body.querySelector('x-app')
    subject?.remove()

  })
})
