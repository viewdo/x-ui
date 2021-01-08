jest.mock('../../../services/logging')
import { newE2EPage } from '@stencil/core/testing'

describe('x-view-do', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-view-do></x-view-do>')

    const element = await page.find('x-view-do')
    expect(element).toHaveClass('hydrated')
  })
})
