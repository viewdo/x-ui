import { newSpecPage } from '@stencil/core/testing';
import { actionBus, eventBus } from '../../..';
import { XDataRepeat } from '../x-data-repeat';

describe('x-data-repeat', () => {

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
      html: `<x-data-repeat></x-data-repeat>`
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
             </x-data-repeat>`
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
      html:
      `<x-data-repeat>
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

    page.win.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve([1,2,3])
    }))

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
})
