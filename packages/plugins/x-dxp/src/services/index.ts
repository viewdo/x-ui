import { UrlService } from './urls'
import { StorageService } from './data/storage-service'
import { SessionService } from './data/session-service'
import { LoggingService } from './logging'
import { state, onChange } from './state'

const urlService = new UrlService()
const storageService = new StorageService()
const sessionService = new SessionService()
const logger = new LoggingService()

export { urlService, state, onChange, storageService, sessionService, logger }
