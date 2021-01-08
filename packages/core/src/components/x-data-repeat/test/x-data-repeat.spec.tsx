import { newSpecPage } from '@stencil/core/testing'
import { XDataRepeat } from '../x-data-repeat'

describe('x-data-repeat', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
      html: `<x-data-repeat></x-data-repeat>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <x-data-repeat>
      </x-data-repeat>
    `)
  })

  it('render inline array', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
      html: `<x-data-repeat items="[1,2,3]">
              <template><b>{data:item}</b></template>
             </x-data-repeat>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <x-data-repeat innerHTML="<b>1</b><b>2</b><b>3</b>" items="[1,2,3]">
        <b>1</b>
        <b>2</b>
        <b>3</b>
      </x-data-repeat>
    `)
  })
})
