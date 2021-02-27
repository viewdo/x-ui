jest.mock('../../../services/common/logging')

import { newE2EPage } from '@stencil/core/testing'

describe('x-data-provider-cookie', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-data-provider-cookie></x-data-provider-cookie>')

    const element = await page.find('x-data-provider-cookie')
    expect(element).toHaveClass('hydrated')
  })
})
