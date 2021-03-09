jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { actionBus, eventBus } from '../../services/events'
import { XActionActivator } from '../x-action-activator/x-action-activator'
import { XAction } from '../x-action/x-action'
import { XApp } from '../x-app/x-app'
import { XAppView } from './x-app-view'

describe('x-app-view', () => {
  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView],
      html: `<x-app >
        <x-app-view url='/'>
        </x-app-view>
       </x-app>`,
      autoApplyChanges: true,
    })

    expect(page.root).toEqualHtml(`
      <x-app>
        <x-app-view class="active-route active-route-exact" url="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-app-view>
      </x-app>
    `)

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('renders remote content', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView],
      url: 'http://test/test',
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1>`),
      }),
    )

    page.setContent(`
    <x-app>
      <x-app-view content-src="fake.html" url="/test">
      </x-app-view>
    </x-app>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <x-app>
      <x-app-view class="active-route active-route-exact" content-src="fake.html" url="/test">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <div id="remote-content-fakehtml">
          <h1>
            HI WORLD!
          </h1>
        </div>
      </x-app-view>
    </x-app>
      `)

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('removes remote content after navigation', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView],
      url: 'http://test/test',
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1>`),
      }),
    )

    page.setContent(`
    <x-app>
      <x-app-view content-src="fake.html" url="/test">
      </x-app-view>
      <x-app-view url="/bye">
        <h1>Hi</h1>
      </x-app-view>
    </x-app>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <x-app>
      <x-app-view class="active-route active-route-exact" content-src="fake.html" url="/test">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <div id="remote-content-fakehtml">
          <h1>
            HI WORLD!
          </h1>
        </div>
      </x-app-view>
      <x-app-view url="/bye">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <h1>Hi</h1>
      </x-app-view>
    </x-app>
      `)

    const router = page.body.querySelector('x-app')?.router

    router!.goToRoute('/bye')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <x-app>
      <x-app-view  content-src="fake.html" url="/test">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view>
      <x-app-view class="active-route active-route-exact" url="/bye">
         <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <h1>Hi</h1>
      </x-app-view>
    </x-app>
      `)

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('activates own actions, only', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XActionActivator, XAction],
      url: 'http://test/',
      html: `
    <x-app>
      <x-app-view url="/">
        <x-app-view url="lev-1">
          <x-app-view url="lev-2">
            <x-action-activator activate="OnEnter">
              <x-action topic="test" command="doit" data-data="level-3">
              </x-action>
            </x-action-activator>
          </x-app-view>
          <x-action-activator activate="OnEnter">
            <x-action topic="test" command="doit" data-data="level-2">
          </x-action>
        </x-action-activator>
        </x-app-view>
        <x-action-activator activate="OnEnter">
          <x-action topic="test" command="doit" data-data="level-1">
          </x-action>
        </x-action-activator>
      </x-app-view>
    </x-app>
    `,
      autoApplyChanges: true,
    })

    const views = page.body.querySelectorAll('x-app-view')

    const root = views[0]
    let children = await root.getChildren()

    expect(children.activators.length).toBe(1)
    expect(children.views.length).toBe(1)
    expect(children.dos.length).toBe(0)

    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'fake',
    })

    const lev1 = views[1]
    children = await lev1.getChildren()

    expect(children.activators.length).toBe(1)
    expect(children.views.length).toBe(1)
    expect(children.dos.length).toBe(0)

    const lev2 = views[2]
    children = await lev2.getChildren()

    expect(children.activators.length).toBe(1)
    expect(children.views.length).toBe(0)
    expect(children.dos.length).toBe(0)

    views.forEach(e => e.remove())
    page.body.querySelector('x-app')!.remove()
  })
})
