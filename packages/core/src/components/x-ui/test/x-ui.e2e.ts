import { newE2EPage } from '@stencil/core/testing'

describe('x-ui', () => {
  it('renders', async () => {
    const page = await newE2EPage()

    await page.setContent('<x-ui></x-ui>')
    const element = await page.find('x-ui')
    expect(element).toHaveClass('hydrated')
  })
})
