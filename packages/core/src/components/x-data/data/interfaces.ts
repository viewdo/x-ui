import { IDataProvider } from '../../../services/data/interfaces'

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
