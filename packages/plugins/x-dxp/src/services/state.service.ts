import { Experience } from '../models/Experience';
import { createStore } from "@stencil/store";

class StateModel {
  debug: boolean;
  experience: Experience;
}

const { state, onChange } = createStore<StateModel>({
  debug: false,
  experience: null
});

export {
  state,
  onChange
};
