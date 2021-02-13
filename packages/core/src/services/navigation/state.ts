/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  storedVisits!: string[]
  sessionVisits!: string[]
}

const store = createStore<StateModel>({
  storedVisits: [],
  sessionVisits: [],
})

const { state, onChange, reset, dispose } = store

export {
  store as navigationStore,
  state as navigationState,
  onChange as onNavigationChange,
  reset as navigationStateReset,
  dispose as navigationStateDispose,
}
