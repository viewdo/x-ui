// Adapted from the https://github.com/ReactTraining/history and converted to TypeScript

import { Listener } from '../../actions/interfaces'
import { warnIf } from '../../logging'
import { LocationSegments, Prompt } from '../interfaces'

export function createTransitionManager() {
  let prompt: Prompt | string | null
  let listeners: Listener[] = []

  const setPrompt = (nextPrompt: Prompt | string | null) => {
    warnIf(prompt === null, 'A history supports only one prompt at a time')

    prompt = nextPrompt

    return () => {
      if (prompt === nextPrompt) {
        prompt = null
      }
    }
  }

  const confirmTransitionTo = (
    location: LocationSegments,
    action: string,
    getUserConfirmation: (message: string, callback: (confirmed: boolean) => Record<string, unknown>) => void,
    callback: (confirmed: boolean) => any,
  ) => {
    if (prompt === null) {
      callback(true)
    } else {
      const result = typeof prompt === 'function' ? prompt(location, action) : prompt

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback)
        } else {
          warnIf(false, 'A history needs a getUserConfirmation function in order to use a prompt message')

          callback(true)
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false)
      }
    }
  }

  const appendListener = (fn: Listener) => {
    let isActive = true

    const listener = (...args: any[]) => {
      if (isActive) {
        fn(...args)
      }
    }

    listeners.push(listener)

    return () => {
      isActive = false
      listeners = listeners.filter((item) => item !== listener)
    }
  }

  const notifyListeners = (...args: any[]) => {
    listeners.forEach((listener) => listener(...args))
  }

  return {
    setPrompt,
    confirmTransitionTo,
    appendListener,
    notifyListeners,
  }
}
