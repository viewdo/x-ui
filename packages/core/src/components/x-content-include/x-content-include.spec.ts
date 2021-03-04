jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { addDataProvider, clearDataProviders } from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import { actionBus, eventBus } from '../../services/events'
import { XContentInclude } from './x-content-include'

describe('x-content-include', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    session = new InMemoryProvider()
    addDataProvider('session', session)
  })

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
    clearDataProviders()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XContentInclude],
      html: `<x-content-include></x-content-include>`,
    })
    expect(page.root).toEqualHtml(`
      <x-content-include hidden="">
      </x-content-include>
    `)
  })

  it('renders html from remote', async () => {
    const page = await newSpecPage({
      components: [XContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    page.setContent(`<x-content-include src="fake.html"></x-content-include>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-include src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-include>
    `)

    const subject = page.body.querySelector('x-content-include')
    subject?.remove()
  })

  it('handles erroring html from remote', async () => {
    const page = await newSpecPage({
      components: [XContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.reject('Error!'),
      }),
    )

    page.setContent(`<x-content-include src="fake.html"></x-content-include>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-include hidden="" src="fake.html">
       </x-content-include>
    `)

    const subject = page.body.querySelector('x-content-include')
    subject?.remove()
  })

  it('handles http error in html from remote', async () => {
    const page = await newSpecPage({
      components: [XContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 400,
        text: () => Promise.resolve('Error!'),
      }),
    )

    page.setContent(`<x-content-include src="fake.html"></x-content-include>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-include hidden="" src="fake.html">
       </x-content-include>
    `)

    const subject = page.body.querySelector('x-content-include')
    subject?.remove()
  })

  it('renders html from remote, delayed', async () => {
    const page = await newSpecPage({
      components: [XContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    // @ts-ignore
    page.win.Prism = {
      highlightAllUnder: jest.fn().mockImplementation(),
    }

    page.setContent(`<x-content-include defer-load src="fake.html"></x-content-include>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-include defer-load hidden="" src="fake.html">
       </x-content-include>
    `)

    const html = page.body.querySelector('x-content-include')
    html?.removeAttribute('defer-load')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-include src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-include>
    `)

    html?.remove()
  })

  it('renders html conditionally', async () => {
    const page = await newSpecPage({
      components: [XContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    await page.setContent(`<x-content-include when="false" src="fake.html"></x-content-include>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-include when="false" hidden="" src="fake.html">
      </x-content-include>
    `)

    const html = page.body.querySelector('x-content-include')
    html?.setAttribute('when', 'true')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-include when="true" src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-include>
    `)

    html?.remove()
  })

  it('renders html conditionally, from data expression', async () => {
    const page = await newSpecPage({
      components: [XContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    await page.setContent(`<x-content-include when="{{session:render}}" src="fake.html"></x-content-include>`)

    expect(page.root).toEqualHtml(`
      <x-content-include when="{{session:render}}" hidden="" src="fake.html">
      </x-content-include>
    `)

    await session.set('render', 'true')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-include when="{{session:render}}" src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-include>
    `)

    const subject = page.body.querySelector('x-content-include')
    subject?.remove()
  })

  it('renders tokens in remote data', async () => {
    const page = await newSpecPage({
      components: [XContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI {{session:name?FRIEND}}!</h1> `),
      }),
    )

    await page.setContent(`<x-content-include src="fake.html"></x-content-include>`)

    expect(page.root).toEqualHtml(`
      <x-content-include src="fake.html">
        <div class="remote-content">
          <h1>
            HI FRIEND!
          </h1>
        </div>
      </x-content-include>
    `)

    await session.set('name', 'MAX')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-include src="fake.html">
        <div class="remote-content">
          <h1>
          HI MAX!
          </h1>
        </div>
      </x-content-include>
    `)

    const subject = page.body.querySelector('x-content-include')
    subject?.remove()
  })
})
