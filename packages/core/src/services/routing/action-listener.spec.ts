import { RafCallback } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../actions/event-emitter'
import { HistoryService } from './history'
import { HistoryType, ROUTE_COMMANDS, ROUTE_TOPIC } from './interfaces'
import { RouterService } from './router'
import { MockHistory } from './__mocks__/history'

describe('route-action-listener:', () => {
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
  it('navigate-to, navigate-next ', async () => {
    const page = await startPage('/')
    const subject = new RouterService(page.win, writeTask, eventBus, actionBus)

    actionBus.emit(ROUTE_TOPIC, {
      topic: ROUTE_TOPIC,
      command: ROUTE_COMMANDS.NavigateTo,
      data: {
        url: '/home',
      },
    })

    expect(subject.location.pathname).toBe('/home')

    actionBus.emit(ROUTE_TOPIC, {
      topic: ROUTE_TOPIC,
      command: ROUTE_COMMANDS.NavigateTo,
      data: {
        url: '/home/page1',
      },
    })

    expect(subject.location.pathname).toBe('/home/page1')

    actionBus.emit(ROUTE_TOPIC, {
      topic: ROUTE_TOPIC,
      command: ROUTE_COMMANDS.NavigateNext,
    })

    expect(subject.history.location.pathname).toBe('/home')
    expect(subject.location.pathname).toBe('/home')
  })

  it('navigate-back ', async () => {
    const page = await startPage('/')
    const history = new HistoryService(page.win, HistoryType.Browser, '', new MockHistory(page.win))
    const subject = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      HistoryType.Browser,
      '',
      '',
      '',
      0,
      history,
    )

    actionBus.emit(ROUTE_TOPIC, {
      topic: ROUTE_TOPIC,
      command: ROUTE_COMMANDS.NavigateTo,
      data: {
        url: '/page1',
      },
    })

    actionBus.emit(ROUTE_TOPIC, {
      topic: ROUTE_TOPIC,
      command: ROUTE_COMMANDS.NavigateTo,
      data: {
        url: '/page2',
      },
    })

    expect(subject.history.location.pathname).toBe('/page2')

    actionBus.emit(ROUTE_TOPIC, {
      topic: ROUTE_TOPIC,
      command: ROUTE_COMMANDS.NavigateBack,
    })

    // TODO: I can't find a way to mock the history back...
    // expect(subject.history.location.pathname).toBe('/page1')
  })
})
