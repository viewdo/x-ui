import { newE2EPage } from '@stencil/core/testing';

describe('dynamic-logo', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dynamic-logo></dynamic-logo>');

    const element = await page.find('dynamic-logo');
    expect(element).toHaveClass('hydrated');
  });
});
