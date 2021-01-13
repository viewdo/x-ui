import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core'
import {
  ActionActivationStrategy,
  actionBus,
  DATA_EVENTS,
  debugIf,
  EventAction,
  eventBus,
  EventEmitter,
  interfaceState,
  markVisit,
  MatchResults,
  resolveElementValues,
  resolveElementVisibility,
  Route,
  storeVisit,
  TimedNode,
  VIDEO_COMMANDS,
  VIDEO_EVENTS,
  VIDEO_TOPIC,
  VisitStrategy,
  warn,
  wrapFragment,
} from '../..'
import '../x-view/x-view'

/**
 *  @system routing
 */
@Component({
  tag: 'x-view-do',
  styleUrl: 'x-view-do.scss',
  shadow: true,
})
export class XViewDo {
  private subscription!: () => void
  private subscriptionVideoActions!: () => void
  private timedNodes: TimedNode[] = []
  private timer: any
  private timeEvent!: EventEmitter
  private lastTime = 0
  private route!: Route
  @Element() el!: HTMLXViewDoElement
  @State() match: MatchResults | null = null
  @State() fetched!: boolean

  /**
   * The title for this view. This is prefixed
   * before the app title configured in x-ui
   *
   */
  @Prop() pageTitle = ''

  /**
   * Header height or offset for scroll-top on this
   * view.
   */
  @Prop() scrollTopOffset?: number

  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop() transition?: string

  /**
   * The url for this route, including the parent's
   * routes.
   *
   */
  @Prop() url!: string

  @Watch('url')
  validatePath(newValue: string, _oldValue: string) {
    const isBlank = typeof newValue !== 'string' || newValue === ''
    const has2chars = typeof newValue === 'string' && newValue.length >= 2
    if (isBlank) {
      throw new Error('url: required')
    }

    if (!has2chars) {
      throw new Error('url: too short')
    }
  }

  /**
   * The url for this route should only be matched
   * when it is exact.
   */
  @Prop() exact = true

  /**
   * The visit strategy for this do.
   * once: persist the visit and never force it again
   * always: do not persist, but don't don't show again in-session
   * optional: do not force this view-do ever. It will be available by URL
   */
  @Prop() visit: VisitStrategy = VisitStrategy.once

  /**
   * If present, the expression must
   * evaluate to true for this route
   * to be sequenced by the parent view.
   * The existence of this value overrides
   * the visit strategy
   */
  @Prop() when?: string

  /**
   * When this value exists, the page will
   * automatically progress when the duration in seconds has passed.
   */
  @Prop() nextAfter = 0

  /**
   * Remote URL for this Route's content.
   */
  @Prop() contentSrc?: string

  /**
   *  How should this page be presented
   *  (coming soon)
   */
  @Prop() display: 'page' | 'modal' | 'full' = 'page'

  /**
   * To debug timed elements, set this value to true.
   */
  @Prop() debug = false

  private get duration() {
    return this.childVideo?.duration || this.nextAfter
  }

  private get parentView() {
    return this.el.closest('x-view')
  }

  private get routeContainer() {
    return this.el.closest('x-ui')
  }

  private get childVideo(): HTMLVideoElement | null {
    return this.el.querySelector('vm-player,video')
  }

  private get actionActivators(): HTMLXActionActivatorElement[] {
    return Array.from(this.el.querySelectorAll('x-action-activator'))
  }

  async componentWillLoad() {
    debugIf(this.debug, `x-view-do: ${this.url} loading`)

    if (!this.routeContainer) {
      warn(`x-view-do: ${this.url} cannot load outside of an x-ui element`)
      return
    }

    this.route = this.routeContainer.router.createRoute(
      this.el,
      this.url,
      this.exact,
      this.pageTitle,
      this.transition || this.parentView?.transition || null,
      this.scrollTopOffset || 0,
      async (match) => {
        this.match = match
        await this.resolveView()
      },
    )

    this.match = this.route.router.matchPath({
      path: this.url,
      exact: this.exact,
      strict: true,
    })

    await this.resolveView()

    this.subscription = eventBus.on(DATA_EVENTS.DataChanged, async () => {
      debugIf(this.debug, 'x-view-do: data changed ')
      await this.resolveView()
    })

    // Attach enter-key for next
    this.el.addEventListener('keypress', (ev: KeyboardEvent) => {
      if (ev.key === 'Enter') {
        this.next(this.el.localName, 'enter-key')
      }
    })
  }

  async componentWillRender() {
    debugIf(this.debug, `x-view-do: ${this.url} will render`)
  }

