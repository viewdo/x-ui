import { newE2EPage } from '@stencil/core/testing';

describe('x-content-md', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent(`
    <x-content-md><script># Hello </script></x-content-md>
    `)

    const element = await page.find('x-content-md')
    expect(element).toHaveClass('hydrated')
  })
})
