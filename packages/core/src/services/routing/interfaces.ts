/* istanbul ignore file */

export enum ROUTE_COMMANDS {
  NavigateNext = 'navigate-next',
  NavigateTo = 'navigate-to',
}

export enum ROUTE_EVENTS {
  RouteChanged = 'route-changed',
}

export type NavigateTo = {
  url: string
}

export const ROUTE_TOPIC = 'routing'

export type NavigateNext = Record<string, unknown>

export type Path = string | RegExp | Array<string | RegExp>

export type Prompt = (location: LocationSegments, action: string) => string

export interface RouteRenderProps {
  history: RouterHistory
  match: MatchResults
  [key: string]: any
}

export interface RouteViewOptions {
  scrollTopOffset?: number
  scrollToId?: string
}

export interface RouteSubscription {
  isMatch: boolean
  groupId?: string
  groupIndex?: number
}

export type HistoryType = 'browser' | 'hash'

export interface LocationSegments {
  params: Record<string, any>
  pathname: string
  query: Record<string, any>
  key: string
  scrollPosition?: [number, number]
  search?: string
  hash?: string
  state?: any
  pathParts?: string[]
  hashParts?: string[]
}

export type LocationSegmentPart = 'pathname' | 'search' | 'hash' | 'state' | 'key'

export interface RouterHistory {
  length: number
  action: string
  location: LocationSegments
  createHref: (location: LocationSegments) => string
  push: (path: string | LocationSegments, state?: any) => void
  replace: (path: string | LocationSegments, state?: any) => void
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
  path: string
  url: string
  isExact: boolean
  params: Record<string, string>
}

export enum VisitStrategy {
  once = 'once',
  always = 'always',
  optional = 'optional',
}

export interface IViewDo {
  visit: VisitStrategy
  when?: string
  visited: boolean
  url: string
  [key: string]: any
}
