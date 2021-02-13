/* istanbul ignore file */

import { LocationSegments } from '../routing/interfaces'

export enum NAVIGATION_COMMANDS {
  NavigateNext = 'navigate-next',
  NavigateTo = 'navigate-to',
  NavigateBack = 'navigate-back',
}

export type NavigateTo = {
  url: string
}

export const NAVIGATION_TOPIC = 'routing'

export type NavigateNext = Record<string, unknown>

export interface NextState {
  action: string
  location: LocationSegments
}

export enum VisitStrategy {
  once = 'once',
  always = 'always',
  optional = 'optional',
}

export interface IViewDo {
  visit?: VisitStrategy
  when?: string
  visited?: boolean
  url: string
  [key: string]: any
}