  async componentDidRender() {
    debugIf(this.debug, `x-view-do: ${this.url} did render`)
    await resolveElementValues(this.el)
  }

  private async fetchHtml() {
    if (!this.contentSrc || this.fetched) {
      return
    }

    try {
      const response = await fetch(this.contentSrc)
      if (response.status === 200) {
        const data = await response.text()
        this.el.append(wrapFragment(data, 'content', 'content-remote'))
        this.fetched = true
      } else {
        warn(`x-view-do: ${this.url} Unable to retrieve from ${this.contentSrc}`)
      }
    } catch {
      warn(`x-view-do: ${this.url} Unable to retrieve from ${this.contentSrc}`)
    }
  }

  private beforeExit() {
    const inputElements = this.el.querySelectorAll('input')
    let valid = true
    this.childVideo?.pause()

    inputElements.forEach((i) => {
      i.blur()
      if (!i.reportValidity()) {
        valid = false
      }
    })
    if (valid) {
      this.actionActivators
        .filter((activator) => activator.activate === ActionActivationStrategy.OnExit)
        .forEach(async (activator) => {
          await activator.activateActions()
        })

      if (this.subscriptionVideoActions) {
        this.subscriptionVideoActions()
      }

      this.restoreElementChildTimedNodes()
      clearInterval(this.timer)
      this.timer = null
      this.lastTime = 0
    }

    return valid
  }

  private back(element: string, eventName: string) {
    debugIf(this.debug, `x-view-do: back fired from ${element}:${eventName}`)
    if (this.beforeExit()) {
      this.route.router?.history.goBack()
    }
  }

  private next(element: string, eventName: string, route?: string | null) {
    debugIf(this.debug, `x-view-do: next fired from ${element}:${eventName}`)

    if (this.beforeExit()) {
      if (this.visit === VisitStrategy.once) {
        storeVisit(this.url)
      }

      markVisit(this.url)
      if (route) {
        this.route.router?.history.push(route)
      } else {
        this.route.router?.goToParentRoute()
      }
    }
  }

  private async resolveView() {
    debugIf(this.debug, `x-view-do: ${this.url} resolve view called`)
    clearInterval(this.timer)
    this.childVideo?.pause()
    if (this.match?.isExact) {
      debugIf(this.debug, `x-view-do: ${this.url} on-enter`)
      await this.fetchHtml()
      await resolveElementValues(this.el)
      await resolveElementVisibility(this.el)
      await this.resolveChildren()
      await this.setupTimer()
      await this.route.loadCompleted()
    } else {
      this.el.classList.remove('active-route')
      const remoteContent = this.el.querySelector('#content-remote')
      remoteContent?.remove()
      this.fetched = false
    }
  }

  private async resolveChildren() {
    debugIf(this.debug, `x-view-do: ${this.url} resolve children called`)

    // Attach next
    this.el.querySelectorAll('[x-next]').forEach((element) => {
      const route = element.getAttribute('x-next')
      element.addEventListener('click', (e) => {
        e.preventDefault()
        this.next(element?.localName, 'clicked', route)
      })
      element.removeAttribute('x-next')
    })

    // Attach routes
    this.el.querySelectorAll('[x-link]').forEach((element) => {
      const route = element.getAttribute('x-link')
      if (route) {
        element.addEventListener('click', (e) => {
          e.preventDefault()
          this.next(element.localName, 'clicked', route)
        })
      }

      element.removeAttribute('x-link')
    })

    this.el.querySelectorAll('a[href]').forEach((element) => {
      element.addEventListener('click', (e) => {
        e.preventDefault()
        const url = element.getAttribute('href')
        this.next(element.localName, 'clicked', url)
      })
    })

    // Attach back
    this.el.querySelectorAll('[x-back]').forEach((element) => {
      element.addEventListener('click', (e) => {
        e.preventDefault()
        this.back(element.localName, 'clicked')
      })
      element.removeAttribute('x-back')
    })

    // Activate on-enter actions
    this.actionActivators.filter((activator) => activator.activate === ActionActivationStrategy.OnEnter).forEach(async (activator) => activator.activateActions())

    // Capture timed nodes
    this.timedNodes = this.captureElementChildTimedNodes(this.duration)
    debugIf(this.debug && this.timedNodes.length > 0, `x-view-do: ${this.url} found time-child nodes: ${JSON.stringify(this.timedNodes)}`)
  }

