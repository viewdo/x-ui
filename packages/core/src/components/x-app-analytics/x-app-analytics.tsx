import { Component, Event, EventEmitter } from '@stencil/core';
import { actionBus, eventBus } from '../../services/actions';
import { AnalyticsActionListener } from '../../services/analytics/action-listener';
import { LocationSegments } from '../../services/routing/interfaces';

/**
 *
 * @system analytics
 */
@Component({
  tag: 'x-app-analytics',
  shadow: false,
})
export class XAppAnalytics {
  private listener!: AnalyticsActionListener

  /**
   * Raised analytics events.
   */
  @Event({
    eventName: 'x:analytics:event',
    composed: false,
    cancelable: false,
    bubbles: false,
  }) event!: EventEmitter<any>


  /**
   * Page views.
   */
  @Event({
    eventName: 'page-view',
    composed: false,
    cancelable: false,
    bubbles: false,
  }) pageView!: EventEmitter<any>

  /**
   * View percentage views.
   */
  @Event({
    eventName: 'x:analytics:view-percentage',
    composed: false,
    cancelable: false,
    bubbles: false,
  }) viewPercentage!: EventEmitter<any>


  componentWillLoad() {
    this.listener = new AnalyticsActionListener(actionBus, eventBus)
    this.listener.handleEvent = (e) => this.event.emit(e)
    this.listener.handlePageView = (e:LocationSegments) =>
      this.pageView.emit(`${e.pathname}?${e.search}`)
    this.listener.handleViewTime = (e) =>
      this.viewPercentage.emit(e)
  }

  disconnectedCallback() {
    this.listener.destroy()
  }


}
