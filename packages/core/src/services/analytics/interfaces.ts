/* istanbul ignore file */

export const ANALYTICS_TOPIC = 'analytics'

export enum ANALYTICS_COMMANDS {
  SendEvent = 'send-event',
  SendViewPercentage = 'send-view-percentage',
  SendPageView = 'send-page-view',
}

export enum ANALYTICS_EVENTS {
  ListenerRegistered = 'listener-registered',
}
