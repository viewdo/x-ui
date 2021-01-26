import { RafCallback, SpecPage } from '@stencil/core/internal'
import { newSpecPage } from '@stencil/core/testing'
import { MatchResults } from '../../../dist/types/services/routing/interfaces'
import { EventEmitter } from '../actions/event-emitter'
import { HistoryService } from './history'
import { HistoryType } from './interfaces'
import { RouterService } from './router'
import { MockHistory } from './__mocks__/history'

describe('route', () => {
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  let router: RouterService
  let page: SpecPage
  const writeTask: (func: RafCallback) => void = (_func) => {}

  const startPage = async (url: string = '') => {
    return await newSpecPage({
      components: [],
      html: `<div style="margin-top:1000px"><a name="test" href="/home"><h1>Test Header</h1></a></div>`,
      url: 'http://localhost' + url,
    })
  }

  beforeEach(async () => {
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })

  it('router-service -> create-route', async () => {
    page = await startPage('/')
    let match: MatchResults | null = null
    const history = new HistoryService(page.win, HistoryType.Browser, '', new MockHistory(page.win))

    router = new RouterService(page.win, writeTask, eventBus, actionBus, HistoryType.Browser, '', 'App', '', 0, history)

    let subject = router.createRoute(page.body, '/route', true, 'Page', null, 0, (m) => (match = m))

    expect(subject).not.toBeNull()
    expect(subject.match).toBeNull()

    subject.goToRoute('/route')

    await page.waitForChanges()

    subject.loadCompleted()

    subject.captureInnerLinks(page.body)
    await page.waitForChanges()
    let anchor = page.body.querySelector('a')

    expect(anchor?.getAttribute('x-attached-click')).not.toBeNull()

    anchor?.click()

    subject.destroy()

    // expect(match).not.toBeNull()
  })
})
