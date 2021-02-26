import { RafCallback } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { EventEmitter } from '../actions/event-emitter';
import { RouterService } from '../routing/router';
import { NAVIGATION_COMMANDS, NAVIGATION_TOPIC } from './interfaces';

describe('route-actions:', () => {
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

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.GoTo,
      data: {
        url: '/home',
      },
    })

    expect(subject.location.pathname).toBe('/home')

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.GoTo,
      data: {
        url: '/home/page1',
      },
    })

    expect(subject.location.pathname).toBe('/home/page1')

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.GoNext,
    })

    expect(subject.history.location.pathname).toBe('/home')
    expect(subject.location.pathname).toBe('/home')
  })

  it('navigate-back ', async () => {
    const page = await startPage('/')
    const subject = new RouterService(page.win, writeTask, eventBus, actionBus, '', '', '', 0)

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.GoTo,
      data: {
        url: '/page1',
      },
    })

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.GoTo,
      data: {
        url: '/page2',
      },
    })

    expect(subject.history.location.pathname).toBe('/page2')

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.GoBack,
    })

    // TODO: I can't find a way to mock the history back...
    // expect(subject.history.location.pathname).toBe('/page1')
  })
})
