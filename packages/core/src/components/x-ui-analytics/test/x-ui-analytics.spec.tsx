import { newSpecPage } from '@stencil/core/testing';
import { XUiAnalytics } from '../x-ui-analytics';

describe('x-ui-analytics', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XUiAnalytics],
      html: `<x-ui-analytics></x-ui-analytics>`,
      supportsShadowDom: false
    });
    expect(page.root).toEqualHtml(`
      <x-ui-analytics>
      </x-ui-analytics>
    `);
  });
});
