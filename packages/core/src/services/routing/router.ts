import { RafCallback } from '@stencil/core/internal'
import { EventAction, IEventEmitter } from '../actions'
import { addDataProvider } from '../data/providers/factory'
import { RoutingDataProvider } from './data-provider'
import { createBrowserHistory } from './factories/createBrowserHistory'
import { createHashHistory } from './factories/createHashHistory'
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
  ROUTE_TOPIC,
  ROUTE_EVENTS,
} from './interfaces'
import { getLocation, getUrl } from './utils/location-utils'
import { matchPath } from './utils/match-path'
import { debugIf, interfaceState } from '..'
import { Route } from './route'

const HISTORIES: { [key in HistoryType]: (win: Window) => RouterHistory } = {
  browser: createBrowserHistory,
  hash: createHashHistory,
}

export class RouterService {
  location?: LocationSegments
  history: RouterHistory

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

    this.history.listen((location: LocationSegments) => {
      const newLocation = getLocation(location, root)
      this.history.location = newLocation
      this.location = newLocation

      this.events.emit(ROUTE_EVENTS.RouteChanged, newLocation)
    })

    this.actions.on(ROUTE_TOPIC, (e) => {
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
      this.history.push(url)
    }
  }

  viewsUpdated = (options: RouteViewOptions = {}) => {
    if (this.history && options.scrollToId && this.historyType === 'browser') {
      const elm = this.history?.win.document.getElementById(options.scrollToId)
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

    const parentSegments = history.location?.pathParts?.slice(0, history.location?.pathParts.length - 1)
    if (parentSegments == null) {
      history.goBack()
    } else {
      history.push(parentSegments.join('/'))
    }
  }

  scrollTo(scrollToLocation?: number) {
    const { history } = this
    if (!history) {
      return
    }

    if (scrollToLocation == null || !history) {
      return
    }

    if (history.action === 'POP' && Array.isArray(history.location.scrollPosition)) {
      if (history && history.location && Array.isArray(history.location.scrollPosition)) {
        history.win.scrollTo(history.location.scrollPosition[0], history.location.scrollPosition[1])
      }

      return
    }

    // Okay, the frame has passed. Go ahead and render now
    this.writeTask(() => {
      history.win.scrollTo(0, scrollToLocation)
    })
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

  normalizeChildUrl(childUrl: string, parentUrl: string) {
    let normalizedUrl = childUrl
    if (!childUrl.startsWith(parentUrl)) {
      normalizedUrl = `${parentUrl}/${childUrl}`
    }

    return normalizedUrl.replace('//', '/')
  }

  isModifiedEvent(ev: MouseEvent) {
    return ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey
  }

  destroy() {
    this.events.removeAllListeners()
  }

  createRoute(routeElement: HTMLElement, path: string, exact: boolean, pageTitle: string, transition: string, scrollTopOffset: number, matchSetter: (m: MatchResults) => void) {
    return new Route(this, routeElement, path, exact, pageTitle, transition, scrollTopOffset, matchSetter)
  }
}
