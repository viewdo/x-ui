import { newE2EPage } from '@stencil/core/testing';

describe('x-ui-autoplay', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-ui-autoplay></x-ui-autoplay>');

    const element = await page.find('x-ui-autoplay');
    expect(element).toHaveClass('hydrated');
  });
});
