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
