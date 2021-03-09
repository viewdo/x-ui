/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  hasAudio!: boolean
  playedAudio!: string[]
  enabled!: boolean
  muted!: boolean
}

const store = createStore<StateModel>({
  hasAudio: false,
  playedAudio: [],
  enabled: true,
  muted: false,
})

const { state, onChange, dispose, reset } = store

export {
  store as audioStore,
  state as audioState,
  onChange as onAudioStateChange,
  dispose as audioStateDispose,
  reset as audioStateReset,
}
