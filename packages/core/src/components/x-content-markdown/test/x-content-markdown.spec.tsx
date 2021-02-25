jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { actionBus, DATA_EVENTS, eventBus, InMemoryProvider } from '../../..';
import { addDataProvider } from '../../../services/data/providers/factory';
import { XContentMarkdown } from '../x-content-markdown';

describe('x-content-markdown', () => {

  let session: InMemoryProvider

  beforeEach(() => {
    session = new InMemoryProvider()
    addDataProvider('session', session)
  })

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })


  it('renders', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
      html: `<x-content-markdown></x-content-markdown>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <x-content-markdown hidden="">
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })

  it('renders markup from inline md', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.setContent(
      `<x-content-markdown>
        <script>
          # Hello
        </script>
       </x-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown>
        <script>
          # Hello
        </script>
        <div>
          <h1>
          Hello
          </h1>
        </div>
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })

  it('renders empty markup from inline md', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
      html:  `<x-content-markdown>
      <script>
      </script>
     </x-content-markdown>`
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown hidden="">
        <script>
        </script>
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })

  it('renders markup from remote', async () => {

    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      status: 200,
      text: () => Promise.resolve(`# HI WORLD! `)
    }))

    page.setContent(`<x-content-markdown src="fake.md"></x-content-markdown>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown src="fake.md">
        <div >
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()

  })

  it('handles erroring markup from remote', async () => {

    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      status: 200,
      text: () => Promise.reject('Error!')
    }))

    page.setContent(`<x-content-markdown src="fake.md"></x-content-markdown>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown hidden="" src="fake.md">
       </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()

  })

  it('handles http error in markup from remote', async () => {

    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      status: 400,
      text: () => Promise.resolve('Error!')
    }))

    page.setContent(`<x-content-markdown src="fake.md"></x-content-markdown>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown hidden="" src="fake.md">
       </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()

  })

  it('renders markup from remote, delayed', async () => {

    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      status: 200,
      text: () => Promise.resolve(`# HI WORLD! `)
    }))

    // @ts-ignore
    page.win.Prism = {
      highlightAllUnder: jest.fn().mockImplementation()
    }

    page.setContent(`<x-content-markdown no-render src="fake.md"></x-content-markdown>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown no-render hidden="" src="fake.md">
       </x-content-markdown>
    `)

    const md = page.body.querySelector('x-content-markdown')
    md?.removeAttribute('no-render')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown src="fake.md">
        <div >
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-markdown>
    `)

    md?.remove()

  })

  it('renders markup conditionally', async () => {

    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      status: 200,
      text: () => Promise.resolve(`# HI WORLD! `)
    }))

    await page.setContent(`<x-content-markdown render-if="false" src="fake.md"></x-content-markdown>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown render-if="false" hidden="" src="fake.md">
      </x-content-markdown>
    `)

    const md = page.body.querySelector('x-content-markdown')
    md?.setAttribute('render-if', 'true')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown render-if="true" src="fake.md">
        <div>
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-markdown>
    `)

    md?.remove()

  })

  it('renders markup conditionally, from data expression', async () => {

    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      status: 200,
      text: () => Promise.resolve(`# HI WORLD! `)
    }))

    await page.setContent(`<x-content-markdown render-if="{{session:render}}" src="fake.md"></x-content-markdown>`)

    expect(page.root).toEqualHtml(`
      <x-content-markdown render-if="{{session:render}}" hidden="" src="fake.md">
      </x-content-markdown>
    `)

    await session.set('render', 'true')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session'
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown render-if="{{session:render}}" src="fake.md">
        <div>
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()

  })

})
