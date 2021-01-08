jest.mock('../../logging')

import { setInterfaceProvider, getInterfaceProvider } from './factory'
import { DefaultInterfaceProvider } from './default'
import { MockWindow } from '@stencil/core/mock-doc'
import { actionBus, eventBus } from '../../actions'
import { INTERFACE_COMMANDS } from '..'
import { InterfaceListener } from '../action-listener'
import { sleep } from '../../utils/promise-utils'

describe('provider-factory', () => {
  let custom: DefaultInterfaceProvider

  beforeEach(() => {
    custom = new DefaultInterfaceProvider()
  })

  it('getProvider: incorrect name should return null', async () => {
    const provider = getInterfaceProvider()
    expect(provider).toBe(null)
  })

  it('getProvider: returns custom provider', async () => {
    setInterfaceProvider('custom', custom)
    const provider = getInterfaceProvider()
    expect(provider).toBe(custom)
  })

  it('interface listener modifies DOM', async () => {
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
  })
})
