import { newE2EPage } from '@stencil/core/testing'

describe('x-content-reference', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-content-reference inline></x-content-reference>')

    const element = await page.find('x-content-reference')
    expect(element).toHaveClass('hydrated')
  })
})
