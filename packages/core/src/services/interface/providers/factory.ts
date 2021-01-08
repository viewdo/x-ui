import { debugIf } from '../../logging';
import { InterfaceProvider } from '../interfaces';
import { interfaceState } from '../state';

let provider: InterfaceProvider

export function setInterfaceProvider(name: string, p: InterfaceProvider) {
  debugIf(interfaceState.debug, `document-provider: ${name} registered`)
  provider = p
}

export function getInterfaceProvider(): InterfaceProvider {
  return provider
}
