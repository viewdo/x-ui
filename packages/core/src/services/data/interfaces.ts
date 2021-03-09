/* istanbul ignore file */

export interface IDataMutator {
  set(key: string, value: string): Promise<void>
}

export interface IDataProvider {
  get(key: string): Promise<string | null>
  // set(key: string, value: string): Promise<void>
  // keys(): Promise<string[]>
}

export type ExpressionContext = Record<string, any>

export const DATA_TOPIC = 'data'

export enum DATA_PROVIDER {
  SESSION = 'session',
  STORAGE = 'storage',
  COOKIE = 'cookie',
}

export enum DATA_COMMANDS {
  RegisterDataProvider = 'register-provider',
  SetData = 'set-data',
}

export enum DATA_EVENTS {
  CookieConsentResponse = 'cookie-consent',
  DataChanged = 'data-changed',
}

export type DataProviderRegistration = {
  name: string
  provider: IDataProvider
}

export type SetData = {
  provider: string
  [key: string]: string
}
