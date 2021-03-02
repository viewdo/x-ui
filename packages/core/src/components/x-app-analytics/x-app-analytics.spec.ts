jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { XAppViewDo } from '../x-app-view-do/x-app-view-do'
import { XAppView } from '../x-app-view/x-app-view'
import { XApp } from '../x-app/x-app'
import { XAppAnalytics } from './x-app-analytics'

describe('x-app-analytics', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo, XAppAnalytics],
      url: 'http://test/',
      html: `<x-app>
        <x-app-view url='/start'>
          <x-app-view-do url="step-1">
            <a id='s1' x-next>NEXT</a>
          </x-app-view-do>
          <x-app-view-do url="step-2">
            <a id='b2' x-back>BACK</a>
            <a id='s2' x-next>NEXT</a>
          </x-app-view-do>
          done!
        </x-app-view>
        <x-app-analytics>
        </x-app-analytics>
      </x-app>`,
    })

    const analytics = page.body.querySelector('x-app-analytics') as HTMLXAppAnalyticsElement

    const pageView = []
    //@ts-ignore
    analytics!.addEventListener('page-view', (e: CustomEvent<string>) => {
      pageView.push(e.detail)
    })

    const router = page.body.querySelector('x-app')?.router

    router?.goToRoute('/start')

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-1')

    expect(pageView.length).toBe(2)

    analytics.remove()

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })
})
