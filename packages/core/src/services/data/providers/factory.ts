import { interfaceState } from '../../interface'
import { debugIf } from '../../logging'
import { requireValue } from '../../utils/misc-utils'
import { IDataProvider } from '../interfaces'

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

  debugIf(interfaceState.debug && name !== 'data', `data-provider: ${name} registered`)
}

export function getDataProvider(name: string): IDataProvider {
  requireValue(name, 'provider name')
  return providers[name.toLowerCase()] || null
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
