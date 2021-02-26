import { debugIf } from '../../common/logging'
import { interfaceState } from '../state'

let provider: any | null

export function setInterfaceProvider(name: string, p: any) {
  debugIf(interfaceState.debug, `document-provider: ${name} registered`)
  provider = p
}

export function getInterfaceProvider(): any | null {
  return provider
}

export function clearInterfaceProvider() {
  provider = null
}
