import { RafCallback } from '@stencil/core/internal';
import { captureElementsEventOnce, debugIf, interfaceState } from '..';
import { EventAction, IEventEmitter } from '../actions';
import { addDataProvider } from '../data/providers/factory';
import { RoutingDataProvider } from './data-provider';
import { createBrowserHistory } from './factories/browser-history';
import { createHashHistory } from './factories/hash-history';
import {
  HistoryType,
  LocationSegments,
  MatchOptions,
  MatchResults,
  NavigateNext,
  NavigateTo,
  RouterHistory,
  RouteViewOptions,
  ROUTE_COMMANDS,
  ROUTE_EVENTS,
  ROUTE_TOPIC
} from './interfaces';
import { Route } from './route';
import { getLocation, getUrl, isAbsolute, resolvePathname } from './utils/location-utils';
import { matchPath } from './utils/match-path';

const HISTORIES: { [key in HistoryType]: (win: Window) => RouterHistory } = {
  browser: createBrowserHistory,
  hash: createHashHistory,
}

export class RouterService {
  location?: LocationSegments
  history: RouterHistory
  private readonly removeHandler!: () => void
  private readonly removeSubscription!: () => void

  constructor(
    private readonly writeTask: (t: RafCallback) => void,
    private readonly events: IEventEmitter,
    private readonly actions: IEventEmitter,
    public rootElement: HTMLElement,
    public historyType: HistoryType,
    public root: string,
    public appTitle: string | undefined,
    public transition?: string,
    public scrollTopOffset = 0,
  ) {
    this.history = HISTORIES[historyType]((rootElement.ownerDocument as any).defaultView)
    if (!this.history) {
      return
    }

    this.removeHandler = this.history.listen((location: LocationSegments) => {
      const newLocation = getLocation(location, root)
      this.history.location = newLocation
      this.location = newLocation
      writeTask(() => this.events.emit(ROUTE_EVENTS.RouteChanged, newLocation))
    })

    this.removeSubscription = this.actions.on(ROUTE_TOPIC, (e) => {
      this.handleEvent(e)
    })

    this.location = getLocation(this.history.location, root)

    addDataProvider('route', new RoutingDataProvider((key: string) => this.location?.params[key]))

    addDataProvider('query', new RoutingDataProvider((key: string) => this.location?.query[key]))

    this.events.emit(ROUTE_EVENTS.RouteChanged, this.location)
  }

  handleEvent(actionEvent: EventAction<NavigateTo | NavigateNext>) {
    debugIf(interfaceState.debug, `router-service: action received ${JSON.stringify(actionEvent)}`)

    if (actionEvent.command === ROUTE_COMMANDS.NavigateNext) {
      this.goToParentRoute()
    } else if (actionEvent.command === ROUTE_COMMANDS.NavigateTo) {
      const { url } = actionEvent.data as NavigateTo
      this.goToRoute(url)
    } else if (actionEvent.command === ROUTE_COMMANDS.NavigateBack) {
      this.history.goBack()
    }
  }

  viewsUpdated = (options: RouteViewOptions = {}) => {
    if (this.history && options.scrollToId && this.historyType === 'browser') {
      const elm = this.history?.win.document.querySelector('#' + options.scrollToId)
      if (elm) {
        elm.scrollIntoView()
        return
      }
    }

    this.scrollTo(options.scrollTopOffset || this.scrollTopOffset)
  }

  goToParentRoute() {
    const { history } = this
    if (!history) {
      return
    }

    const parentSegments = history.location?.pathParts?.slice(0, -1)
    if (parentSegments) {
      this.history?.push(parentSegments.join('/'))
    } else {
      history.goBack()
    }
  }

  scrollTo(scrollToLocation?: number) {
    const { history } = this
    if (!history) {
      return
    }

    if (scrollToLocation === null || !history) {
      return
    }

    if (history.action === 'POP' && Array.isArray(history.location.scrollPosition)) {
      if (history?.location && Array.isArray(history.location.scrollPosition)) {
        history.win.scrollTo(history.location.scrollPosition[0], history.location.scrollPosition[1])
      }

      return
    }

    // Okay, the frame has passed. Go ahead and render now
    this.writeTask(() => {
      history.win.scrollTo(0, scrollToLocation || 0)
    })
  }

  goToRoute(path: string) {
    const route = isAbsolute(path) ? path
      : this.resolvePathname(path, this.location?.pathname)
    this.history?.push(this.getUrl(route));
  }

  matchPath(options: MatchOptions = {}): MatchResults | null {
    if (!this.location) {
      return null
    }
    return matchPath(this.location, options)
  }

  getUrl(url: string, root?: string) {
    return getUrl(url, root || this.root)
  }

  resolvePathname(url: string, parentUrl?: string) {
    return resolvePathname(url, parentUrl || this.location?.pathname)
  }

  normalizeChildUrl(childUrl: string, parentUrl: string) {
    let normalizedUrl = childUrl
    if (!childUrl.startsWith(parentUrl)) {
      normalizedUrl = `${parentUrl}/${childUrl}`
    }

    const path = normalizedUrl.replace('//', '/')
    return (path.endsWith('/')) ? path.slice(0, path.length-1): path
  }

  isModifiedEvent(ev: MouseEvent) {
    return ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey
  }

  captureInnerLinks(root?:HTMLElement, fromPath?: string) {
    captureElementsEventOnce<HTMLAnchorElement, MouseEvent>(
      root || this.rootElement,
      `a`,
      'click',
      (el: HTMLAnchorElement, ev: MouseEvent) => {
        if (this.isModifiedEvent(ev) || !this?.history) return true

        if (!el.href.includes(location.origin) || el.target) return true

        ev.preventDefault()
        const path = el.href.replace(location.origin, '')
        return this.handleRouteLinkClick(path, fromPath)
      })
  }

  handleRouteLinkClick(toPath:string, fromPath?: string) {
    const route = isAbsolute(toPath) ? toPath : this.normalizeChildUrl(toPath, fromPath || '/')
    this.goToRoute(route)
  }

  destroy() {
    this.events.removeAllListeners()
    this.removeHandler()
    this.removeSubscription()
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
