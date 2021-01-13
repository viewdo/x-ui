import { newSpecPage } from '@stencil/core/testing';
import { XUse } from '../x-use';

describe('x-use', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XUse],
      html: `<x-use inline></x-use>`,
    })
    expect(page.root).toEqualHtml(`
      <x-use inline>
      </x-use>
    `)
  })

  it('renders inline script', async () => {
    const page = await newSpecPage({
      components: [XUse],
      html: `<x-use no-wait script-src="https://foo.js" inline></x-use>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-use no-wait script-src="https://foo.js" inline><script src="https://foo.js"></script>
      </x-use>
    `)
  })

  it('renders inline styles', async () => {
    const page = await newSpecPage({
      components: [XUse],
      html: `<x-use no-wait style-src="https://foo.css" inline></x-use>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-use no-wait style-src="https://foo.css" inline><link href="https://foo.css" rel="stylesheet"/>
      </x-use>
    `)
  })
})
