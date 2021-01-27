import { eventBus } from '..'
import { hasExpression, resolveExpression } from '../data/expression-evaluator'
import { MatchResults, RouteViewOptions, ROUTE_EVENTS } from './interfaces'
import { RouterService } from './router'
import { isAbsolute } from './utils/location-utils'
import { matchesAreEqual } from './utils/match-path'

export class Route {
  private readonly subscription: () => void
  public match: MatchResults | null = null
  public scrollOnNextRender = false
  public previousMatch: MatchResults | null = null

  constructor(
    public router: RouterService,
    public routeElement: HTMLElement,
    public path: string,
    private exact: boolean = true,
    public pageTitle: string = '',
    public transition: string | null = null,
    public scrollTopOffset: number = 0,
    matchSetter: (m: MatchResults | null) => void = () => {},
  ) {
    this.subscription = eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
      this.previousMatch = this.match
      this.match = router.matchPath({
        path: this.path,
        exact: this.exact,
        strict: true,
      })
      matchSetter(this.match)
    })
    this.match = this.router.matchPath({
      path: this.path,
      exact: this.exact,
      strict: true,
    })
    matchSetter(this.match)
  }

  normalizeChildUrl(childUrl: string) {
    if (isAbsolute(childUrl)) return childUrl
    return this.router.normalizeChildUrl(childUrl, this.path)
  }

  async loadCompleted() {
    let routeViewOptions: RouteViewOptions = {}

    if (this.router.history && this.router.history.location.hash) {
      routeViewOptions = {
        scrollToId: this.router.history.location.hash.slice(1),
      }
    } else if (this.scrollTopOffset) {
      routeViewOptions = {
        scrollTopOffset: this.scrollTopOffset,
      }
    }

    // If this is an independent route and it matches then routes have updated.
    // If the only change to location is a hash change then do not scroll.
    if (this.match?.isExact) {
      if (!matchesAreEqual(this.match, this.previousMatch) && this.router.viewsUpdated) {
        this.router.viewsUpdated(routeViewOptions)
      }

      await this.adjustTitle()
    }
  }

  public captureInnerLinks(root?: HTMLElement) {
    this.router.captureInnerLinks(root || this.routeElement, this.path)
  }

  public async adjustTitle() {
    if (this.routeElement.ownerDocument) {
      if (this.pageTitle) {
        let { pageTitle } = this
        if (hasExpression(this.pageTitle)) {
          pageTitle = await resolveExpression(this.pageTitle)
        }

        this.routeElement.ownerDocument.title = `${pageTitle} | ${
          this.router.appTitle || this.routeElement.ownerDocument.title
        }`
      } else if (this.router.appTitle) {
        this.routeElement.ownerDocument.title = `${this.router.appTitle}`
      }
    }
  }

  goToRoute(path: string) {
    const route = !isAbsolute(path) ? this.router.resolvePathname(path, this.path) : path
    this.router.goToRoute(route)
  }

  public destroy() {
    this.subscription()
  }
}