  private async setupTimer() {
    const video = this.childVideo
    const { debug, duration } = this
    const timeUpdateEvent = 'vmCurrentTimeChange'

    this.timeEvent = new EventEmitter()
    this.lastTime = 0

    debugIf(this.debug, `x-view-do: starting timer w/ ${duration} duration`)

    if (video) {
      this.subscriptionVideoActions = actionBus.on(VIDEO_TOPIC, async (e, ev: EventAction<any>) => {
        debugIf(this.debug, `x-audio-player: event received ${e}:${ev.command}`)
        await this.commandReceived(ev.command, ev.data)
      })

      video.addEventListener(timeUpdateEvent, () => {
        this.timeEvent.emit(timeUpdateEvent, video.currentTime)
        this.lastTime = video.currentTime
      })

      video.addEventListener('vmPlaybackEnded', () => {
        this.next('video', 'ended')
      })

      video.addEventListener('end', () => {
        this.next('video', 'ended')
      })

      if (interfaceState.autoplay) {
        await video?.play()
      }
    } else {
      const time = 0
      const started = performance.now()
      const emitTime = (time: number) => {
        time = (performance.now() - started) / 1000
        debugIf(this.debug, `x-view-do: ${this.lastTime} - ${time}`)
        this.timeEvent.emit(timeUpdateEvent, time)

        if ((duration > 0 && time < duration) || duration === 0) {
          this.timer = setTimeout(() => {
            this.timer = requestAnimationFrame(() => {
              emitTime(time)
            })
          }, 500)

          this.lastTime = time
        }

        if (duration > 0 && time > duration) {
          debugIf(debug, `x-view-do: presentation ended at ${time} [not redirecting]`)
          cancelAnimationFrame(this.timer)
          clearInterval(this.timer)
          if (interfaceState.autoplay) {
            this.next('timer', timeUpdateEvent)
          }
        }
      }

      this.timer = requestAnimationFrame(() => {
        emitTime(time)
      })
    }

    this.timeEvent.on(timeUpdateEvent, (time: number) => {
      const { debug, duration } = this

      this.actionActivators
        .filter((activator) => activator.activate === ActionActivationStrategy.AtTime)
        .filter((activator) => (activator.time ? time >= activator.time : false))
        .forEach(async (activator) => {
          await activator.activateActions()
        })

      this.resolveElementChildTimedNodesByTime(time, duration, debug)
    })
  }

  private mute(muted: boolean) {
    if (!this.childVideo) {
      return
    }

    this.childVideo.muted = muted
    if (muted) {
      eventBus.emit(VIDEO_EVENTS.Muted)
    } else {
      eventBus.emit(VIDEO_EVENTS.Unmuted)
    }
  }

  private async play() {
    await this.childVideo?.play()
    eventBus.emit(VIDEO_EVENTS.Played)
  }

  private pause() {
    this.childVideo?.pause()
    eventBus.emit(VIDEO_EVENTS.Paused)
  }

  private async resume() {
    await this.childVideo?.play()
    eventBus.emit(VIDEO_EVENTS.Resumed)
  }

  private async commandReceived(command: string, data: any) {
    switch (command) {
      case VIDEO_COMMANDS.Play: {
        await this.play()
        break
      }

      case VIDEO_COMMANDS.Pause: {
        this.pause()
        eventBus.emit(VIDEO_EVENTS.Paused)
        break
      }

      case VIDEO_COMMANDS.Resume: {
        await this.resume()
        eventBus.emit(VIDEO_EVENTS.Resumed)
        break
      }

      case VIDEO_COMMANDS.Mute: {
        this.mute(data.value)
        eventBus.emit(VIDEO_EVENTS.Muted)
        break
      }

      default:
    }
  }

