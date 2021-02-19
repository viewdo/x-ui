import { newSpecPage } from '@stencil/core/testing';
import { XAppAnalytics } from '../x-app-analytics';

describe('x-app-analytics', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XAppAnalytics],
      html: `<x-app-analytics></x-app-analytics>`,
      supportsShadowDom: false
    });
    expect(page.root).toEqualHtml(`
      <x-app-analytics>
      </x-app-analytics>
    `);
  });
});
