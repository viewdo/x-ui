import { newSpecPage } from '@stencil/core/testing'
import { XUiAnalytics } from '../../components/x-ui-analytics/x-ui-analytics'
// import { ANALYTICS_COMMANDS, ANALYTICS_EVENTS, ANALYTICS_TOPIC } from './interfaces';
import { EventEmitter } from '../actions/event-emitter'

describe('route-action-listener:', () => {
  let actionBus: EventEmitter
  let eventBus: EventEmitter

  const startPage = async (url: string = '') => {
    return await newSpecPage({
      components: [XUiAnalytics],
      html: `<x-ui-analytics></x-ui-analytics>`,
      url: 'http://localhost' + url,
    })
  }

  beforeEach(async () => {
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })
})
