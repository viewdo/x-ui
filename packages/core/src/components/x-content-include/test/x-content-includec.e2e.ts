jest.mock('../../../services/common/logging')

import { newE2EPage } from '@stencil/core/testing'

describe('x-content-include', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-content-include></x-content-include>')

    const element = await page.find('x-content-include')
    expect(element).toHaveClass('hydrated')
  })
})
