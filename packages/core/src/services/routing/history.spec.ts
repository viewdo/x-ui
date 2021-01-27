import { newSpecPage } from '@stencil/core/testing'
import { HistoryService } from './history'
import { HistoryType, LocationSegments } from './interfaces'
import { MockHistory } from './__mocks__/history'

describe('history-service', () => {
  const startPage = async (url: string = '') => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
      url: 'http://localhost' + url,
    })

    return page
  }

  beforeEach(async () => {})

  it('initialize: browser / ', async () => {
    const page = await startPage()
    const history = new MockHistory(page.win)
    const subject = new HistoryService(page.win, HistoryType.Browser, '', history)
    expect(subject.location).not.toBeNull()
    expect(subject.location.pathname).toBe('/')
  })

  it('initialize: browser /home ', async () => {
    const page = await startPage('/home')
    const history = new MockHistory(page.win)
    const subject = new HistoryService(page.win, HistoryType.Browser, '', history)
    expect(subject.location).not.toBeNull()
    expect(subject.location.pathname).toBe('/home')
  })

  it('initialize: browser @base/home ', async () => {
    const page = await startPage('@base/home')
    const history = new MockHistory(page.win)
    const subject = new HistoryService(page.win, HistoryType.Browser, '/@base', history)
    expect(subject.location).not.toBeNull()
    expect(subject.location.pathname).toBe('/home')

    let currentLocation: LocationSegments
    subject.listen((location) => {
      currentLocation = location
    })
    expect(currentLocation!).toBe(subject.location)

    expect(subject.listeners.length).toBe(1)
    expect(subject.length).toBe(1)

    let href = subject.createHref(subject.location)
    expect(href).toBe('/@base/home')

    subject.push('/about')
    expect(subject.location.pathname).toBe('/about')
    expect(currentLocation!.pathname).toBe('/about')

    expect(subject.length).toBe(2)

    subject.replace('/replaced')
    expect(subject.location.pathname).toBe('/replaced')
    expect(currentLocation!.pathname).toBe('/replaced')

    expect(subject.length).toBe(2)
  })

  it('initialize: hash @base/home ', async () => {
    const page = await startPage('/@base')
    const history = new MockHistory(page.win)
    const subject = new HistoryService(page.win, HistoryType.Hash, '/@base', history)
    expect(subject.location).not.toBeNull()
    expect(subject.location.pathname).toBe('/')

    let currentLocation: LocationSegments
    subject.listen((location) => {
      currentLocation = location
    })
    expect(currentLocation!).toBe(subject.location)

    expect(subject.listeners.length).toBe(1)

    let href = subject.createHref(subject.location)
    expect(href).toBe('/@base/#/')

    subject.push('/home')
    expect(subject.location.pathname).toBe('/home')
    expect(currentLocation!.pathname).toBe('/home')
    href = subject.createHref(subject.location)
    expect(href).toBe('/@base/#/home')

    subject.replace('/replaced')
    expect(subject.location.pathname).toBe('/replaced')
    expect(currentLocation!.pathname).toBe('/replaced')

    href = subject.createHref(subject.location)
    expect(href).toBe('/@base/#/replaced')
  })
})
