import { ActionActivationStrategy, eventBus } from '../actions';
import { hasToken, resolveTokens } from '../data';
import { resolveChildElementXAttributes } from '../elements';
import { MatchResults, RouteViewOptions, ROUTE_EVENTS } from './interfaces';
import { RouterService } from './router';
import { isAbsolute } from './utils/location';
import { matchesAreEqual } from './utils/path-match';

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

  public normalizeChildUrl(childUrl: string) {
    if (isAbsolute(childUrl)) return childUrl
    return this.router.normalizeChildUrl(childUrl, this.path)
  }

  public didExit() {
    return !!this.match?.isExact && !matchesAreEqual(this.match, this.previousMatch)
  }

  public async loadCompleted() {
    this.adjustClasses()

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
    await this.adjustTitle()

    // If this is an independent route and it matches then routes have updated.
    // If the only change to location is a hash change then do not scroll.
    if (this.match?.isExact) {
      if (!matchesAreEqual(this.match, this.previousMatch)) {
        this.captureInnerLinks()
        await resolveChildElementXAttributes(this.routeElement)
        this.routeElement.querySelectorAll('[no-render]').forEach((el: any) => {
          el.removeAttribute('no-render')
        })
        this.router.viewsUpdated(routeViewOptions)
      }
    }
  }

  toggleClass(className: string, force: boolean) {
    const exists = this.routeElement.classList.contains(className)
    if (exists && force == false) this.routeElement.classList.remove(className)
    if (!exists && force) this.routeElement.classList.add(className)
  }

  private adjustClasses() {
    const match = this.match != null
    const exact = this.match?.isExact || false
    if (this.transition) {
      this.transition.split(' ').forEach((t) => {
        this.toggleClass(t, match)
      })
    }

    this.toggleClass('active-route', match)
    this.toggleClass('active-route-exact', exact)
  }

  public captureInnerLinks(root?: HTMLElement) {
    this.router.captureInnerLinks(root || this.routeElement, this.path)
  }

  public async adjustTitle() {
    if (this.routeElement.ownerDocument) {
      if (this.pageTitle) {
        let { pageTitle } = this
        if (hasToken(this.pageTitle)) {
          pageTitle = await resolveTokens(this.pageTitle)
        }

        this.routeElement.ownerDocument.title = `${pageTitle} | ${
          this.router.appTitle || this.routeElement.ownerDocument.title
        }`
      } else if (this.router.appTitle) {
        this.routeElement.ownerDocument.title = `${this.router.appTitle}`
      }
    }
  }

  public goToRoute(path: string) {
    const route = !isAbsolute(path) ? this.router.resolvePathname(path, this.path) : path
    this.router.goToRoute(route)
  }

  public async activateActions(
    actionActivators: HTMLXActionActivatorElement[],
    forEvent: ActionActivationStrategy,
    filter: (activator: HTMLXActionActivatorElement) => boolean = (_a) => true,
  ) {
    await Promise.all(
      actionActivators
        .filter((activator) => activator.activate === forEvent)
        .filter(filter)
        .map(async (activator) => {
          await activator.activateActions()
        }),
    )
  }

  public destroy() {
    this.subscription()
  }
}
