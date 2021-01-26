import { RafCallback } from '@stencil/core/internal'
import { captureElementsEventOnce, debugIf, interfaceState } from '..'
import { EventAction, IEventEmitter } from '../actions'
import { addDataProvider } from '../data/providers/factory'
import { RoutingDataProvider } from './data-provider'
import { HistoryService } from './history'
import {
  HistoryType,
  LocationSegments,
  MatchOptions,
  MatchResults,
  NavigateNext,
  NavigateTo,
  RouteViewOptions,
  ROUTE_COMMANDS,
  ROUTE_EVENTS,
  ROUTE_TOPIC,
} from './interfaces'
import { Route } from './route'
import { isAbsolute, resolvePathname } from './utils/location-utils'
import { matchPath } from './utils/match-path'
import { ensureBasename } from './utils/path-utils'

export class RouterService {
  public location!: LocationSegments
  private readonly removeHandler!: () => void
  private readonly removeSubscription!: () => void

  constructor(
    private win: Window,
    private readonly writeTask: (t: RafCallback) => void,
    private readonly events: IEventEmitter,
    private readonly actions: IEventEmitter,
    private historyType: HistoryType = HistoryType.Browser,
    private root: string = '',
    public appTitle?: string,
    public transition?: string,
    public scrollTopOffset = 0,
    public readonly history: HistoryService = new HistoryService(win, historyType, root, win.history),
  ) {
    this.removeHandler = this.history.listen((location: LocationSegments) => {
      this.location = location
      this.events.emit(ROUTE_EVENTS.RouteChanged, location)
    })

    this.removeSubscription = this.actions.on(ROUTE_TOPIC, (e) => {
      this.handleEventAction(e)
    })

    this.location = this.history.location

    addDataProvider('route', new RoutingDataProvider((key: string) => this.location?.params[key]))

    addDataProvider('query', new RoutingDataProvider((key: string) => this.location?.query[key]))

    this.events.emit(ROUTE_EVENTS.RouteChanged, this.location)
  }

  handleEventAction(eventAction: EventAction<NavigateTo | NavigateNext>) {
    debugIf(interfaceState.debug, `router-service: action received ${JSON.stringify(eventAction)}`)

    switch (eventAction.command) {
      case ROUTE_COMMANDS.NavigateNext: {
        this.goToParentRoute()
        break
      }
      case ROUTE_COMMANDS.NavigateTo: {
        const { url } = eventAction.data as NavigateTo
        this.goToRoute(url)
        break
      }
      case ROUTE_COMMANDS.NavigateBack: {
        this.goBack()
        break
      }
    }
  }

  viewsUpdated = (options: RouteViewOptions = {}) => {
    if (options.scrollToId && this.historyType === 'browser') {
      const elm = this.win.document.querySelector('#' + options.scrollToId)
      if (elm) {
        elm.scrollIntoView()
        return
      }
    }
    this.scrollTo(options.scrollTopOffset || this.scrollTopOffset)
  }

  goBack() {
    this.history.goBack()
  }

  goToParentRoute() {
    const parentSegments = this.history.location.pathParts?.slice(0, -1)
    if (parentSegments) {
      this.goToRoute(parentSegments.join('/'))
    } else {
      this.goBack()
    }
  }

  scrollTo(scrollToLocation: number) {
    if (Array.isArray(this.history.location.scrollPosition)) {
      if (this.history?.location && Array.isArray(this.history.location.scrollPosition)) {
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
    const route = isAbsolute(path) ? path : this.resolvePathname(path, this.location?.pathname)
    this.history.push(route)
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
      `a`,
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
    this.goToRoute(route)
  }

  destroy() {
    this.events.removeAllListeners()
    this.removeHandler()
    this.removeSubscription()
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
