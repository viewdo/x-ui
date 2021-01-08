import { createStore } from '@stencil/store';
import { Experience } from '../models';

class StateModel {
  debug!: boolean
  experience!: Experience|null
}

const { state, onChange } = createStore<StateModel>({
  debug: false,
  experience: null,
})

export { state, onChange };

