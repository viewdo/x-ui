jest.mock('../../logging')

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


})
