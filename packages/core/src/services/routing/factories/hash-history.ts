// Adapted from the https://github.com/ReactTraining/history and converted to TypeScript

import { Listener } from '../../actions/interfaces'
import { warnIf } from '../../logging'
import { LocationSegments, Prompt, RouterHistory } from '../interfaces'
import { getConfirmation } from '../utils/browser-utils'
import { createKey, createLocation, locationsAreEqual } from '../utils/location-utils'
import { supportsGoWithoutReloadUsingHash } from '../utils/nav-utils'
import {
  addLeadingSlash,
  createPath,
  hasBasename,
  stripBasename,
  stripLeadingSlash,
  stripTrailingSlash,
} from '../utils/path-utils'
import { createTransitionManager } from './transition-manager'

export interface CreateHashHistoryOptions {
  getUserConfirmation?: (
    message: string,
    callback: (confirmed: boolean) => Record<string, unknown>,
  ) => Record<string, unknown>
  hashType?: 'hashbang' | 'noslash' | 'slash'
  basename?: string
  keyLength?: number
}

const HashChangeEvent = 'hashchange'
const HashPathCoders = {
  hashbang: {
    encodePath: (path: string) => (path.startsWith('!') ? path : `!/${stripLeadingSlash(path)}`),
    decodePath: (path: string) => (path.startsWith('!') ? path.slice(1) : path),
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash,
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash,
  },
}

export function createHashHistory(win: Window, props: CreateHashHistoryOptions = {}) {
  let forceNextPop = false
  let ignorePath: any = null
  let listenerCount = 0
  let isBlocked = false

  const globalLocation = win.location
  const globalHistory = win.history
  const canGoWithoutReload = supportsGoWithoutReloadUsingHash(win.navigator)
  const keyLength = props.keyLength ? props.keyLength : 6

  const { getUserConfirmation = getConfirmation, hashType = 'slash' } = props
  const basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : ''

  const { encodePath, decodePath } = HashPathCoders[hashType]

  const getHashPath = () => {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    const { href } = globalLocation
    const hashIndex = href.indexOf('#')
    return hashIndex === -1 ? '' : href.slice(Math.max(0, hashIndex + 1))
  }

  const pushHashPath = (path: string) => {
    globalLocation.hash = path
  }

  const replaceHashPath = (path: string) => {
    const hashIndex = globalLocation.href.indexOf('#')

    globalLocation.replace(`${globalLocation.href.slice(0, hashIndex >= 0 ? hashIndex : 0)}#${path}`)
  }

  const getDOMLocation = () => {
    let path = decodePath(getHashPath())

    warnIf(
      !hasBasename(path, basename),
      `${'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'}${path}" to begin with "${basename}".`,
    )

    if (basename) {
      path = stripBasename(path, basename)
    }

    return createLocation(path, undefined, createKey(keyLength))
  }

  const transitionManager = createTransitionManager()

  const setState = (nextState?: any) => {
    Object.assign(history, nextState)

    history.length = globalHistory.length

    transitionManager.notifyListeners(history.location, history.action)
  }

  const handleHashChange = () => {
    const path = getHashPath()
    const encodedPath = encodePath(path)

    if (path === encodedPath) {
      const location = getDOMLocation()
      const previousLocation = history.location

      if (!forceNextPop && locationsAreEqual(previousLocation, location)) {
        return // A hashchange doesn't always == location change.
      }

      if (ignorePath === createPath(location)) {
        return // Ignore this change; we already setState in push/replace.
      }

      ignorePath = null

      handlePop(location)
    } else {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath)
    }
  }

  const handlePop = (location: LocationSegments) => {
    if (forceNextPop) {
      forceNextPop = false
      setState()
    } else {
      const action = 'POP'

      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok: boolean) => {
        if (ok) {
          setState({ action, location })
        } else {
          revertPop(location)
        }
      })
    }
  }

  const revertPop = (fromLocation: LocationSegments) => {
    const toLocation = history.location

    let toIndex = allPaths.lastIndexOf(createPath(toLocation))
    let fromIndex = allPaths.lastIndexOf(createPath(fromLocation))

    if (toIndex === -1) {
      toIndex = 0
    }

    if (fromIndex === -1) {
      fromIndex = 0
    }

    const delta = toIndex - fromIndex

    if (delta) {
      forceNextPop = true
      go(delta)
    }
  }

  // Ensure the hash is encoded properly before doing anything else.
  const pathTest = getHashPath()
  const encodedPathTest = encodePath(pathTest)

  if (pathTest !== encodedPathTest) {
    replaceHashPath(encodedPathTest)
  }

  const initialLocation = getDOMLocation()
  let allPaths = [createPath(initialLocation)]

  // Public interface

  const createHref = (location: LocationSegments) => `#${encodePath(basename + createPath(location))}`

  const push = (url: string | LocationSegments, state: any) => {
    warnIf(state, 'Hash history cannot push state; it is ignored')

    const action = 'PUSH'
    const location = createLocation(url, undefined, createKey(keyLength), history.location)

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok: boolean) => {
      if (!ok) {
        return
      }

      const path = createPath(location)
      const encodedPath = encodePath(basename + path)
      const hashChanged = getHashPath() !== encodedPath

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path
        pushHashPath(encodedPath)

        const previousIndex = allPaths.lastIndexOf(createPath(history.location))
        const nextPaths = allPaths.slice(0, previousIndex === -1 ? 0 : previousIndex + 1)

        nextPaths.push(path)
        allPaths = nextPaths

        setState({ action, location })
      } else {
        warnIf(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack')

        setState()
      }
    })
  }

  const replace = (url: string | LocationSegments, state: any) => {
    warnIf(state === undefined, 'Hash history cannot replace state; it is ignored')

    const action = 'REPLACE'
    const location = createLocation(url, undefined, createKey(keyLength), history.location)

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok: boolean) => {
      if (!ok) {
        return
      }

      const path = createPath(location)
      const encodedPath = encodePath(basename + path)
      const hashChanged = getHashPath() !== encodedPath

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path
        replaceHashPath(encodedPath)
      }

      const previousIndex = allPaths.indexOf(createPath(history.location))

      if (previousIndex !== -1) {
        allPaths[previousIndex] = path
      }

      setState({ action, location })
    })
  }

  const go = (n: number) => {
    warnIf(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser')

    globalHistory.go(n)
  }

  const goBack = () => {
    go(-1)
  }

  const goForward = () => {
    go(1)
  }

  const checkDOMListeners = (window: Window, delta: number) => {
    listenerCount += delta

    if (listenerCount === 1) {
      window.addEventListener(HashChangeEvent, handleHashChange)
    } else if (listenerCount === 0) {
      window.removeEventListener(HashChangeEvent, handleHashChange)
    }
  }

  const block = (prompt: string | Prompt | null) => {
    const unblock = transitionManager.setPrompt(prompt)

    if (!isBlocked) {
      checkDOMListeners(win, 1)
      isBlocked = true
    }

    return () => {
      if (isBlocked) {
        isBlocked = false
        checkDOMListeners(win, -1)
      }

      unblock()
    }
  }

  const listen = (listener: Listener) => {
    const unlisten = transitionManager.appendListener(listener)
    checkDOMListeners(win, 1)

    return () => {
      checkDOMListeners(win, -1)
      unlisten()
    }
  }

  const history: RouterHistory = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref,
    push,
    replace,
    go,
    goBack,
    goForward,
    block,
    listen,
    win,
  }

  return history
}
