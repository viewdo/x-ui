// Adapted from the https://github.com/ReactTraining/history and converted to TypeScript

import { warnIf } from '../../logging'
import { LocationSegments, Prompt } from '../interfaces'

export function createTransitionManager() {
  let prompt: Prompt | string | null
  let listeners: Function[] = []

  const setPrompt = (nextPrompt: Prompt | string | null) => {
    warnIf(prompt == null, 'A history supports only one prompt at a time')

    prompt = nextPrompt

    return () => {
      if (prompt === nextPrompt) {
        prompt = null
      }
    }
  }

  const confirmTransitionTo = (location: LocationSegments, action: string, getUserConfirmation: Function, callback: Function) => {
    if (prompt != null) {
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
    } else {
      callback(true)
    }
  }

  const appendListener = (fn: Function) => {
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
