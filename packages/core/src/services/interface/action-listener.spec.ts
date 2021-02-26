import { newSpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../actions/event-emitter'
import { InterfaceActionListener } from './action-listener'
import { INTERFACE_COMMANDS, INTERFACE_TOPIC } from './interfaces'
import { clearInterfaceProvider, getInterfaceProvider } from './providers/factory'

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

  it('register-provider', async () => {
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

  it('set-theme: init', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new InterfaceActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    subject.defaultProvider.setTheme('dark')

    expect(page.win.localStorage.getItem('theme')).toBe('dark')

    subject.destroy()
  })

  it('set-theme: action', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new InterfaceActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.SetTheme,
      data: 'dark',
    })

    expect(page.win.localStorage.getItem('theme')).toBe('dark')

    subject.destroy()
  })

  it('log, warn and dir', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new InterfaceActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: INTERFACE_COMMANDS.Log,
      data: {
        message: 'do not log in tests!',
      },
    })

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: 'warn',
      data: {
        message: 'do not log in tests!',
      },
    })

    actionBus.emit(INTERFACE_TOPIC, {
      topic: INTERFACE_TOPIC,
      command: 'dir',
      data: {
        message: 'do not log in tests!',
      },
    })

    subject.destroy()
  })
})
