import { RouteViewOptions, MatchResults, ROUTE_EVENTS } from './interfaces'
import { matchesAreEqual } from './utils/match-path'
import { RouterService } from './router'
import { hasExpression, resolveExpression } from '../data/expression-evaluator'
import { eventBus } from '..'

export class Route {
  private readonly subscription: () => void
  public match: MatchResults
  public scrollOnNextRender = false
  public previousMatch: MatchResults | null = null

  constructor(
    public router: RouterService,
    public routeElement: HTMLElement,
    public path: string,
    exact: boolean,
    public pageTitle: string,
    public transition: string,
    public scrollTopOffset: number,
    matchSetter: (m: MatchResults) => void,
  ) {
    this.subscription = eventBus.on(ROUTE_EVENTS.RouteChanged, async () => {
      this.previousMatch = this.match
      this.match = this.router?.matchPath({
        path,
        exact,
        strict: true,
      })
      matchSetter(this.match)
    })
  }

  normalizeChildUrl(childUrl: string) {
    return this.router.normalizeChildUrl(childUrl, this.path)
  }

  async loadCompleted() {
    let routeViewOptions: RouteViewOptions = {}

    if (this.router?.history && this.router?.history.location.hash) {
      routeViewOptions = {
        scrollToId: this.router?.history.location.hash.slice(1),
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

  private async adjustTitle() {
    if (this.routeElement.ownerDocument) {
      if (this.pageTitle) {
        let { pageTitle } = this
        if (hasExpression(this.pageTitle)) {
          pageTitle = await resolveExpression(this.pageTitle)
        }

        this.routeElement.ownerDocument.title = `${pageTitle} | ${this.router.appTitle || ''}`
      } else if (this.router.appTitle) {
        this.routeElement.ownerDocument.title = `${this.router.appTitle}`
      }
    }
  }

  public destroy() {
    this.subscription()
  }
}
