import { Component, Event, EventEmitter } from '@stencil/core';
import { actionBus, eventBus } from '../../services/actions';
import { AnalyticsActionListener } from '../../services/analytics/action-listener';

/**
 *
 * @system analytics
 */
@Component({
  tag: 'x-ui-analytics',
  shadow: false,
})
export class XUiAnalytics {
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
    eventName: 'x:analytics:page-view',
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
    this.listener.handlePageView = (e) => this.pageView.emit(e)
    this.listener.handleViewPercent = (e) => this.viewPercentage.emit(e)
  }

  disconnectedCallback() {
    this.listener.destroy()
  }


}
