import { newSpecPage } from '@stencil/core/testing'
import { DXPDataProvider } from '../dxp-data-provider'

describe('dxp-data-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DXPDataProvider],
      html: `<dxp-data-provider></dxp-data-provider>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <dxp-data-provider>
      </dxp-data-provider>
    `)
  })
})
