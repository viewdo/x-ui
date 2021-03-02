import { commonState, debugIf, requireValue, sleep } from '../common'
import { IDataProvider } from './interfaces'

type DataProviders = Record<string, IDataProvider>

const providers: DataProviders = {}

export function addDataProvider(name: string, provider: IDataProvider) {
  requireValue(name, 'provider name')
  if (typeof provider.get !== 'function') {
    throw new TypeError(`The provider ${name} is missing the get(key) function.`)
  }

  if (typeof provider.set !== 'function') {
    throw new TypeError(`The provider ${name} is missing the set(key) function.`)
  }

  providers[name.toLowerCase()] = provider

  debugIf(commonState.debug && name !== 'data', `data-provider: ${name} registered`)
}

export async function getDataProvider(name: string): Promise<IDataProvider | null> {
  const key = name.toLowerCase()
  requireValue(name, 'provider name')
  if (Object.keys(providers).includes(key)) return providers[key]

  await sleep(commonState.providerTimeout)

  if (Object.keys(providers).includes(key)) return providers[key]

  return null
}

export function getDataProviders(): DataProviders {
  return providers
}

export function removeDataProvider(name: string) {
  delete providers[name]
}

export function clearDataProviders() {
  Object.keys(providers).forEach((key) => {
    delete providers[key]
  })
}
