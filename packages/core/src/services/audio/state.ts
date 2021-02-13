/* istanbul ignore file */ import { createStore } from '@stencil/store'

class StateModel {
  hasAudio!: boolean
  playedAudio!: string[]
  muted!: boolean
}

const store = createStore<StateModel>({
  hasAudio: false,
  playedAudio: [],
  muted: false,
})

const { state, onChange } = store

export { store as audioStore, state as audioState, onChange as onAudioStateChange }
