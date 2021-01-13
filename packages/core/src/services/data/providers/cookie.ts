import { EventEmitter } from '../../actions'
import { DATA_EVENTS, IDataProvider } from '../interfaces'
import { getCookie, setCookie } from '../utils/cookie-utils'

export class CookieProvider implements IDataProvider {
  constructor(private readonly document = window.document) {
    this.changed = new EventEmitter()
  }

  async get(key: string): Promise<string | null> {
    return getCookie(this.document, key) || null
  }

  async set(key: string, value: any) {
    setCookie(this.document, key, value, { sameSite: 'strict' })
    this.changed.emit(DATA_EVENTS.DataChanged)
  }

  changed: EventEmitter
}
