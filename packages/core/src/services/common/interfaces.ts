export type Listener = (...args: any[]) => void

export type IEvents = Record<string, Listener[]>

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
