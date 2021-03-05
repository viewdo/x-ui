import { IDataProvider } from '../../../services/data/interfaces'
import { EventEmitter } from '../../../services/events/emitter'

export class SessionProvider implements IDataProvider {
  changed: EventEmitter
  constructor(
    private readonly sessionStorage = window.sessionStorage,
  ) {
    this.changed = new EventEmitter()
  }

  async get(key: string): Promise<string | null> {
    return this.sessionStorage?.getItem(key)
  }

  async set(key: string, value: any): Promise<void> {
    this.sessionStorage?.setItem(key, value)
  }
}
