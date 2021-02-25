import { RafCallback } from '@stencil/core/internal'
import { captureElementsEventOnce } from '..'
import { IEventEmitter } from '../actions'
import { addDataProvider } from '../data/providers/factory'
import { NavigationActionListener } from '../navigation/action-listener'
import { RoutingDataProvider } from './data-provider'
import { HistoryService } from './history'
import { LocationSegments, MatchOptions, MatchResults, RouteViewOptions } from './interfaces'
import { Route } from './route'
import { isAbsolute, locationsAreEqual, resolvePathname } from './utils/location-utils'
import { matchPath } from './utils/match-path'
import { addLeadingSlash, ensureBasename, stripBasename } from './utils/path-utils'

export class RouterService {
  public location!: LocationSegments
  private readonly removeHandler!: () => void
  private listener!: NavigationActionListener
  public history: HistoryService

  constructor(
    private win: Window,
    private readonly writeTask: (t: RafCallback) => void,
    events: IEventEmitter,
    actions: IEventEmitter,
    public root: string = '',
    public appTitle: string = '',
    public transition: string = '',
    public scrollTopOffset = 0,
    private useHash = false,
  ) {
    this.history = new HistoryService(win, root, useHash)
    this.listener = new NavigationActionListener(this, events, actions)

    this.removeHandler = this.history.listen((location: LocationSegments) => {
      if (this.location) {
        if (!locationsAreEqual(this.location, location)) {
          this.location = location
          this.listener.notifyRouteChanged(location)
        }
      } else {
        this.location = location
        this.listener.notifyRouteChanged(location)
      }
    })

    this.location = this.history.location
    this.listener.notifyRouteChanged(this.location)

    addDataProvider('route', new RoutingDataProvider((key: string) => this.location?.params[key]))
    addDataProvider('query', new RoutingDataProvider((key: string) => this.location?.query[key]))
  }

  viewsUpdated(options: RouteViewOptions = {}) {
    if (options.scrollToId) {
      const elm = this.win.document.querySelector('#' + options.scrollToId)
      if (elm) {
        elm.scrollIntoView()
        return
      }
    }
    this.scrollTo(options.scrollTopOffset || this.scrollTopOffset)
  }

  finalize(startUrl: string) {
    if (startUrl && startUrl.length > 1 && this.location?.pathname === '/') {
      this.goToRoute(startUrl)
    }
  }

  goBack() {
    this.history.goBack()
  }

  goToParentRoute() {
    const parentSegments = this.history.location.pathParts?.slice(0, -1)
    if (parentSegments) {
      this.goToRoute(addLeadingSlash(parentSegments.join('/')))
    } else {
      this.goBack()
    }
  }

  scrollTo(scrollToLocation: number) {
    if (Array.isArray(this.history.location.scrollPosition)) {
      if (this.history.location && Array.isArray(this.history.location.scrollPosition)) {
        this.win.scrollTo(this.history.location.scrollPosition[0], this.history.location.scrollPosition[1])
      }
      return
    }

    // Okay, the frame has passed. Go ahead and render now
    this.writeTask(() => {
      this.win.scrollTo(0, scrollToLocation || 0)
    })
  }

  goToRoute(path: string) {
    this.history.push(stripBasename(path, this.root, this.useHash))
  }

  matchPath(options: MatchOptions = {}): MatchResults | null {
    return matchPath(this.location, options)
  }

  resolvePathname(url: string, parentUrl?: string) {
    return resolvePathname(url, parentUrl || this.location.pathname)
  }

  normalizeChildUrl(childUrl: string, parentUrl: string) {
    return ensureBasename(childUrl, parentUrl)
  }

  isModifiedEvent(ev: MouseEvent) {
    return ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey
  }

  captureInnerLinks(root: HTMLElement, fromPath?: string) {
    captureElementsEventOnce<HTMLAnchorElement, MouseEvent>(
      root,
      `a[href]`,
      'click',
      (el: HTMLAnchorElement, ev: MouseEvent) => {
        if (this.isModifiedEvent(ev) || !this?.history) return true

        if (!el.href.includes(location.origin) || el.target) return true

        ev.preventDefault()
        const path = el.href.replace(location.origin, '')
        return this.handleRouteLinkClick(path, fromPath)
      },
    )
  }

  handleRouteLinkClick(toPath: string, fromPath?: string) {
    const route = isAbsolute(toPath) ? toPath : this.normalizeChildUrl(toPath, fromPath || '/')
    if (fromPath && route.startsWith(fromPath) && route.includes('#')) {
      const elId = toPath.substr(toPath.indexOf('#'))
      this.win.document?.querySelector(elId)?.scrollIntoView({
        behavior: 'smooth',
      })
      return
    }
    this.goToRoute(route)
  }

  destroy() {
    this.removeHandler()
    this.listener.destroy()
    this.history.destroy()
  }

  createRoute(
    routeElement: HTMLElement,
    path: string,
    exact: boolean,
    pageTitle: string,
    transition: string | null,
    scrollTopOffset: number,
    matchSetter: (m: MatchResults | null) => void,
  ) {
    return new Route(this, routeElement, path, exact, pageTitle, transition, scrollTopOffset, matchSetter)
  }
}
