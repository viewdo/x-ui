/* istanbul ignore file */

import { LocationSegments } from '../routing'

export enum NAVIGATION_COMMANDS {
  GoNext = 'go-next',
  GoTo = 'go-to',
  GoBack = 'go-back',
}

export type NavigateTo = {
  url: string
}

export const NAVIGATION_TOPIC = 'navigation'

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
  visit?: VisitStrategy | string
  when?: string
  visited?: boolean
  url: string
  [key: string]: any
}
