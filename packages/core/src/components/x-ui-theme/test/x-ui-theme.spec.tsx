/* istanbul ignore file */

import { newSpecPage } from '@stencil/core/testing';
import { interfaceState } from '../../../services';
import { XUiTheme } from '../x-ui-theme';

describe('x-ui-theme', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XUiTheme],
      html: `<x-ui-theme></x-ui-theme>`,
    });
    expect(page.root).toEqualHtml(`
      <x-ui-theme>
        <mock:shadow-root>
          <label class="switch" id="switch">
            <input aria-label="Change Theme" checked="" id="slider" type="checkbox">
            <span class="round slider"></span>
          </label>
        </mock:shadow-root>
      </x-ui-theme>
    `);

    interfaceState.theme = 'dark'

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-ui-theme>
        <mock:shadow-root>
          <label class="switch" id="switch">
            <input aria-label="Change Theme" id="slider" type="checkbox">
            <span class="round slider"></span>
          </label>
        </mock:shadow-root>
      </x-ui-theme>
    `);

    expect(page.body.classList.contains('dark')).toBe(true)

    const control = page.body.querySelector('x-ui-theme')
    const input =  control?.shadowRoot?.querySelector('input')
    input!.checked = true
    input!.dispatchEvent(new Event('change'));

    expect(page.root).toEqualHtml(`
     <x-ui-theme>
        <mock:shadow-root>
          <label class="switch" id="switch">
            <input aria-label="Change Theme" id="slider" checked="" type="checkbox">
            <span class="round slider"></span>
          </label>
        </mock:shadow-root>
      </x-ui-theme>
    `);

    page.body.querySelector('x-ui-autoplay')?.remove()
  });


});
