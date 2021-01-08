/* istanbul ignore file */
import { createStore } from '@stencil/store';

class StateModel {
  storedVisits!: string[]
  sessionVisits!: string[]
}

const { state, onChange } = createStore<StateModel>({
  storedVisits: [],
  sessionVisits: [],
})

export { state as routingState, onChange as onRoutingStateChange };

