import { newSpecPage } from '@stencil/core/testing';
import { DynamicLogo } from '../x-logo';

describe('dynamic-logo', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DynamicLogo],
      html: `<dynamic-logo></dynamic-logo>`,
    });
    expect(page.root).toEqualHtml(`
      <dynamic-logo>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dynamic-logo>
    `);
  });
});
