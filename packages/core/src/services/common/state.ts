/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  debug!: boolean
  providerTimeout!: number
}

const store = createStore<StateModel>({
  debug: false,
  providerTimeout: 500,
})

const { state, onChange, reset, dispose } = store

export {
  store as commonStore,
  state as commonState,
  onChange as onCommonChange,
  reset as commonStateReset,
  dispose as commonStateDispose,
}

