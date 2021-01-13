import { newSpecPage } from '@stencil/core/testing';
import { XUiAudio } from '../x-ui-audio';

describe('x-ui-audio', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XUiAudio],
      html: `<x-ui-audio></x-ui-audio>`,
    });
    expect(page.root).toEqualHtml(`
      <x-ui-audio>
        <input type="checkbox">
      </x-ui-audio>
    `);
  });
});
