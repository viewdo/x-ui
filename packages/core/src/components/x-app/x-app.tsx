import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
  State,
  writeTask,
} from '@stencil/core'
import { commonState, debugIf, log } from '../../services/common'
import {
  ElementsActionListener,
  resolveChildElementXAttributes,
} from '../../services/elements'
import {
  actionBus,
  EventAction,
  eventBus,
  IEventActionListener,
} from '../../services/events'
import {
  LocationSegments,
  RouterService,
} from '../../services/routing'
import { XAppViewNotFound } from '../x-app-view-not-found/x-app-view-not-found'

/**
 * The root component is the base container for the view-engine and its
 * child components. This element should contain root-level HTML that
 * is global to every view along with \<x-app-view\>
 * components placed within any global-html.
 *
 * @system routing
 * @system interface
 */
@Component({
  tag: 'x-app',
  styleUrl: 'x-app.css',
  shadow: false,
})
export class XApp {
  private eventSubscription!: () => void
  private actionsSubscription!: () => void
  private readonly listeners: IEventActionListener[] = []

  @Element() el!: HTMLXAppElement
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
  @Prop() root: string = '/'

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
  @Prop() startUrl: string = '/'

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
   * These events are **`<x-app>`** command-requests for
   * action handlers to perform tasks. Any handles should
   * cancel the event.
   */
  @Event({
    eventName: 'x:actions',
    composed: true,
    cancelable: true,
    bubbles: false,
  })
  actions!: EventEmitter

  /**
   * Listen for events that occurred within the **`<x-app>`**
   * system.
   */
  @Event({
    eventName: 'x:events',
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  events!: EventEmitter

  private get childViews(): HTMLXAppViewElement[] {
    return Array.from(
      this.el.querySelectorAll('x-app-view') || [],
    ).filter(e => {
      return e.parentElement?.closest('x-app-view') == null
    })
  }

  componentWillLoad() {
    if (this.debug) {
      log('x-app: initializing <debug>')
    } else {
      log('x-app: initializing')
    }

    commonState.debug = this.debug

    this.actionsSubscription = actionBus.on('*', (_topic, args) => {
      this.actions.emit(args)
    })

    this.eventSubscription = eventBus.on('*', args => {
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

    debugIf(
      this.debug,
      `x-app: found ${this.childViews.length} child views`,
    )
    this.childViews.forEach(v => {
      v.url = this.router.adjustRootViewUrls(v.url)
      v.transition = v.transition || this.transition
    })

    const notFound = this.el.querySelector(
      'x-app-view-not-found',
    ) as XAppViewNotFound | null
    if (notFound) {
      notFound.transition = notFound.transition || this.transition
    }

    this.addListener('elements', new ElementsActionListener())
  }

  private addListener(name: string, listener: IEventActionListener) {
    debugIf(commonState.debug, `x-app: ${name}-listener registered`)
    listener.initialize(window, actionBus, eventBus)
    this.listeners.push(listener)
  }

  async componentDidLoad() {
    log('x-app: initialized')

    const body = this.el.ownerDocument.body
    if (body) {
      writeTask(async () => {
        await this.performLoadElementManipulation(body)
      })
    }

    this.router.finalize(this.startUrl)
  }

  private async performLoadElementManipulation(element: HTMLElement) {
    await resolveChildElementXAttributes(element)

    element.querySelectorAll('[x-hide]').forEach(el => {
      el.setAttribute('hidden', '')
      el.removeAttribute('x-hide')
    })
    element.querySelectorAll('[x-cloak]').forEach(el => {
      el.removeAttribute('x-cloak')
    })
  }

  disconnectedCallback() {
    this.actionsSubscription?.call(this)
    this.eventSubscription?.call(this)
    this.router.destroy()
    this.listeners.forEach(l => l.destroy())
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
