import { IEvents, Listener } from '../common/interfaces'
/* istanbul ignore file */

export interface IEventEmitter {
  on(event: string, listener: Listener): () => void
  removeListener(event: string, listener: Listener): void
  removeAllListeners(): void
  emit(event: string, ...args: any[]): void
  once(event: string, listener: Listener): () => void
}

export interface IEventActionListener {
  initialize(win: Window, actions: IEventEmitter, events: IEventEmitter): void
  destroy(): void
}

export enum ActionActivationStrategy {
  OnEnter = 'OnEnter',
  OnExit = 'OnExit',
  AtTime = 'AtTime',
  OnElementEvent = 'OnElementEvent',
}

export interface EventAction<T> {
  topic: string
  command: string
  data: T
}

export const ACTIONS_DOM_EVENT = 'x:actions'
export const EVENTS_DOM_EVENT = 'x:events'

export interface IActionElement {
  getAction(): Promise<EventAction<any> | null>
}

export enum ActionTopicType {
  data = 'data',
  analytics = 'analytics',
  elements = 'elements',
  interface = 'interface',
  navigation = 'navigation',
  audio = 'audio',
  video = 'video',
}

export { Listener, IEvents }
