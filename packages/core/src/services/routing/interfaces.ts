/* istanbul ignore file */

import { LocationSegments } from '../common'
import { ActionActivationStrategy } from '../events'
import { Path } from './utils'

export { LocationSegments }

export enum ROUTE_EVENTS {
  RouteChanged = 'route-changed',
  Finalized = 'finalized',
}

export type Prompt = (
  location: LocationSegments,
  action: string,
) => string

export interface RouteViewOptions {
  scrollTopOffset?: number
  scrollToId?: string
}

export interface RouteSubscription {
  isMatch: boolean
  groupId?: string
  groupIndex?: number
}

export type LocationSegmentPart =
  | 'pathname'
  | 'search'
  | 'hash'
  | 'state'
  | 'key'

export interface RouterHistory {
  length: number
  action: string
  location: LocationSegments
  createHref: (location: LocationSegments) => string
  push: (path: string, state?: any) => void
  replace: (path: string, state?: any) => void
  go: (n: number) => void
  goBack: () => void
  goForward: () => void
  block: any
  listen: (listener: any) => () => void
  win: Window
}

export interface MatchOptions {
  path?: Path
  exact?: boolean
  strict?: boolean
}

export interface MatchResults {
  path: Path
  url: string
  isExact: boolean
  params: Record<string, string>
}

export interface IRoute {
  activateActions(
    actionActivators: HTMLXActionActivatorElement[],
    AtTime: ActionActivationStrategy,
    filter: (activator: any) => boolean,
  ): Promise<void>
  goBack(): void
  goToRoute(path: string): void
  goToParentRoute(): void
}
