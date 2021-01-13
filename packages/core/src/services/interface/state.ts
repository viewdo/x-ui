/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  debug!: boolean
  theme!: 'light' | 'dark' | string
  muted!: boolean
  autoplay!: boolean
  storedVisits!: string[]
  sessionVisits!: string[]
  references!: string[]
}

const store = createStore<StateModel>({
  debug: false,
  theme: localStorage.getItem('theme') || 'light',
  muted: localStorage.getItem('muted') === 'true',
  autoplay: localStorage.getItem('autoplay') === 'true',
  storedVisits: [],
  sessionVisits: [],
  references: [],
})

const { state, onChange } = store

onChange('theme', (t) => localStorage?.setItem('theme', t?.toString()))
onChange('muted', (m) => localStorage?.setItem('muted', m?.toString()))
onChange('autoplay', (a) => localStorage?.setItem('autoplay', a?.toString()))

export { store as interfaceStore, state as interfaceState, onChange as onInterfaceChange }
