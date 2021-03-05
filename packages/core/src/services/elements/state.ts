/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  references!: string[]
  animationInterval!: number
}

const store = createStore<StateModel>({
  references: [],
  animationInterval: 500,
})

const { state, onChange, reset, dispose } = store

export {
  store as elementsStore,
  state as elementsState,
  onChange as onElementsChange,
  reset as elementsStateReset,
  dispose as elementsStateDispose,
}
