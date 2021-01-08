/* istanbul ignore file */

export const storageAvailable = (win: any, type: 'localStorage' | 'sessionStorage') => {
  const storage = win[type]
  const x = '__storage_test__'

  try {
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch {
    return false
  }
}

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
export const supportsHistory = (win: Window) => {
  const ua = win.navigator.userAgent

  if ((ua.includes('Android 2.') || ua.includes('Android 4.0')) && ua.includes('Mobile Safari') && !ua.includes('Chrome') && !ua.includes('Windows Phone')) {
    return false
  }

  return win.history && 'pushState' in win.history
}

export const getConfirmation = (win: Window, message: string, callback: (confirmed: boolean) => Record<string, unknown>) => callback(win.confirm(message))
