jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { actionBus, eventBus } from '../../..';
import { XUI } from '../x-ui';

describe('x-ui', () => {
  it('renders hidden by default', async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()

    const page = await newSpecPage({
      components: [XUI],
      html: `<x-ui></x-ui>`,
    })
    expect(page.root).toEqualHtml(`
      <x-ui>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-ui>
    `)
  })

  it('renders with hash', async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()

    const page = await newSpecPage({
      components: [XUI],
      html: `<x-ui mode="hash"></x-ui>`,
    })
    expect(page.root).toEqualHtml(`
      <x-ui mode="hash">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-ui>
    `)
  })
})
