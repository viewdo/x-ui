import { newE2EPage } from '@stencil/core/testing'

describe('audio-player', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<audio-player></audio-player>')

    const element = await page.find('audio-player')
    expect(element).toHaveClass('hydrated')
  })
})
