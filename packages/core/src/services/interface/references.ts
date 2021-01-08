import { interfaceState } from './state'

export function hasReference(url: string) {
  return interfaceState.references.includes(url)
}

export function markReference(url: string) {
  interfaceState.references = [...new Set([...interfaceState.references, url])]
}

export function clearReferences() {
  interfaceState.references = []
}

export interface ISwipeEvent {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}
