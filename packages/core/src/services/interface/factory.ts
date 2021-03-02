import { commonState, debugIf } from '../common'

let provider: any | null

export function setInterfaceProvider(name: string, p: any) {
  debugIf(commonState.debug, `document-provider: ${name} registered`)
  provider = p
}

export function getInterfaceProvider(): any | null {
  return provider
}

export function clearInterfaceProvider() {
  provider = null
}
