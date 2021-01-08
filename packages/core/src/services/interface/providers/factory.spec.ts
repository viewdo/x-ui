jest.mock('../../logging')

import { MockWindow } from '@stencil/core/mock-doc';
import { INTERFACE_COMMANDS } from '..';
import { actionBus, eventBus } from '../../actions';
import { sleep } from '../../utils/promise-utils';
import { InterfaceListener } from '../action-listener';
import { DefaultInterfaceProvider } from './default';
import { getInterfaceProvider, setInterfaceProvider } from './factory';

describe('provider-factory', () => {
  let custom: DefaultInterfaceProvider

  beforeEach(() => {
    custom = new DefaultInterfaceProvider()
  })

  it('getProvider: should return default', async () => {
    const provider = getInterfaceProvider()
    expect(provider).not.toBeNull()
  })

  it('getProvider: returns custom provider', async () => {
    setInterfaceProvider('custom', custom)
    const provider = getInterfaceProvider()
    expect(provider).toBe(custom)
  })

  it('interface listener: ElementAddClasses / ElementRemoveClasses', async () => {
    const fakeWindow = new MockWindow('<html><body><h1>Hello</h1></body></html>')

    const interfaceListener = new InterfaceListener()
    interfaceListener.initialize(fakeWindow.window, actionBus, eventBus)

    actionBus.emit('interface', {
      topic: 'interface',
      command: INTERFACE_COMMANDS.ElementAddClasses,
      data: {
        selector: 'h1',
        classes: 'test',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe('<h1 class="test">Hello</h1>')

    actionBus.emit('interface', {
      topic: 'interface',
      command: INTERFACE_COMMANDS.ElementRemoveClasses,
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

    const interfaceListener = new InterfaceListener()
    interfaceListener.initialize(fakeWindow.window, actionBus, eventBus)

    actionBus.emit('interface', {
      topic: 'interface',
      command: INTERFACE_COMMANDS.ElementToggleClass,
      data: {
        selector: 'h1',
        className: 'test',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe('<h1 class="test">Hello</h1>')

    actionBus.emit('interface', {
      topic: 'interface',
      command: INTERFACE_COMMANDS.ElementToggleClass,
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

    const interfaceListener = new InterfaceListener()
    interfaceListener.initialize(fakeWindow.window, actionBus, eventBus)

    actionBus.emit('interface', {
      topic: 'interface',
      command: INTERFACE_COMMANDS.ElementSetAttribute,
      data: {
        selector: 'h1',
        attribute: 'hidden',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe('<h1 hidden="">Hello</h1>')

    actionBus.emit('interface', {
      topic: 'interface',
      command: INTERFACE_COMMANDS.ElementSetAttribute,
      data: {
        selector: 'h1',
        attribute: 'hidden',
        value: 'true'
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe('<h1 hidden="true">Hello</h1>')

    actionBus.emit('interface', {
      topic: 'interface',
      command: INTERFACE_COMMANDS.ElementRemoveAttribute,
      data: {
        selector: 'h1',
        attribute: 'hidden',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe('<h1>Hello</h1>')
  })
})
