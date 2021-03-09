import { commonState, debugIf, requireValue, sleep } from '../common'
import { IDataProvider } from './interfaces'
import { dataState } from './state'

export function addDataProvider(
  name: string,
  provider: IDataProvider,
) {
  requireValue(name, 'provider name')
  if (typeof provider.get !== 'function') {
    throw new TypeError(
      `The provider ${name} is missing the get(key) function.`,
    )
  }

  dataState.providers[name.toLowerCase()] = provider

  debugIf(
    commonState.debug && name !== 'data',
    `data-provider: ${name} registered`,
  )
}

export async function getDataProvider(
  name: string,
): Promise<IDataProvider | null> {
  const key = name.toLowerCase()
  requireValue(name, 'provider name')
  if (Object.keys(dataState.providers).includes(key))
    return dataState.providers[key]

  await sleep(dataState.providerTimeout)

  if (Object.keys(dataState.providers).includes(key))
    return dataState.providers[key]

  return null
}

export function getDataProviders() {
  return dataState.providers
}

export function removeDataProvider(name: string) {
  delete dataState.providers[name]
}

export function clearDataProviders() {
  Object.keys(dataState.providers).forEach(key => {
    delete dataState.providers[key]
  })
}
