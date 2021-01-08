jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing'
import { XDataShow } from '../x-data-show'

describe('x-data-show', () => {
  it('renders hidden by default', async () => {
    const page = await newSpecPage({
      components: [XDataShow],
      html: `<x-data-show when="false"><p>Hide Me</p></x-data-show>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <x-data-show when="false" hidden="">
        <p>
          Hide Me
        </p>
      </x-data-show>
    `)
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataShow],
      html: `<x-data-show when="true"><p>Show Me</p></x-data-show>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <x-data-show when="true">
        <p>
          Show Me
        </p>
      </x-data-show>
    `)
  })
})
