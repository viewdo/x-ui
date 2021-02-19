import { newE2EPage } from '@stencil/core/testing';

describe('x-app', () => {
  it('renders', async () => {
    const page = await newE2EPage()

    await page.setContent('<x-app></x-app>')
    const element = await page.find('x-app')
    expect(element).toHaveClass('hydrated')
  })
})
