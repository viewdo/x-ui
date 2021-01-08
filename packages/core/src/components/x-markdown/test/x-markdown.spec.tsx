import { newSpecPage } from '@stencil/core/testing'
import { XMarkdown } from '../x-markdown'

describe('x-markdown', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XMarkdown],
      html: `<x-markdown></x-markdown>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <x-markdown hidden="">
      </x-markdown>
    `)
  })

  it('renders markup from inline md', async () => {
    const page = await newSpecPage({
      components: [XMarkdown],
    })

    page.win.marked = (_data, _options) => {
      return '<h1>Hello</h1>'
    }

    page.setContent(
      `<x-markdown>
        <script># Hello</script>
       </x-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-markdown><script># Hello</script>
        <div>
          <h1>
          Hello
          </h1>
        </div>
      </x-markdown>
    `)
  })
})
