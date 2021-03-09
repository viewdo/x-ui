/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  hasAudio!: boolean
  playedAudio!: string[]
  enabled!: boolean
}

const store = createStore<StateModel>({
  hasAudio: false,
  playedAudio: [],
  enabled: true,
})

const { state, onChange } = store

export {
  store as audioStore,
  state as audioState,
  onChange as onAudioStateChange,
}
