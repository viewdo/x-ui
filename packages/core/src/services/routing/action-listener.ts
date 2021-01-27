import { EventAction, IEventEmitter } from '../actions'
import { interfaceState } from '../interface'
import { debugIf } from '../logging'
import { LocationSegments, NavigateNext, NavigateTo, ROUTE_COMMANDS, ROUTE_EVENTS, ROUTE_TOPIC } from './interfaces'
import { RouterService } from './router'

export class RoutingActionListener {
  private readonly removeSubscription!: () => void

  constructor(private router: RouterService, private events: IEventEmitter, private actions: IEventEmitter) {
    this.removeSubscription = this.actions.on(ROUTE_TOPIC, (e) => {
      this.handleEventAction(e)
    })
  }

  notifyRouteChanged(location: LocationSegments) {
    this.events.emit(ROUTE_EVENTS.RouteChanged, location)
  }

  handleEventAction(eventAction: EventAction<NavigateTo | NavigateNext>) {
    debugIf(interfaceState.debug, `router-service: action received ${JSON.stringify(eventAction)}`)

    switch (eventAction.command) {
      case ROUTE_COMMANDS.NavigateNext: {
        this.router.goToParentRoute()
        break
      }
      case ROUTE_COMMANDS.NavigateTo: {
        const { url } = eventAction.data as NavigateTo
        this.router.goToRoute(url)
        break
      }
      case ROUTE_COMMANDS.NavigateBack: {
        this.router.goBack()
        break
      }
    }
  }

  destroy() {
    this.removeSubscription()
  }
}
