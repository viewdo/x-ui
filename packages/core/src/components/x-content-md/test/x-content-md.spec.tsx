import { newSpecPage } from '@stencil/core/testing';
import { XContentMD } from '../x-content-md';

describe('x-content-md', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XContentMD],
      html: `<x-content-md></x-content-md>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <x-content-md hidden="">
      </x-content-md>
    `)
  })

  it('renders markup from inline md', async () => {
    const page = await newSpecPage({
      components: [XContentMD],
    })


    page.setContent(
      `<x-content-md>
        <script># Hello</script>
       </x-content-md>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-md><script># Hello</script>
        <div>
          <h1>
          Hello
          </h1>
        </div>
      </x-content-md>
    `)
  })
})
