import { newE2EPage } from '@stencil/core/testing'

describe('x-use', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-use inline></x-use>')

    const element = await page.find('x-use')
    expect(element).toHaveClass('hydrated')
  })
})
