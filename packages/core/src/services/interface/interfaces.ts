/* istanbul ignore file */

export class InterfaceState {
  theme!: string
  muted!: boolean
  autoplay!: boolean
}

export const INTERFACE_TOPIC = 'interface'

export enum INTERFACE_COMMANDS {
  RegisterProvider = 'register-provider',
  // Alert = 'alert',
  // OpenToast = 'open-toast',
  // ModalOpen = 'modal-open',
  // ModalClose = 'modal-open',
  // OpenPopover = 'open-popover',
  SetTheme = 'set-theme',
  SetAutoPlay = 'set-auto-play',
  SetMute = 'set-mute',
  ElementToggleClass = 'element-toggle-class',
  ElementAddClasses = 'element-add-classes',
  ElementRemoveClasses = 'element-remove-classes',
  ElementSetAttribute = 'element-set-attribute',
  ElementRemoveAttribute = 'element-remove-attribute',
  ElementCallMethod = 'element-call-method',
}

export enum INTERFACE_EVENTS {
  ThemeChanged = 'theme',
  AutoPlayChanged = 'autoplay',
  SoundChanged = 'muted',
}

export type InterfaceProviderRegistration = {
  name: string
  provider: any
}
