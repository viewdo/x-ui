import { newE2EPage } from '@stencil/core/testing';

describe('x-ui-audio', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-ui-audio></x-ui-audio>');

    const element = await page.find('x-ui-audio');
    expect(element).toHaveClass('hydrated');
  });
});
