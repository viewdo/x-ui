jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { eventBus } from '../../..';
import { DATA_EVENTS } from '../../../services/data/interfaces';
import { addDataProvider } from '../../../services/data/providers/factory';
import { InMemoryProvider } from '../../../services/data/providers/memory';
import { XDataDisplay } from '../x-data-display';

describe('x-data-display', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    session = new InMemoryProvider()
    addDataProvider('session', session)
  })

  afterEach(() => {
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('renders simple strings', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display text="foo"></x-data-display>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-display text="foo">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <span class="dynamic">
          foo
        </span>
      </x-data-display>
    `)
    const subject = page.body.querySelector('x-data-display')
    subject?.remove()
  })

  it('renders child template', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display text="test">
              <template>
                <p>Hello Jason!</p>
              </template>
             </x-data-display>`,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display text="test">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <span class="dynamic">
          test
          <p>Hello Jason!</p>
        </span>
      </x-data-display>
    `)

    const subject = page.body.querySelector('x-data-display')
    subject?.remove()
  })


  it('renders inline data to child template', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display>
              <script type="application/json">
              { "name": "Forrest" }
              </script>
              <template>
                <p>Hello {{data:name}}!</p>
              </template>
             </x-data-display>`,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display>
       <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <span class="dynamic">
        <p>Hello Forrest!</p>
        </span>
      </x-data-display>
    `)

    const subject = page.body.querySelector('x-data-display')
    subject?.remove()
  })

  it('renders session data to child template', async () => {
    await session.set('name', 'Tom')
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display>
              <template>
                <p>Hello {{session:name}}!</p>
              </template>
             </x-data-display>`,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display>
       <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <span class="dynamic">
        <p>Hello Tom!</p>
        </span>
      </x-data-display>
    `)

    const subject = page.body.querySelector('x-data-display')
    subject?.remove()
  })

  it('renders session, responds when changes', async () => {
    await session.set('name', 'Tom')
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display>
              <template>
                <p>Hello {{session:name}}!</p>
              </template>
             </x-data-display>`,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display>
       <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <span class="dynamic">
        <p>Hello Tom!</p>
        </span>
      </x-data-display>
    `)

    await session.set('name', 'Tomy')
    eventBus.emit(DATA_EVENTS.DataChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-display>
       <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <span class="dynamic">
        <p>Hello Tomy!</p>
        </span>
      </x-data-display>
    `)

    const subject = page.body.querySelector('x-data-display')
    subject?.remove()
  })
})
