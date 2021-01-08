jest.mock('../../../services/logging')

import { newE2EPage } from '@stencil/core/testing'

describe('x-include', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-include></x-include>')

    const element = await page.find('x-include')
    expect(element).toHaveClass('hydrated')
  })
})
