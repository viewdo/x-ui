import { newSpecPage } from '@stencil/core/testing';
import { XContentReference } from '../x-content-reference';

describe('x-content-reference', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `<x-content-reference inline></x-content-reference>`,
    })
    expect(page.root).toEqualHtml(`
      <x-content-reference inline>
      </x-content-reference>
    `)
  })

  it('renders inline script', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `<x-content-reference no-wait script-src="https://foo.js" inline></x-content-reference>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-content-reference no-wait script-src="https://foo.js" inline><script src="https://foo.js"></script>
      </x-content-reference>
    `)
  })

  it('renders inline styles', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `<x-content-reference no-wait style-src="https://foo.css" inline></x-content-reference>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-content-reference no-wait style-src="https://foo.css" inline><link href="https://foo.css" rel="stylesheet"/>
      </x-content-reference>
    `)
  })
})
