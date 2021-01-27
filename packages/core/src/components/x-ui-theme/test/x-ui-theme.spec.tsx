/* istanbul ignore file */

import { newSpecPage } from '@stencil/core/testing';
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
  });
});
