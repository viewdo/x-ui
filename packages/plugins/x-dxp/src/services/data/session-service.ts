import { StorageService } from './storage-service'

const SessionKey = 'session-id'

export class SessionService extends StorageService {
  constructor(prefix = 'dxp:', storage: Storage = window.sessionStorage) {
    super(prefix, storage)
  }

  public get sessionId(): string {
    return this.get(SessionKey)
  }

  public set sessionId(value: string) {
    this.set(SessionKey, value)
  }
}
