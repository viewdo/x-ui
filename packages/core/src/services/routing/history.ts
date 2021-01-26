import { warnIf } from '../logging';
import { Listener } from './../actions/interfaces';
import { HistoryType, LocationSegments } from './interfaces';
import { ScrollHistory } from './scroll-history';
import { createKey, createLocation, getUrl, locationsAreEqual } from './utils/location-utils';
import { addLeadingSlash, createPath, hasBasename, stripBasename } from './utils/path-utils';

const KeyLength = 6

// const supportsPopStateOnHashChange = (nav: Navigator) => !nav.userAgent.includes('Trident')

// const supportsGoWithoutReloadUsingHash = (nav: Navigator) => !nav.userAgent.includes('Firefox')

const isExtraneousPopstateEvent = (nav: Navigator, event: any) =>
  event.state === undefined && !nav.userAgent.includes('CriOS')

export class HistoryService {
  listeners: Listener[] = []
  get length() {
    return this.history.length
  }
  location: LocationSegments
  allKeys: string[] = []
  scrollHistory: ScrollHistory

  private get supportsHistory() {
    return this.win.history && 'pushState' in this.win.history
  }

  constructor(
    public win: Window,
    private type: HistoryType,
    private basename: string,
    private history: History = win.history) {

    this.location = this.getDOMLocation(this.getHistoryState())
    this.allKeys.push(this.location.key)
    this.scrollHistory = new ScrollHistory(win)

    if (this.type == HistoryType.Hash) {
      this.win.addEventListener('hashchange', () => {
        this.handleHashChange();
      });
      const pathTest = this.getHashPath()
      const encodedPathTest = addLeadingSlash(pathTest)

      if (pathTest !== encodedPathTest) {
        this.replaceHashPath(encodedPathTest)
      }
      this.push(encodedPathTest)
    } else {
      this.win.addEventListener('popstate', (e) => {
        this.handlePopState(e);
      })
      this.push(this.location.pathname)
    }


  }

  private getHistoryState ()  {
    try {
      return this.win.history.state || {}
    } catch {
      // IE 11 sometimes throws when accessing window.history.state
      // See https://github.com/ReactTraining/history/pull/289
      return {}
    }
  }

  public getDOMLocation(historyState: any) {
    const { key, state } = historyState || {}
    const { pathname, search, hash } = this.win.location

    let path = pathname + search + hash

    warnIf(
      !hasBasename(path, this.basename),
      `You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "${path}" to begin with "${this.basename}".`,
    )

    if (this.basename) {
      path = stripBasename(path, this.basename)
    }

    return createLocation(path, state, key || createKey(6))
  }

  createHref(location: LocationSegments) {
    if (this.type == HistoryType.Browser)
      return getUrl(createPath(location), this.basename)
    return `${this.basename}/#${addLeadingSlash(createPath(location))}`
  }

  setState(action: string, location: LocationSegments) {
    // Capture location for the view before changing history.
    this.scrollHistory.capture(this.location.key)

    this.location = location

    // Set scroll position based on its previous storage value
    this.location.scrollPosition = this.scrollHistory.get(this.location.key)

    this.notifyListeners(this.location, action)
  }

  handlePopState(event: any) {
    // Ignore extraneous popstate events in WebKit.
    if (!isExtraneousPopstateEvent(this.win.navigator, event)) {
      this.handlePop(this.getDOMLocation(event.state))
    }
  }

  handleHashChange() {
    const path = this.getHashPath()
    const encodedPath = addLeadingSlash(path)

    if (path === encodedPath) {
      const location = this.getDOMLocation(this.getHistoryState())
      const previousLocation = this.location

      if (locationsAreEqual(previousLocation, location)) {
        return // A hashchange doesn't always == location change.
      }

      this.handlePop(location)
    } else {
      // Ensure we always have a properly-encoded hash.
      this.replaceHashPath(encodedPath)
    }
  }

  getHashPath () {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    const { href } = this.win.location
    const hashIndex = href.indexOf('#')
    return hashIndex === -1 ? '' : href.slice(Math.max(0, hashIndex + 1))
  }

