jest.mock('../../../services/logging')
import { newE2EPage } from '@stencil/core/testing';

describe('x-app-view-do', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-app-view-do></x-app-view-do>')

    const element = await page.find('x-app-view-do')
    expect(element).toHaveClass('hydrated')
  })
})
