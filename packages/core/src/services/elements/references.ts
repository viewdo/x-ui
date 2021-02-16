import { elementsState } from './state';

export function hasReference(url: string) {
  return elementsState.references.includes(url)
}

export function markReference(url: string) {
  elementsState.references = [...new Set([...elementsState.references, url])]
}

export function clearReferences() {
  elementsState.references = []
}
