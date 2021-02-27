jest.mock('../../../services/common/logging')

import { newE2EPage } from '@stencil/core/testing';

describe('x-app-link', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-app-link></x-app-link>')

    const element = await page.find('x-app-link')
    expect(element).toHaveClass('hydrated')
  })
})
