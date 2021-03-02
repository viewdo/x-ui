jest.mock('../common/logging')

import { MockWindow } from '@stencil/core/mock-doc'
import { newSpecPage } from '@stencil/core/testing'
import { sleep } from '../common'
import { EventEmitter } from '../events'
import { ElementsActionListener } from './actions'
import { ELEMENTS_COMMANDS, ELEMENTS_TOPIC } from './interfaces'
import { clearReferences, hasReference, markReference } from './references'

describe('elements-actions:', () => {
  let actionBus: EventEmitter
  let eventBus: EventEmitter

  beforeAll(() => {
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })

  afterAll(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
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
      autoApplyChanges: true,
    })
    const subject = new ElementsActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementToggleClass,
      data: {
        selector: 'div',
        className: 'test',
      },
    })

    // TODO: I can't get this to consistently work with with the Mocks
    // let element = page.body.querySelector('div')
    // let hasClass = element?.classList.contains('test')
    // expect(hasClass).toBe(true)

    subject.destroy()
  })

  it('elementAddClasses, elementRemoveClasses', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new ElementsActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementAddClasses,
      data: {
        selector: 'div',
        classes: 'test',
      },
    })

    await page.waitForChanges()

    let element = page.body.querySelector('div')

    let hasClass = element?.classList.contains('test')

    expect(hasClass).toBe(true)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementRemoveClasses,
      data: {
        selector: 'div',
        classes: 'test',
      },
    })

    element = page.body.querySelector('div')
    hasClass = element?.classList.contains('test')

    expect(hasClass).toBe(false)
    subject.destroy()
  })

  it('elementSetAttribute, elementRemoveAttribute', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new ElementsActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementSetAttribute,
      data: {
        selector: 'div',
        attribute: 'test',
      },
    })

    await page.waitForChanges()

    let element = page.body.querySelector('div')

    let hasAttribute = element?.hasAttribute('test')

    expect(hasAttribute).toBe(true)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementRemoveAttribute,
      data: {
        selector: 'div',
        attribute: 'test',
      },
    })

    element = page.body.querySelector('div')
    hasAttribute = element?.hasAttribute('test')

    expect(hasAttribute).toBe(false)
    subject.destroy()
  })

  it('interface listener: ElementAddClasses / ElementRemoveClasses', async () => {
    const fakeWindow = new MockWindow('<html><body><h1>Hello</h1></body></html>')

    const interfaceListener = new ElementsActionListener()
    interfaceListener.initialize(fakeWindow.window, actionBus, eventBus)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementAddClasses,
      data: {
        selector: 'h1',
        classes: 'test',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe('<h1 class="test">Hello</h1>')

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementRemoveClasses,
      data: {
        selector: 'h1',
        classes: 'test',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe('<h1>Hello</h1>')
  })

  it('interface listener: elementToggleClass', async () => {
    const fakeWindow = new MockWindow('<html><body><h1>Hello</h1></body></html>')

    const interfaceListener = new ElementsActionListener()
    interfaceListener.initialize(fakeWindow.window, actionBus, eventBus)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementToggleClass,
      data: {
        selector: 'h1',
        className: 'test',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe('<h1 class="test">Hello</h1>')

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementToggleClass,
      data: {
        selector: 'h1',
        className: 'test',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe('<h1>Hello</h1>')
  })

  it('interface listener: ElementSetAttribute / ElementRemoveAttribute', async () => {
    const fakeWindow = new MockWindow('<html><body><h1>Hello</h1></body></html>')

    const interfaceListener = new ElementsActionListener()
    interfaceListener.initialize(fakeWindow.window, actionBus, eventBus)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementSetAttribute,
      data: {
        selector: 'h1',
        attribute: 'hidden',
      },
    })

    expect(fakeWindow.document.body.innerHTML).toBe('<h1 hidden="">Hello</h1>')

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementSetAttribute,
      data: {
        selector: 'h1',
        attribute: 'hidden',
        value: 'true',
      },
    })

    expect(fakeWindow.document.body.innerHTML).toBe('<h1 hidden="true">Hello</h1>')

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementRemoveAttribute,
      data: {
        selector: 'h1',
        attribute: 'hidden',
      },
    })

    expect(fakeWindow.document.body.innerHTML).toBe('<h1>Hello</h1>')
  })

  it('interface listener: CallElementFun', async () => {
    const fakeWindow = new MockWindow(
      `<html>
      <body>
      <h1>Hello</h1>
      <button />
      </body>
      </html>`,
    )

    const interfaceListener = new ElementsActionListener()
    interfaceListener.initialize(fakeWindow.window, actionBus, eventBus)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.ElementCallMethod,
      data: {
        selector: 'button',
        method: 'click',
        data: null,
      },
    })
  })
})
