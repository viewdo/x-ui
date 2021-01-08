import { newE2EPage } from '@stencil/core/testing'

describe('x-data-show', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<x-data-show></x-data-show>')

    const element = await page.find('x-data-show')
    expect(element).toHaveClass('hydrated')
  })
})
