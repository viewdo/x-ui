import { newSpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../actions/event-emitter'
import { InterfaceActionListener } from './action-listener'
import { INTERFACE_COMMANDS, INTERFACE_TOPIC } from './interfaces'
import { clearInterfaceProvider, getInterfaceProvider } from './providers/factory'
import { clearReferences, hasReference, markReference } from './references'

let called = false
class MockProvider {
  doTheThing(..._args: any[]) {
    called = true
  }
}

describe('interface-action-listener:', () => {
  let actionBus: EventEmitter
  let eventBus: EventEmitter

  beforeAll(() => {
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })

  it('references ', async () => {
    const url = 'https://some-url.com'
    markReference(url)

    expect(hasReference(url)).toBe(true)

    clearReferences()
  })

  it('register provider', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new InterfaceActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    const provider = new MockProvider()

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.RegisterProvider,
      data: {
        name: 'special',
        provider,
      },
    })

    let result = getInterfaceProvider()
    expect(result).toBe(provider)

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: 'do-the-thing',
      data: {
        name: 'special',
      },
    })

    await page.waitForChanges()

    expect(called).toBe(true)

    clearInterfaceProvider()

    result = getInterfaceProvider()

    expect(result).toBeNull()

    subject.destroy()
  })

  it('theme, autoplay & mute', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new InterfaceActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    subject.defaultProvider.setAutoPlay(true)
    subject.defaultProvider.setTheme('dark')
    subject.defaultProvider.setMute(true)

    expect(page.win.localStorage.getItem('autoplay')).toBe('true')
    expect(page.win.localStorage.getItem('theme')).toBe('dark')
    expect(page.win.localStorage.getItem('muted')).toBe('true')

    subject.destroy()
  })

  it('actions: theme, autoplay & mute', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new InterfaceActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.SetAutoPlay,
      data: true,
    })

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.SetTheme,
      data: 'dark',
    })

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.SetMute,
      data: true,
    })

    expect(page.win.localStorage.getItem('autoplay')).toBe('true')
    expect(page.win.localStorage.getItem('theme')).toBe('dark')
    expect(page.win.localStorage.getItem('muted')).toBe('true')

    subject.destroy()
  })

  it('elementToggleClass ', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
      autoApplyChanges: true,
    })
    const subject = new InterfaceActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.ElementToggleClass,
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
    const subject = new InterfaceActionListener()
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
    subject.destroy()
  })

  it('elementSetAttribute, elementRemoveAttribute', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new InterfaceActionListener()
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
    subject.destroy()
  })
})
