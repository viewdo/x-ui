import { EventEmitter } from '../../actions/event-emitter'
import { DATA_EVENTS, IDataProvider } from '../interfaces'

export class InMemoryProvider implements IDataProvider {
  data = {}
  constructor() {
    this.changed = new EventEmitter()
  }

  async get(key: string): Promise<string> {
    return this.data[key]
  }

  async set(key: string, value: string): Promise<void> {
    this.data[key] = value
    this.changed.emit(DATA_EVENTS.DataChanged)
  }

  changed: EventEmitter
}
