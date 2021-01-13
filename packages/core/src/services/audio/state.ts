/* istanbul ignore file */ import { createStore } from '@stencil/store'

class StateModel {
  hasAudio!: boolean
  playedAudio!: string[]
}

const store = createStore<StateModel>({
  hasAudio: false,
  playedAudio: [],
})

const { state, onChange } = store

export { store as audioStore, state as audioState, onChange as onAudioStateChange }
