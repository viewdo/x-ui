jest.mock('../../../services/logging')

import { newE2EPage } from '@stencil/core/testing'

describe('x-link', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-link></x-link>')

    const element = await page.find('x-link')
    expect(element).toHaveClass('hydrated')
  })
})
