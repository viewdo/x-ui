/* istanbul ignore file */

/**
 * Checks if the browser supports storage
 * @param {Window} win
 * @param {string} 'localStorage' | 'sessionStorage'
 * @returns  {boolean} */
export function storageAvailable(win: any, type: 'localStorage' | 'sessionStorage') {
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
