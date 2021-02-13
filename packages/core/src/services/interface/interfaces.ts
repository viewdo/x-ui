/* istanbul ignore file */

export class InterfaceState {
  theme!: string
}

export const INTERFACE_TOPIC = 'interface'

export enum INTERFACE_COMMANDS {
  RegisterProvider = 'register-provider',
  Console = 'console',
  SetTheme = 'set-theme',

  ElementToggleClass = 'element-toggle-class',
  ElementAddClasses = 'element-add-classes',
  ElementRemoveClasses = 'element-remove-classes',
  ElementSetAttribute = 'element-set-attribute',
  ElementRemoveAttribute = 'element-remove-attribute',
  ElementCallMethod = 'element-call-method',
}

export enum INTERFACE_EVENTS {
  ThemeChanged = 'theme',
}

export type InterfaceProviderRegistration = {
  name: string
  provider: any
}
