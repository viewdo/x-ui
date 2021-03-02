jest.mock('../common/logging')

import { getInterfaceProvider, setInterfaceProvider } from './factory'
import { DefaultInterfaceProvider } from './providers/default'

describe('provider-factory', () => {
  let custom: DefaultInterfaceProvider

  beforeEach(() => {
    custom = new DefaultInterfaceProvider()
  })

  afterEach(() => {
    custom.destroy()
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
})