  pushHashPath (path: string) {
    this.win.location.hash = path
  }

  handlePop (location: LocationSegments)  {
    this.setState('POP', location)
  }

  replaceHashPath (path: string) {
    const hashIndex = this.win.location.href.indexOf('#')
    this.win.location.replace(`${this.win.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0)}#${path}`)
  }

  push(url: string, state: any = {}) {
    if (this.type == HistoryType.Browser) {
      this.pushBrowser(url, state)
    } else {
      this.pushHash(url)
    }
  }

  private pushHash (url: string) {
    const action = 'PUSH'
    const location = createLocation(url, undefined, createKey(KeyLength), this.location)

    const path = createPath(location)
    const encodedPath = addLeadingSlash(this.basename + path)
    const hashChanged = this.getHashPath() !== encodedPath

    if (hashChanged) {
      this.pushHashPath(encodedPath)

      const previousIndex = this.allKeys.lastIndexOf(createPath(this.location))
      const nextPaths = this.allKeys.slice(0, previousIndex === -1 ? 0 : previousIndex + 1)

      nextPaths.push(path)
      this.allKeys = nextPaths

      this.setState(action, location)
    } else {
      warnIf(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack')
      this.setState(action, location)
    }
  }

  private pushBrowser (path: string, state: any = {}) {
    const action = 'PUSH'
    const location = createLocation(path, state, createKey(KeyLength), this.location)

    const href = this.createHref(location)
    const { key } = location

    if (this.supportsHistory) {
      this.history.pushState({ key, state }, '', href)

      const previousIndex = this.allKeys.indexOf(this.location.key)
      const nextKeys = this.allKeys.slice(0, previousIndex === -1 ? 0 : previousIndex + 1)

      nextKeys.push(location.key)
      this.allKeys = nextKeys

      this.setState(action, location)

    } else {
      warnIf(state !== undefined, 'Browser history cannot push state in browsers that do not support HTML5 history')
      this.win.location.href = href
    }
  }

  replace(url: string, state: any = {}) {
    if (this.type == HistoryType.Browser) {
      this.replaceBrowser(url, state)
    } else {
      this.replaceHash(url)
    }
  }

  replaceHash(url: string) {
    const action = 'REPLACE'
    const location = createLocation(url, undefined, createKey(KeyLength), this.location)

    const path = createPath(location)
    const encodedPath = addLeadingSlash(this.basename + path)
    const hashChanged = this.getHashPath() !== encodedPath

    if (hashChanged) {
      this.replaceHashPath(encodedPath)
    }

    const previousIndex = this.allKeys.indexOf(createPath(this.location))

    if (previousIndex !== -1) {
      this.allKeys[previousIndex] = path
    }

    this.setState(action, location)
  }

  replaceBrowser(path: string, state: any = {}) {
    const action = 'REPLACE'
    const location = createLocation(path, state, createKey(KeyLength), this.location)

    const href = this.createHref(location)
    const { key } = location

    this.history.replaceState({ key, state }, '', href)
    const previousIndex = this.allKeys.indexOf(this.location.key)

    if (previousIndex !== -1) {
      this.allKeys[previousIndex] = location.key
    }

    this.setState(action, location)
  }

  go (n: number) {
    this.history.go(n)
  }

  goBack () {
    this.go(-1)
  }

  goForward() {
    this.go(1)
  }

  listen (listener: Listener){
    return this.appendListener(listener)
  }

  private appendListener(fn: Listener) {
    let isActive = true

    const listener = (...args: any[]) => {
      if (isActive) {
        fn(...args)
      }
    }

    listener(this.location)
    this.listeners.push(listener)

    return () => {
      isActive = false
      this.listeners = this.listeners.filter((item) => item !== listener)
    }
  }

  notifyListeners(...args: any[]) {
    this.listeners.forEach((listener) => listener(...args))
  }

  destroy() {
    this.listeners = []
  }

}
