import {
  DATA_EVENTS,
  IDataProvider,
} from '../../../services/data/interfaces'
import { EventEmitter } from '../../../services/events/emitter'

export class StorageProvider implements IDataProvider {
  private readonly localStorage!: Storage
  constructor(win: Window) {
    this.localStorage = win.localStorage
    this.changed = new EventEmitter()
    window?.addEventListener(
      'storage',
      () => {
        this.changed.emit(DATA_EVENTS.DataChanged)
      },
      { passive: true },
    )
  }

  async get(key: string): Promise<string | null> {
    return this.localStorage?.getItem(key) || null
  }

  async set(key: string, value: string) {
    this.localStorage?.setItem(key, value)
    this.changed.emit(DATA_EVENTS.DataChanged)
  }

  changed: EventEmitter
}
