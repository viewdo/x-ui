import { newE2EPage } from '@stencil/core/testing';

describe('x-ui-theme', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-ui-theme></x-ui-theme>');

    const element = await page.find('x-ui-theme');
    expect(element).toHaveClass('hydrated');
  });
});
