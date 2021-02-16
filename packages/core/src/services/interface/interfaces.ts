/* istanbul ignore file */

export const INTERFACE_TOPIC = 'interface'

export enum INTERFACE_COMMANDS {
  RegisterProvider = 'register-provider',
  Log = 'log',
  SetTheme = 'set-theme',
}

export enum INTERFACE_EVENTS {
  ThemeChanged = 'theme',
}

export type InterfaceProviderRegistration = {
  name: string
  provider: any
}
