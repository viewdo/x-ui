import { EventAction, IEventEmitter } from '../actions'
import { interfaceState } from '../interface'
import { debugIf } from '../logging'
import { LocationSegments, ROUTE_EVENTS } from '../routing'
import { RouterService } from '../routing/router'
import { NavigateNext, NavigateTo, NAVIGATION_COMMANDS, NAVIGATION_TOPIC } from './interfaces'

export class NavigationActionListener {
  private readonly removeSubscription!: () => void

  constructor(private router: RouterService, private events: IEventEmitter, private actions: IEventEmitter) {
    this.removeSubscription = this.actions.on(NAVIGATION_TOPIC, (e) => {
      this.handleEventAction(e)
    })
  }

  notifyRouteChanged(location: LocationSegments) {
    this.events.emit(ROUTE_EVENTS.RouteChanged, location)
  }

  handleEventAction(eventAction: EventAction<NavigateTo | NavigateNext>) {
    debugIf(interfaceState.debug, `route-listener: action received ${JSON.stringify(eventAction)}`)

    switch (eventAction.command) {
      case NAVIGATION_COMMANDS.GoNext: {
        this.router.goToParentRoute()
        break
      }
      case NAVIGATION_COMMANDS.GoTo: {
        const { url } = eventAction.data as NavigateTo
        this.router.goToRoute(url)
        break
      }
      case NAVIGATION_COMMANDS.GoBack: {
        this.router.goBack()
        break
      }
    }
  }

  destroy() {
    this.removeSubscription()
  }
}
