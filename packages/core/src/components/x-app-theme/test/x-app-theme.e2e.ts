import { newE2EPage } from '@stencil/core/testing';

describe('x-app-theme', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-app-theme></x-app-theme>');

    const element = await page.find('x-app-theme');
    expect(element).toHaveClass('hydrated');
  });
});
