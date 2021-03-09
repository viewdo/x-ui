/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  references!: string[]
}

const store = createStore<StateModel>({
  references: [],
})

const { state, onChange, reset, dispose } = store

export {
  store as elementsStore,
  state as elementsState,
  onChange as onElementsChange,
  reset as elementsStateReset,
  dispose as elementsStateDispose,
}
