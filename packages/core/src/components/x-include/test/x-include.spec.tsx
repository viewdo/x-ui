jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing'
import { XInclude } from '../x-include'

describe('x-include', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XInclude],
      html: `<x-include></x-include>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <x-include hidden=""></x-include>
    `)
  })
})
