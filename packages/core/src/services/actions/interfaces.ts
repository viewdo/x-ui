import { IEventEmitter } from '../common/interfaces'
/* istanbul ignore file */

export interface IEventActionListener {
  initialize(
    win: Window,
    actions: IEventEmitter,
    events: IEventEmitter,
  ): void
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
