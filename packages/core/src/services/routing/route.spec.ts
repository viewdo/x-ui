import { RafCallback, SpecPage } from '@stencil/core/internal'
import { newSpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../actions/event-emitter'
import { HistoryService } from './history'
import { HistoryType, MatchResults } from './interfaces'
import { Route } from './route'
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

  it('normalizeChildUrl', async () => {
    page = await startPage('/')
    router = new RouterService(page.win, writeTask, eventBus, actionBus)
    let subject = new Route(router, page.body, '/route')

    let normalized = subject.normalizeChildUrl('child')
    expect(normalized).toBe('/route/child')

    normalized = subject.normalizeChildUrl('/child')
    expect(normalized).toBe('/route/child')

    normalized = subject.normalizeChildUrl('child')
    expect(normalized).toBe('/route/child')

    normalized = subject.normalizeChildUrl('//child')
    expect(normalized).toBe('/route/child')

    normalized = subject.normalizeChildUrl('//child/')
    expect(normalized).toBe('/route/child')

    normalized = subject.normalizeChildUrl('child/')
    expect(normalized).toBe('/route/child')
  })

  it('adjustPageTitle', async () => {
    page = await startPage('/')
    router = new RouterService(page.win, writeTask, eventBus, actionBus, HistoryType.Browser, '', 'App')
    let subject = router.createRoute(page.body, '/route', true, 'Page', null, 0, () => {})

    subject.adjustTitle()

    await page.waitForChanges()

    expect(page.doc.title).toBe('Page | App')
  })

  it('adjustPageTitle - dynamic', async () => {
    page = await startPage('/route/Widget')
    router = new RouterService(page.win, writeTask, eventBus, actionBus, HistoryType.Browser, '', 'App')
    let subject = router.createRoute(page.body, '/route/:product', true, '{route:product}', null, 0, () => {})

    subject.adjustTitle()

    await page.waitForChanges()

    expect(page.doc.title).toBe('Widget | App')
  })

  it('adjustPageTitle - no page', async () => {
    page = await startPage('/route')
    router = new RouterService(page.win, writeTask, eventBus, actionBus, HistoryType.Browser, '', 'App')
    let subject = new Route(router, page.body, '/route')

    subject.adjustTitle()

    await page.waitForChanges()

    expect(page.doc.title).toBe('App')
  })

  it('loadComplete - match', async () => {
    page = await startPage('/route')
    router = new RouterService(page.win, writeTask, eventBus, actionBus, HistoryType.Browser, '', 'App')
    let subject = new Route(router, page.body, '/route')

    subject.match = {
      path: '/route',
      isExact: true,
      params: {},
      url: '/route',
    }

    subject.loadCompleted()

    expect(page.doc.title).toBe('App')
  })

  it('loadComplete - hash match', async () => {
    page = await startPage('/#/route')
    router = new RouterService(page.win, writeTask, eventBus, actionBus, HistoryType.Hash, '', 'App')
    let subject = new Route(router, page.body, '/route', true, 'Page', null, 10)

    subject.match = {
      path: '/route',
      isExact: true,
      params: {},
      url: '/route',
    }

    subject.loadCompleted()

    expect(page.doc.title).toBe('Page | App')
  })

  it('loadComplete - scroll-top', async () => {
    page = await startPage('/route')
    page.doc.title = 'Neat!'
    router = new RouterService(page.win, writeTask, eventBus, actionBus)
    let subject = new Route(router, page.body, '/route', true, 'Page', null, 10)

    subject.match = {
      path: '/route',
      isExact: true,
      params: {},
      url: '/route',
    }

    subject.loadCompleted()

    expect(page.doc.title).toBe('Page | Neat!')
  })

  it('captureInnerLinks', async () => {
    page = await startPage('/')
    router = new RouterService(page.win, writeTask, eventBus, actionBus)
    let subject = new Route(router, page.body, '/route')

    subject.captureInnerLinks()

    let anchor = page.body.querySelector('a')

    expect(anchor?.getAttribute('x-attached-click')).not.toBeNull()

    anchor?.click()

    subject.destroy()
  })
})
