jest.mock('../../../services/logging')

import { newE2EPage } from '@stencil/core/testing';

describe('x-app-view', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-app-view></x-app-view>')

    const element = await page.find('x-app-view')
    expect(element).toHaveClass('hydrated')
  })
})
