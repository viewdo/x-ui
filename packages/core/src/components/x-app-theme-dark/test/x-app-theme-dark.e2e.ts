import { newE2EPage } from '@stencil/core/testing';

describe('x-app-theme-dark', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-app-theme-dark></x-app-theme-dark>');

    const element = await page.find('x-app-theme-dark');
    expect(element).toHaveClass('hydrated');
  });
});
