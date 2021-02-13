/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  debug!: boolean
  theme!: 'light' | 'dark' | string | null
  references!: string[]
  providerTimeout!: number
  animationInterval!: number
}

const store = createStore<StateModel>({
  debug: false,
  theme: localStorage.getItem('theme') || null,
  references: [],
  providerTimeout: 500,
  animationInterval: 500,
})

const { state, onChange, reset, dispose } = store

export {
  store as interfaceStore,
  state as interfaceState,
  onChange as onInterfaceChange,
  reset as interfaceStateReset,
  dispose as interfaceStateDispose,
}
