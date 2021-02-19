jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { actionBus, eventBus } from '../../..';
import { XApp } from '../x-app';

describe('x-app', () => {
  it('renders hidden by default', async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()

    const page = await newSpecPage({
      components: [XApp],
      html: `<x-app></x-app>`,
    })
    expect(page.root).toEqualHtml(`
      <x-app>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-app>
    `)
  })

  it('renders with hash', async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()

    const page = await newSpecPage({
      components: [XApp],
      html: `<x-app mode="hash"></x-app>`,
    })
    expect(page.root).toEqualHtml(`
      <x-app mode="hash">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-app>
    `)
  })
})
