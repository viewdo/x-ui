jest.mock('../../../services/logging')

import { newE2EPage } from '@stencil/core/testing'

describe('x-view', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-view></x-view>')

    const element = await page.find('x-view')
    expect(element).toHaveClass('hydrated')
  })
})
