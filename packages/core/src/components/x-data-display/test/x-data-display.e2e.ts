jest.mock('../../../services/logging')

import { newE2EPage } from '@stencil/core/testing'

describe('x-data-value', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-data-value></x-data-value>')

    const element = await page.find('x-data-value')
    expect(element).toHaveClass('hydrated')
  })
})
