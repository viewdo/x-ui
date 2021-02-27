jest.mock('../../common/logging')
jest.mock('../../../workers/expr-eval.worker')

import { DefaultInterfaceProvider } from './default'
import { getInterfaceProvider, setInterfaceProvider } from './factory'

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
