jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing';
import { actionBus, eventBus } from '../../..';
import { XDataProviderCookie } from '../x-data-provider-cookie';

describe('x-data-provider-cookie', () => {
  beforeAll(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataProviderCookie],
      html: `<x-data-provider-cookie></x-data-provider-cookie>`,
      supportsShadowDom: false
    })
    // expect(page.root).toEqualHtml(`<x-data-provider-cookie></x-data-provider-cookie>`)
  })
})
