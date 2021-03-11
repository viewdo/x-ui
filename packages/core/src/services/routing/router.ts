import { RafCallback } from '@stencil/core/internal'
import { ROUTE_EVENTS } from '../../services/routing/interfaces'
import { IEventEmitter } from '../common/interfaces'
import { addDataProvider } from '../data/factory'
import { NavigationActionListener } from '../navigation/actions'
import { captureElementsEventOnce } from '../navigation/elements'
import { HistoryService } from './history'
import {
  LocationSegments,
  MatchOptions,
  MatchResults,
  RouteViewOptions,
} from './interfaces'
import { RoutingDataProvider } from './provider'
import { Route } from './route'
import {
  isAbsolute,
  locationsAreEqual,
  resolvePathname,
} from './utils/location'
import {
  addLeadingSlash,
  ensureBasename,
  hasBasename,
  isFilename,
  stripBasename,
} from './utils/path'
import { matchPath } from './utils/path-match'

export class RouterService {
  public location!: LocationSegments
  private readonly removeHandler!: () => void
  private listener!: NavigationActionListener
  public history: HistoryService
  public routes: { [index: string]: Route } = {}
  constructor(
    private win: Window,
    private readonly writeTask: (t: RafCallback) => void,
    private eventBus: IEventEmitter,
    actions: IEventEmitter,
    public root: string = '',
    public appTitle: string = '',
    public transition: string = '',
    public scrollTopOffset = 0,
  ) {
    this.history = new HistoryService(win, root)
    this.listener = new NavigationActionListener(
      this,
      eventBus,
      actions,
    )

    this.removeHandler = this.history.listen(
      (location: LocationSegments) => {
        if (this.location) {
          if (!locationsAreEqual(this.location, location)) {
            this.location = location
            this.listener.notifyRouteChanged(location)
          }
        } else {
          this.location = location
          this.listener.notifyRouteChanged(location)
        }
      },
    )

    this.location = this.history.location
    this.listener.notifyRouteChanged(this.location)

    addDataProvider(
      'route',
      new RoutingDataProvider(
        (key: string) => this.location?.params[key],
      ),
    )
    addDataProvider(
      'query',
      new RoutingDataProvider(
        (key: string) => this.location?.query[key],
      ),
    )
  }

  adjustRootViewUrls(url: string): string {
    let stripped =
      this.root && hasBasename(url, this.root)
        ? url.slice(this.root.length)
        : url
    if (isFilename(this.root)) {
      return '#' + addLeadingSlash(stripped)
    }
    return addLeadingSlash(stripped)
  }

  viewsUpdated(options: RouteViewOptions = {}) {
    if (options.scrollToId) {
      const elm = this.win.document.querySelector(
        '#' + options.scrollToId,
      )
      if (elm) {
        elm.scrollIntoView()
        return
      }
    }
    this.scrollTo(options.scrollTopOffset || this.scrollTopOffset)
  }

  finalize(startUrl: string) {
    if (
      startUrl &&
      startUrl.length > 1 &&
      this.location?.pathname === '/'
    ) {
      this.replaceWithRoute(stripBasename(startUrl, this.root))
    }
    this.eventBus.emit(ROUTE_EVENTS.Finalized, {})
  }

  goBack() {
    this.location.pathname = this.history.previousLocation.pathname
    this.history.goBack()
  }

  goToParentRoute() {
    const parentSegments = this.history.location.pathParts?.slice(
      0,
      -1,
    )
    if (parentSegments) {
      this.goToRoute(addLeadingSlash(parentSegments.join('/')))
    } else {
      this.goBack()
    }
  }

  scrollTo(scrollToLocation: number) {
    if (Array.isArray(this.history.location.scrollPosition)) {
      if (
        this.history.location &&
        Array.isArray(this.history.location.scrollPosition)
      ) {
        this.win.scrollTo(
          this.history.location.scrollPosition[0],
          this.history.location.scrollPosition[1],
        )
      }
      return
    }

    // Okay, the frame has passed. Go ahead and render now
    this.writeTask(() => {
      this.win.scrollTo(0, scrollToLocation || 0)
    })
  }

  goToRoute(path: string) {
    const pathName = resolvePathname(path, this.location.pathname)
    this.location.pathname = pathName
    this.history.push(pathName)
  }

  replaceWithRoute(path: string) {
    const newPath = resolvePathname(path, this.location.pathname)
    this.location.pathname = newPath
    this.history.replace(newPath)
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

  public async adjustTitle(title: string) {
    let pageTitle = title
    if (this.win.document) {
      if (pageTitle) {
        this.win.document.title = `${pageTitle} | ${
          this.appTitle || this.win.document.title
        }`
      } else if (this.appTitle) {
        this.win.document.title = `${this.appTitle}`
      }
    }
  }

  captureInnerLinks(root: HTMLElement, fromPath?: string) {
    captureElementsEventOnce<HTMLAnchorElement, MouseEvent>(
      root,
      `a[href]`,
      'click',
      (el: HTMLAnchorElement, ev: MouseEvent) => {
        if (this.isModifiedEvent(ev) || !this?.history) return true

        if (!el.href.includes(location.origin) || el.target)
          return true

        ev.preventDefault()

        const path = el.href.replace(location.origin, '')
        return this.handleRouteLinkClick(
          path,
          fromPath || this.location.pathname,
        )
      },
    )
  }

  get exactRoutes() {
    return Object.keys(this.routes).filter(
      r => this.routes[r].match?.isExact,
    )
  }

  handleRouteLinkClick(toPath: string, fromPath?: string) {
    const route = isAbsolute(toPath)
      ? toPath
      : this.normalizeChildUrl(toPath, fromPath || '/')
    if (
      fromPath &&
      route.startsWith(fromPath) &&
      route.includes('#')
    ) {
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
    const route = new Route(
      this.eventBus,
      this,
      routeElement,
      path,
      exact,
      pageTitle,
      transition,
      scrollTopOffset,
      matchSetter,
      (self: Route) => {
        delete this.routes[self.path]
      },
    )
    this.routes[route.path] = route
    return route
  }
}
