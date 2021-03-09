/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  providerTimeout!: number
}

const store = createStore<StateModel>({
  providerTimeout: 500,
})

const { state, onChange, reset, dispose } = store

export {
  store as dataStore,
  state as dataState,
  onChange as onDataChange,
  reset as dataStateReset,
  dispose as dataStateDispose,
}
