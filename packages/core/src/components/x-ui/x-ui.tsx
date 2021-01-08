import { Component, h, Host, Element, Event, EventEmitter, Listen, Prop, State, writeTask } from '@stencil/core'
import { clearDataProviders } from '../../services/data/providers/factory'
import {
  HistoryType,
  IEventActionListener,
  LocationSegments,
  log,
  debugIf,
  RouterService,
  interfaceState,
  actionBus,
  DataListener,
  InterfaceListener,
  EventAction,
  eventBus,
} from '../../services'

/**
 *  @set routing
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
  @Prop() router!: RouterService

  /**
   * This is the root path that the actual page is,
   * if it isn't '/', then the router needs to know
   * where to begin creating paths.
   */
  @Prop() root = '/'

  /**
   * Browser (paths) or Hash (#) routing.
   * To support browser history, the HTTP server
   * must be setup for a PWA
   */
  @Prop() mode: HistoryType = 'browser'

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

  @Listen('x:actions', {
    passive: true,
    target: 'body',
  })
  delegateActionEventFromDOM(ev: CustomEvent<EventAction<any>>) {
    const action = ev.detail
    actionBus.emit(action.topic, action)
  }

  /**
   * These events are **`<x-ui/>`** command-requests for action handlers
   * to perform tasks. Any handles should cancel the event.
   */
  @Event({
    eventName: 'x:actions',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  actions!: EventEmitter

  /**
   * Listen for events that occurred within the **`<x-ui/>`**
   * system.
   */
  @Event({
    eventName: 'x:events',
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  events!: EventEmitter

  private get childViews(): HTMLXViewElement[] {
    if (!this.el.hasChildNodes()) {
      return []
    }

    return Array.from(this.el.childNodes)
      .filter((c) => c.nodeName === 'X-VIEW')
      .map((v) => v as HTMLXViewElement)
  }

  componentWillLoad() {
    interfaceState.debug = this.debug

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

    this.router = new RouterService(writeTask, eventBus, actionBus, this.el, this.mode, this.root, this.appTitle, this.transition, this.scrollTopOffset)

    this.childViews.forEach((v) => {
      if (v.url) {
        v.url = this.router.normalizeChildUrl(v.url, this.root)
      }

      v.transition = v.transition || this.transition
    })

    if (this.startUrl !== '/' && this.router.location?.pathname === this.root) {
      const startUrl = this.router.normalizeChildUrl(this.startUrl, this.root)
      this.router.history.push(this.router.getUrl(startUrl, this.root))
    }

    const dataListener = new DataListener()
    this.addListener('data', dataListener)

    const documentListener = new InterfaceListener()
    this.addListener('document', documentListener)
  }

  private addListener(name: string, listener: IEventActionListener) {
    debugIf(interfaceState.debug, `x-ui: ${name}-listener registered`)
    listener.initialize(window, actionBus, eventBus)
    this.listeners.push(listener)
  }

  componentDidLoad() {
    log('x-ui: initialized')
    this.el.querySelectorAll('[x-cloak]').forEach((element) => {
      element.removeAttribute('x-cloak')
    })
  }

  disconnectedCallback() {
    clearDataProviders()
    this.actionsSubscription()
    this.eventSubscription()
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
