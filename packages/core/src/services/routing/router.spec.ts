import { newSpecPage } from '@stencil/core/testing'
import { RafCallback } from '../../../../plugins/x-ionic/dist/types/stencil-public-runtime'
import { EventEmitter } from '../actions/event-emitter'
import { HistoryType } from './interfaces'
import { RouterService } from './router'

describe('router', () => {
  let actionBus: EventEmitter
  let eventBus: EventEmitter
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

  const testNormalize = (subject: RouterService) => {
    let normalized = subject.normalizeChildUrl('child', 'parent')
    expect(normalized).toBe('/parent/child')

    normalized = subject.normalizeChildUrl('/child', 'parent')
    expect(normalized).toBe('/parent/child')

    normalized = subject.normalizeChildUrl('child', '/parent')
    expect(normalized).toBe('/parent/child')

    normalized = subject.normalizeChildUrl('//child', '//parent')
    expect(normalized).toBe('/parent/child')

    normalized = subject.normalizeChildUrl('//child/', '//parent')
    expect(normalized).toBe('/parent/child')

    normalized = subject.normalizeChildUrl('child/', 'parent/')
    expect(normalized).toBe('/parent/child')
  }

  const testGoToPath = (subject: RouterService) => {
    subject.goToRoute('/home')
    expect(subject.location.pathname).toBe('/home')

    subject.goToRoute('home')
    expect(subject.location.pathname).toBe('/home')

    subject.goToRoute('home/page1')
    expect(subject.location.pathname).toBe('/home/page1')

    subject.goToParentRoute()
    expect(subject.location.pathname).toBe('/home')
  }

  const testMatch = (subject: RouterService) => {
    subject.goToRoute('home')

    let match = subject.matchPath({
      path: '/home',
      strict: true,
      exact: true,
    })

    expect(match).not.toBeNull()
    expect(match!.isExact).toBe(true)
    expect(match!.path).toBe('/home')
    expect(match!.url).toBe('/home')

    match = subject.matchPath({
      path: '/about',
    })

    expect(match).toBeNull()
  }

  it('initialized: browser | blank path/', async () => {
    const page = await startPage()
    const subject = new RouterService(page.win, writeTask, eventBus, actionBus)

    expect(subject.location.pathname).toBe('/')

    testGoToPath(subject)
    testNormalize(subject)
    testMatch(subject)
  })

  it('initialized: hash', async () => {
    const page = await startPage()
    const subject = new RouterService(page.win, writeTask, eventBus, actionBus, HistoryType.Hash)

    expect(subject.location.pathname).toBe('/')

    testGoToPath(subject)
    testNormalize(subject)
    testMatch(subject)
  })

  it('initialized: browser | path = /home', async () => {
    const page = await startPage('/home')
    const subject = new RouterService(page.win, writeTask, eventBus, actionBus)

    expect(subject.location.pathname).toBe('/home')

    testGoToPath(subject)
    testNormalize(subject)
    testMatch(subject)
  })

  it('initialized: hash | path = /#/home', async () => {
    const page = await startPage('/#/home')
    const subject = new RouterService(page.win, writeTask, eventBus, actionBus, HistoryType.Hash)

    expect(subject.location.pathname).toBe('/home')
    expect(page.win.location.pathname).toBe('/')
    expect(page.win.location.hash).toBe('#/home')

    testGoToPath(subject)
    testNormalize(subject)
    testMatch(subject)
  })

  it('match-path: browser | path = /item/:item ', async () => {
    const page = await startPage('/item/food')
    const subject = new RouterService(page.win, writeTask, eventBus, actionBus)

    expect(subject.location.pathname).toBe('/item/food')

    let results = subject.matchPath({
      path: '/item/:item',
    })

    expect(results).not.toBeNull()
    expect(results?.params.item).not.toBeNull()
    expect(results?.params.item).toBe('food')
  })

  it('match-path: hash | path = /#/item/:item ', async () => {
    const page = await startPage('/#/item/food')
    const subject = new RouterService(page.win, writeTask, eventBus, actionBus, HistoryType.Hash)

    expect(subject.location.pathname).toBe('/item/food')

    let results = subject.matchPath({
      path: '/item/:item',
    })

    expect(results).not.toBeNull()
    expect(results?.params.item).not.toBeNull()
    expect(results?.params.item).toBe('food')
  })

  it('router-service: scrollTop ', async () => {
    const page = await startPage('/')
    const subject = new RouterService(page.win, writeTask, eventBus, actionBus)

    let didScroll = false

    page.win.onscroll = () => {
      didScroll = true
    }

    subject.viewsUpdated({
      scrollTopOffset: 10,
      scrollToId: 'test',
    })

    subject.scrollTo(0)

    // TODO: We need a way to detect page scrolls in this mock object
    // expect(didScroll).toBe(true)
  })

  it('router-service: captureInnerLinks ', async () => {
    const page = await startPage('/')
    const subject = new RouterService(page.win, writeTask, eventBus, actionBus)

    subject.captureInnerLinks(page.body)
    await page.waitForChanges()
    let anchor = page.body.querySelector('a')

    expect(anchor?.getAttribute('x-attached-click')).not.toBeNull()

    anchor?.click()

    subject.destroy()
  })
})
