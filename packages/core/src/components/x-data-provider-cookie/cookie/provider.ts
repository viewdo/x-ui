import {
  DATA_EVENTS,
  IDataProvider,
} from '../../../services/data/interfaces'
import { EventEmitter } from '../../../services/events/emitter'
import { getCookie, setCookie } from './utils'

export class CookieProvider implements IDataProvider {
  changed: EventEmitter
  constructor(private readonly document: Document) {
    this.changed = new EventEmitter()
  }

  async get(key: string): Promise<string | null> {
    return getCookie(this.document, key) || null
  }

  async set(key: string, value: any) {
    setCookie(this.document, key, value, { sameSite: 'strict' })
    this.changed.emit(DATA_EVENTS.DataChanged, {
      provider: 'cookie',
    })
  }
}
