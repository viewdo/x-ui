import { EventEmitter } from './event-emitter'

export * from './interfaces'
export * from './event-emitter'

const actionBus = new EventEmitter()
const eventBus = new EventEmitter()

export { actionBus, eventBus }
