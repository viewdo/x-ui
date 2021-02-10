import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State, writeTask } from '@stencil/core';
import {
  actionBus,
  DataListener,
  debugIf,
  EventAction,
  eventBus,
  IEventActionListener,
  InterfaceActionListener,
  interfaceState,
  LocationSegments,
  log,
  resolveChildElementXAttributes,
  RouterService
} from '../../services';
import { clearDataProviders } from '../../services/data/providers/factory';

/**
 *  @system routing
 */
@Component({
  tag: 'x-ui',
  styleUrl: 'x-ui.scss',
  shadow: true,
})
export class XUI {
  private eventSubscription!: () => void
  private actionsSubscription!: () => void
  private readonly listeners: IEventActionListener[] = []

  @Element() el!: HTMLXUiElement
  @State() location!: LocationSegments

  /**
   * This is the router service instantiated with this
   * component.
   */
  @Prop({ mutable: true }) router!: RouterService

  /**
   * This is the root path that the actual page is,
   * if it isn't '/', then the router needs to know
   * where to begin creating paths.
   */
  @Prop() root:string = ''


  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop() transition?: string

  /**
   * This is the application / site title.
   * If the views or dos have titles,
   * this is added as a suffix.
   */
  @Prop() appTitle?: string

  /**
   * This is the start path a user should
   * land on when they first land on this app.
   */
  @Prop() startUrl = '/'

  /**
   * Turn on debugging to get helpful messages from the
   * routing, data and action systems.
   */
  @Prop() debug = false

  /**
   * Header height or offset for scroll-top on this
   * and all views.
   */
  @Prop() scrollTopOffset?: number

  /**
   * The wait-time, in milliseconds to wait for un-registered data providers
   * found in an expression. This is to accommodate a possible lag between
   * evaluation before the first view-do 'when' predicate an the registration process.
   */
  @Prop() providerTimeout: number = 500

  /**
   * The interval, in milliseconds to use with the element-timer (used in place for a video)
   * when timing animations in  x-view-do elements.
   */
  @Prop() animationInterval: number = 500

  @Listen('x:actions', {
    passive: true,
    target: 'body',
  })
  delegateActionEventFromDOM(ev: CustomEvent<EventAction<any>>) {
    const action = ev.detail
    actionBus.emit(action.topic, action)
  }

  @Listen('swUpdate', { target: 'window' })
  async onServiceWorkerUpdate() {
    const registration = await navigator.serviceWorker.getRegistration()

    if (!registration?.waiting) {
      // If there is no waiting registration, this is the first service
      // worker being installed.
      return
    }

    const refresh = confirm('New Version Available. Reload?')

    if (refresh) {
      registration.waiting.postMessage('skipWaiting')
      location.reload()
    }
  }

  /**
   * These events are **`<x-ui/>`** command-requests for action handlers
   * to perform tasks. Any handles should cancel the event.
   */
  @Event({
    eventName: 'x:actions',
    composed: true,
    cancelable: true,
    bubbles: false,
  }) actions!: EventEmitter

  /**
   * Listen for events that occurred within the **`<x-ui/>`**
   * system.
   */
  @Event({
    eventName: 'x:events',
    composed: true,
    cancelable: false,
    bubbles: true,
  }) events!: EventEmitter

  private get childViews(): HTMLXViewElement[] {
    return Array.from(this.el.querySelectorAll('x-view')||[])
      .filter(e => {
        return e.parentElement?.closest('x-view') == null
      })
  }

  componentWillLoad() {
    interfaceState.debug = this.debug
    interfaceState.animationInterval = this.animationInterval
    interfaceState.providerTimeout = this.providerTimeout

    if (this.debug) {
      log('x-ui: initializing <debug>')
    } else {
      log('x-ui: initializing')
    }

    this.actionsSubscription = actionBus.on('*', (_topic, args) => {
      this.actions.emit(args)
    })

    this.eventSubscription = eventBus.on('*', (args) => {
      this.events.emit(args)
    })

    this.router = new RouterService(
      window,
      writeTask,
      eventBus,
      actionBus,
      this.root,
      this.appTitle,
      this.transition,
      this.scrollTopOffset,
    )
    this.router.captureInnerLinks(this.el)

    debugIf(this.debug, `x-ui: found ${this.childViews.length} child views`)
    this.childViews.forEach((v) => {
      v.transition = v.transition || this.transition
    })

    const dataListener = new DataListener()
    this.addListener('data', dataListener)

    const documentListener = new InterfaceActionListener()
    this.addListener('document', documentListener)
  }

  private addListener(name: string, listener: IEventActionListener) {
    debugIf(interfaceState.debug, `x-ui: ${name}-listener registered`)
    listener.initialize(window, actionBus, eventBus)
    this.listeners.push(listener)
  }

  async componentDidLoad() {
    log('x-ui: initialized')

    const body = this.el.ownerDocument.body
    if (body) {
      writeTask(async () => {
        await this.performLoadElementManipulation(body)
      })
    }

    if (this.startUrl !== '/' &&
      (this.router.location?.pathname === '/' || this.router.location?.pathname == '')) {
      this.router.goToRoute(this.startUrl)
    }
  }

  private async performLoadElementManipulation(element: HTMLElement) {
    await resolveChildElementXAttributes(element)

    element.querySelectorAll('[x-hide]').forEach((el) => {
      el.setAttribute('hidden', '')
      el.removeAttribute('x-hide')
    })
    element.querySelectorAll('[x-cloak]').forEach((el) => {
      el.removeAttribute('x-cloak')
    })
  }

  disconnectedCallback() {
    clearDataProviders()
    this.actionsSubscription()
    this.eventSubscription()
    this.router.destroy()
    this.listeners.forEach((l) => l.destroy())
    eventBus.removeAllListeners()
    actionBus.removeAllListeners()
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }
}
