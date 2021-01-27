import { newSpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../actions/event-emitter'
import { InterfaceActionListener } from './action-listener'
import { INTERFACE_COMMANDS, INTERFACE_TOPIC } from './interfaces'
describe('interface-action-listener:', () => {
  let subject: InterfaceActionListener
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  let events: Array<any[]>

  beforeAll(() => {
    events = []
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()

    subject = new InterfaceActionListener()

    eventBus.on('*', (...args: any[]) => {
      events.push(...args)
    })
  })

  it(' ', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })

    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.ElementToggleClass,
      data: {
        selector: 'div',
        className: 'test',
      },
    })

    await page.waitForChanges()

    let element = page.body.querySelector('div')

    let hasClass = element?.classList.contains('test')

    expect(hasClass).toBe(true)
  })
})
