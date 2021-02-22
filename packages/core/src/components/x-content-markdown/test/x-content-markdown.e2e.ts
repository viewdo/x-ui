import { newE2EPage } from '@stencil/core/testing';

describe('x-content-markdown', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent(`
    <x-content-markdown><script># Hello </script></x-content-markdown>
    `)

    const element = await page.find('x-content-markdown')
    expect(element).toHaveClass('hydrated')
  })
})
