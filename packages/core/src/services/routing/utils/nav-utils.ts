/* istanbul ignore file */
/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */
export const supportsPopStateOnHashChange = (nav: Navigator) => !nav.userAgent.includes('Trident')

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */
export const supportsGoWithoutReloadUsingHash = (nav: Navigator) => !nav.userAgent.includes('Firefox')

export const isExtraneousPopstateEvent = (nav: Navigator, event: any) =>
  event.state === undefined && !nav.userAgent.includes('CriOS')
