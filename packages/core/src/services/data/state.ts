/* istanbul ignore file */

import { createStore } from '@stencil/store'
import { IDataProvider } from './interfaces'

class StateModel {
  enabled!: boolean
  providers!: Record<string, IDataProvider>
  providerTimeout!: number
}

const store = createStore<StateModel>({
  enabled: false,
  providers: {},
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
