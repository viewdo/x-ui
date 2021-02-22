import { newSpecPage } from '@stencil/core/testing';
import { XContentMarkdown } from '../x-content-markdown';

describe('x-content-markdown', () => {
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
  })

  it('renders markup from inline md', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
    })


    page.setContent(
      `<x-content-markdown>
        <script># Hello</script>
       </x-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown><script># Hello</script>
        <div>
          <h1>
          Hello
          </h1>
        </div>
      </x-content-markdown>
    `)
  })
})
