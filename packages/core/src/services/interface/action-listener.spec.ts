import { newSpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../actions/event-emitter'
import { InterfaceActionListener } from './action-listener'
import { INTERFACE_COMMANDS, INTERFACE_TOPIC } from './interfaces'
import { clearReferences, hasReference, markReference } from './references'
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

  it('references ', async () => {
    const url = 'https://some-url.com'
    markReference(url)

    expect(hasReference(url)).toBe(true)

    clearReferences()
  })

  it('elementToggleClass ', async () => {
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

  it('elementAddClasses, elementRemoveClasses', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })

    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.ElementAddClasses,
      data: {
        selector: 'div',
        classes: 'test',
      },
    })

    await page.waitForChanges()

    let element = page.body.querySelector('div')

    let hasClass = element?.classList.contains('test')

    expect(hasClass).toBe(true)

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.ElementRemoveClasses,
      data: {
        selector: 'div',
        classes: 'test',
      },
    })

    element = page.body.querySelector('div')
    hasClass = element?.classList.contains('test')

    expect(hasClass).toBe(false)
  })

  it('elementSetAttribute, elementRemoveAttribute', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })

    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.ElementSetAttribute,
      data: {
        selector: 'div',
        attribute: 'test',
      },
    })

    await page.waitForChanges()

    let element = page.body.querySelector('div')

    let hasAttribute = element?.hasAttribute('test')

    expect(hasAttribute).toBe(true)

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.ElementRemoveAttribute,
      data: {
        selector: 'div',
        attribute: 'test',
      },
    })

    element = page.body.querySelector('div')
    hasAttribute = element?.hasAttribute('test')

    expect(hasAttribute).toBe(false)
  })
})
