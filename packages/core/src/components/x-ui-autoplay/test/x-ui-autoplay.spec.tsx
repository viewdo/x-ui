import { newSpecPage } from '@stencil/core/testing';
import { XUiAutoplay } from '../x-ui-autoplay';

describe('x-ui-autoplay', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XUiAutoplay],
      html: `<x-ui-autoplay></x-ui-autoplay>`,
    });
    expect(page.root).toEqualHtml(`
      <x-ui-autoplay>
        <input type="checkbox">
      </x-ui-autoplay>
    `);
  });
});
