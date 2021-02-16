/* istanbul ignore file */

import { createStore } from '@stencil/store';

class StateModel {
  debug!: boolean
  theme!: 'light' | 'dark' | string | null
  providerTimeout!: number
}

const store = createStore<StateModel>({
  debug: false,
  theme: null,
  providerTimeout: 500,
})

const { state, onChange, reset, dispose } = store

export {
  store as interfaceStore,
  state as interfaceState,
  onChange as onInterfaceChange,
  reset as interfaceStateReset,
  dispose as interfaceStateDispose,
};

