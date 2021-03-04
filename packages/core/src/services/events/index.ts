import { EventEmitter } from './emitter'

export * from './emitter'
export * from './interfaces'
export { actionBus, eventBus }

const actionBus = new EventEmitter()
const eventBus = new EventEmitter()
