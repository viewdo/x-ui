import { newSpecPage } from '@stencil/core/testing';
import { videoState } from '../../..';
import { XUiAutoplay } from '../x-ui-autoplay';

describe('x-ui-autoplay', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XUiAutoplay],
      html: `<x-ui-autoplay></x-ui-autoplay>`,
    });
    expect(page.root).toEqualHtml(`
      <x-ui-autoplay>
        <input checked="" type="checkbox">
      </x-ui-autoplay>
    `);

    videoState.autoplay = true

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-ui-autoplay>
        <input type="checkbox" checked="">
      </x-ui-autoplay>
    `);

    const control = page.body.querySelector('input')
    control!.checked = false
    control!.dispatchEvent(new Event('change'));

    expect(page.root).toEqualHtml(`
      <x-ui-autoplay>
        <input type="checkbox" >
      </x-ui-autoplay>
    `);

    page.body.querySelector('x-ui-autoplay')?.remove()
  });
});
