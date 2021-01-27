import { newSpecPage } from '@stencil/core/testing';
import { interfaceState } from '../../../services';
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

    interfaceState.muted = true

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-ui-audio>
        <input type="checkbox" checked="">
      </x-ui-audio>
    `);

    const control = page.body.querySelector('input')
    control!.checked = false
    control!.dispatchEvent(new Event('change'));

    expect(page.root).toEqualHtml(`
      <x-ui-audio>
        <input type="checkbox" >
      </x-ui-audio>
    `);

    page.body.querySelector('x-ui-audio')?.remove()
  });
});
