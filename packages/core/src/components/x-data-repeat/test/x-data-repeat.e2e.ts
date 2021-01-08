import { newE2EPage } from '@stencil/core/testing'

describe('x-data-repeat', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-data-repeat></x-data-repeat>')

    const element = await page.find('x-data-repeat')
    expect(element).toHaveClass('hydrated')
  })
})
