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

export type Listener = (...args: any[]) => void

export type IEvents = Record<string, Listener[]>

export interface IActionElement {
  getAction(): Promise<EventAction<any>>
}
