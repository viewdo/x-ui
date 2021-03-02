jest.mock('./filter/jsonata.worker')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { DATA_EVENTS } from '../../services/data'
import { actionBus, eventBus } from '../../services/events'
import { ROUTE_EVENTS } from '../../services/routing'
import remoteData from './test/data.json'
import { XDataRepeat } from './x-data-repeat'

describe('x-data-repeat', () => {
  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
      html: `<x-data-repeat></x-data-repeat>`,
    })
    expect(page.root).toEqualHtml(`
      <x-data-repeat>
        <mock:shadow-root>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('render inline array', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
      html: `<x-data-repeat items="[1,2,3]">
              <template><b>{{data:item}}</b></template>
             </x-data-repeat>`,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items="[1,2,3]">
        <mock:shadow-root>
          <slot name="content"></slot>
        </mock:shadow-root>
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
        </div>
      </x-data-repeat>
    `)
    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('render scripted array', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
      html: `<x-data-repeat>
        <script type="text/json">
        ["dogs", "cats", "bears", "birds"]
        </script>
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>`,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat>
        <mock:shadow-root>
          <slot name="content"></slot>
        </mock:shadow-root>
        <script type="text/json">
        ["dogs", "cats", "bears", "birds"]
        </script>
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>dogs</b>
          <b>cats</b>
          <b>bears</b>
          <b>birds</b>
        </div>
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('render remote json', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve([1, 2, 3]),
      }),
    )

    await page.setContent(`<x-data-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="items.json">
        <mock:shadow-root>
          <slot name="content"></slot>
        </mock:shadow-root>
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
        </div>
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('renders and responds to changing data', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
    })

    page.win.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve([1, 2, 3]),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve([1, 2, 3, 4, 5]),
        }),
      )

    await page.setContent(`<x-data-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="items.json">
        <mock:shadow-root>
          <slot name="content"></slot>
        </mock:shadow-root>
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
        </div>
      </x-data-repeat>
    `)

    eventBus.emit(DATA_EVENTS.DataChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="items.json">
        <mock:shadow-root>
          <slot name="content"></slot>
        </mock:shadow-root>
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
          <b>4</b>
          <b>5</b>
        </div>
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('handles erroring remote data', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
    })

    page.win.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 404,
          json: () => Promise.resolve(null),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.reject('error'),
        }),
      )

    await page.setContent(`<x-data-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="items.json">
        <mock:shadow-root>
          <slot name="content"></slot>
        </mock:shadow-root>
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>
    `)

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="items.json">
        <mock:shadow-root>
          <slot name="content"></slot>
        </mock:shadow-root>
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('filter remote json', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(remoteData),
      }),
    )

    await page.setContent(`<x-data-repeat items-src="data.json" filter="[Account.Order.Product.SKU]">
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="data.json" filter="[Account.Order.Product.SKU]">
        <mock:shadow-root>
          <slot name="content"></slot>
        </mock:shadow-root>
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>0406654608</b>
          <b>0406634348</b>
          <b>040657863</b>
          <b>0406654603</b>
        </div>
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })
})
