import { newE2EPage } from '@stencil/core/testing';

describe('x-audio-enabled', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-audio-enabled></x-audio-enabled>');

    const element = await page.find('x-audio-enabled');
    expect(element).toHaveClass('hydrated');
  });
});
