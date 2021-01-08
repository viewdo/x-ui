jest.mock('../logging')

import { getDataProvider, clearDataProviders, getDataProviders } from './providers/factory'
import { DataListener } from './action-listener'
import { DATA_COMMANDS, DATA_TOPIC, IDataProvider } from './interfaces'
import { InMemoryProvider } from './providers/memory'
import { EventEmitter } from '..'

class MockDataProvider extends InMemoryProvider {
  setItem(x, y) {
    this.set(x, y)
  }

  removeItem(_x) {
    delete this.data[_x]
  }
}

describe('data-provider-listener', () => {
  let subject: DataListener = null
  let mockWindow: any
  let mockDataProvider: IDataProvider
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  beforeEach(() => {
    mockDataProvider = new MockDataProvider()
    clearDataProviders()
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
    mockWindow = {
      sessionStorage: mockDataProvider,
      localStorage: mockDataProvider,
    }
  })

  it('detects session', async () => {
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)
    const session = getDataProvider('session')
    expect(session).toBeDefined()
  })

  it('detects session failed', async () => {
    delete mockWindow.sessionStorage
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)
    const session = getDataProvider('session')
    expect(session).toBeNull()
  })

  it('detects storage', async () => {
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)
    const storage = getDataProvider('storage')
    expect(storage).toBeDefined()
  })

  it('detects storage failed', async () => {
    delete mockWindow.localStorage
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)
    const storage = getDataProvider('storage')
    expect(storage).toBeNull()
  })

  it('eventListener: registers listeners events', async () => {
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)
    const listeners = getDataProviders()
    expect(Object.keys(listeners).length).toBe(2)
  })

  it('eventListener: handles listeners events', async () => {
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)
    const listeners = getDataProviders()
    expect(Object.keys(listeners).length).toBe(2)

    const event = {
      command: DATA_COMMANDS.RegisterDataProvider,
      data: {
        name: 'mock',
        provider: mockDataProvider,
      },
    }

    actionBus.emit(DATA_TOPIC, event)

    const mock = getDataProvider('mock')
    expect(mock).toBeDefined()
    expect(mock).toBe(mockDataProvider)
  })
})
