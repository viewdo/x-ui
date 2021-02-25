import { EventAction, IEventEmitter } from '../actions'
import { interfaceState } from '../interface'
import { debugIf } from '../logging'
import { LocationSegments } from '../routing/interfaces'
import { ROUTE_EVENTS } from './../routing/interfaces'
import { ANALYTICS_COMMANDS, ANALYTICS_EVENTS, ANALYTICS_TOPIC } from './interfaces'

export class AnalyticsActionListener {
  private readonly removeSubscription: Array<() => void> = []

  constructor(private actions: IEventEmitter, private events: IEventEmitter) {
    this.removeSubscription.push(
      this.actions.on(ANALYTICS_TOPIC, (e) => {
        this.handleEventAction(e)
      }),
    )
    this.removeSubscription.push(
      this.events.on(ROUTE_EVENTS.RouteChanged, (location: LocationSegments) => {
        this.handlePageView(location)
      }),
    )

    this.events.emit(ANALYTICS_EVENTS.ListenerRegistered, this)
  }

  handleEvent: (data: any) => void = (_d) => {}
  handleViewTime: (data: any) => void = (_d) => {}
  handlePageView: (data: any) => void = (_d) => {}

  private handleEventAction(eventAction: EventAction<any>) {
    debugIf(interfaceState.debug, `analytics-listener: action received ${JSON.stringify(eventAction)}`)

    switch (eventAction.command) {
      case ANALYTICS_COMMANDS.SendEvent: {
        this.handleEvent(eventAction.data)
        break
      }
      case ANALYTICS_COMMANDS.SendViewTime: {
        this.handleViewTime(eventAction.data)
        break
      }
      case ANALYTICS_COMMANDS.SendPageView: {
        this.handlePageView(eventAction.data)
        break
      }
    }
  }

  destroy() {
    this.removeSubscription?.forEach((d) => d())
  }
}
