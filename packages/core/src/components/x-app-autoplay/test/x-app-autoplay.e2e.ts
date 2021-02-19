import { newE2EPage } from '@stencil/core/testing';

describe('x-app-autoplay', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-app-autoplay></x-app-autoplay>');

    const element = await page.find('x-app-autoplay');
    expect(element).toHaveClass('hydrated');
  });
});