  private resolveElementChildTimedNodesByTime(time: number, duration: number, debug: boolean) {
    this.timedNodes.forEach((node) => {
      if (node.start > -1 && time >= node.start && (node.end > -1 ? time < node.end : true)) {
        debugIf(debug, `x-view-do: node ${node.element.id} is after start: ${node.start} before end: ${node.end}`)
        // Time is after start and before end, if it exists
        if (node.classIn && !node.element.classList.contains(node.classIn)) {
          debugIf(debug, `x-view-do: node ${node.element.id} is after start: ${node.start} before end: ${node.end} [adding classIn: ${node.classIn}]`)
          node.element.classList.add(node.classIn)
        }

        if (node.element.hasAttribute('hidden')) {
          debugIf(debug, `x-view-do: node ${node.element.id} is after start: ${node.start} before end: ${node.end} [removing hidden attribute]`)
          // Otherwise, if there's a hidden attribute, remove it
          node.element.removeAttribute('hidden')
        }
      }

      if (node.end > -1 && time > node.end) {
        // Time is after end, if it exists
        debugIf(debug, `x-view-do: node ${node.element.id} is after end: ${node.end}`)
        if (node.classIn && node.element.classList.contains(node.classIn)) {
          debugIf(debug, `x-view-do: node ${node.element.id} is after end: ${node.end}  [removing classIn: ${node.classIn}]`)
          // Remove the in class, if it exists
          node.element.classList.remove(node.classIn)
        }

        if (node.classOut) {
          // If a class-out was specified and isn't on the element, add it
          if (!node.element.classList.contains(node.classOut)) {
            debugIf(debug, `x-view-do: node ${node.element.id} is after end: ${node.end} [adding classOut: ${node.classOut}]`)
            node.element.classList.add(node.classOut)
          }
        } else if (!node.element.hasAttribute('hidden')) {
          // Otherwise, if there's no hidden attribute, add it
          debugIf(debug, `x-view-do: node ${node.element.id} is after end: ${node.end} [adding hidden attribute]`)
          node.element.setAttribute('hidden', '')
        }
      }
    })

    // Resolve x-time-to
    const timeValueElements = this.el.querySelectorAll('[x-time-to]')
    timeValueElements.forEach((element_) => {
      const seconds = Math.floor(time)
      const attributeName = element_.getAttribute('x-time-to')
      if (attributeName) {
        element_.setAttribute(attributeName, seconds.toString())
      } else {
        element_.childNodes.forEach((cn) => cn.remove())
        element_.append(document.createTextNode(seconds.toString()))
      }
    })

    // Resolve x-percentage-to
    const timePercentageValueElements = this.el.querySelectorAll('[x-percentage-to]')
    timePercentageValueElements.forEach((element) => {
      const attributeName = element.getAttribute('x-percentage-to')
      const percentage = time / duration
      if (attributeName) {
        element.setAttribute(attributeName, percentage.toString())
      } else {
        element.childNodes.forEach((cn) => cn.remove())
        element.append(document.createTextNode(`${Math.round(percentage * 100)}%`))
      }
    })
  }

  private restoreElementChildTimedNodes() {
    this.timedNodes.forEach((node) => {
      if (node.classIn && node.element.classList.contains(node.classIn)) {
        node.element.classList.remove(node.classIn)
      }

      if (node.classOut && node.element.classList.contains(node.classOut)) {
        node.element.classList.remove(node.classOut)
      }

      if (!node.element.hasAttribute('hidden')) {
        node.element.setAttribute('hidden', '')
      }
    })

    // Resolve x-time-to
    const timeValueElements = this.el.querySelectorAll('[x-time-to]')
    timeValueElements.forEach((element_) => {
      const attributeName = element_.getAttribute('x-time-to')
      if (attributeName) {
        element_.setAttribute(attributeName, '0')
      } else {
        element_.childNodes.forEach((cn) => cn.remove())
        element_.append(document.createTextNode('0'))
      }
    })

    // Resolve x-percentage-to
    const timePercentageValueElements = this.el.querySelectorAll('[x-percentage-to]')
    timePercentageValueElements.forEach((element_) => {
      const attributeName = element_.getAttribute('x-percentage-to')
      if (attributeName) {
        element_.setAttribute(attributeName, '0')
      } else {
        element_.childNodes.forEach((cn) => cn.remove())
        element_.append(document.createTextNode('0%'))
      }
    })
  }

  private captureElementChildTimedNodes(defaultDuration: number) {
    const timedNodes: TimedNode[] = []
    this.el.querySelectorAll('[x-in-time], [x-out-time]').forEach((element) => {
      const startAttribute = element.getAttribute('x-in-time')
      const start = startAttribute ? Number.parseFloat(startAttribute) : 0
      const endAttribute = element.getAttribute('x-out-time')
      const end = endAttribute ? Number.parseFloat(endAttribute) : defaultDuration
      timedNodes.push({
        start,
        end,
        classIn: element.getAttribute('x-in-class'),
        classOut: element.getAttribute('x-out-class'),
        element,
      })
    })
    return timedNodes
  }

  disconnectedCallback() {
    clearInterval(this.timer)
    this.timeEvent.removeAllListeners()
    this.subscription()
    this.route.destroy()
  }

  render() {
    debugIf(this.debug, `x-view-do: ${this.url} render`)

    return (
      <Host hidden={!this.match?.isExact} class={this.route?.transition || ''}>
        <slot />
        <slot name="content" />
      </Host>
    )
  }
}
