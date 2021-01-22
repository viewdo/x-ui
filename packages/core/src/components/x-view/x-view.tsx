import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import {
  DATA_EVENTS,
  debugIf,
  eventBus,
  hasVisited,
  markVisit,
  MatchResults,
  resolveChildElementXAttributes,
  resolveNext,
  Route,
  warn
} from '../..';
import { RouterService } from '../../services/routing/router';
import { createKey } from '../../services/routing/utils/location-utils';

/**
 *  @system routing
 */
@Component({
  tag: 'x-view',
  styleUrl: 'x-view.scss',
  shadow: true,
})
export class XView {
  private readonly dataChangedSubscription!: () => void
  private route!: Route
  @Element() el!: HTMLXViewElement
  @State() match!: MatchResults | null
  @State() contentKey?: string | null

  /**
   * The router-service instance  (internal)
   *
   */
  @Prop() router!: RouterService

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
  @Prop() scrollTopOffset = 0

  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop() transition?: string

  /**
   * The url for this route, including the parent's
   * routes.
   */
  @Prop() url!: string

  /**
   * The url for this route should only be matched
   * when it is exact.
   */
  @Prop() exact!: boolean

  /**
   * Remote URL for this Route's content.
   */
  @Prop() contentSrc?: string

  /**
   * Turn on debug statements for load, update and render events.
   */
  @Prop() debug = false

  private get parent() {
    return this.el.parentElement?.closest('x-view')
  }

  private get routeContainer() {
    return this.el.closest('x-ui')
  }

  private isChild(element: HTMLXViewDoElement) {
    return element.closest('x-view') === this.el
  }

  private get childViewDos(): HTMLXViewDoElement[] {
    return Array.from(this.el.querySelectorAll('x-view-do')).filter((e) => this.isChild(e))
  }

  private get childViews(): HTMLXViewElement[] {
    if (!this.el.hasChildNodes()) {
      return []
    }

    return Array.from(this.el.childNodes)
      .filter((c) => c.nodeName === 'X-VIEW')
      .map((v) => v as HTMLXViewElement)
  }

  async componentWillLoad() {
    debugIf(this.debug, `x-view: ${this.url} loading`)

    if (!this.routeContainer || !this.routeContainer.router) {
      warn(`x-view: ${this.url} cannot load outside of an x-ui element`)
      return
    }

    this.router = this.routeContainer.router

    if (!this.router) return

    this.route = this.router.createRoute(
      this.el,
      this.url,
      this.exact,
      this.pageTitle,
      this.transition || this.parent?.transition || null,
      this.scrollTopOffset,
      (match) => {
        if (match === null) this.resetContent()
        this.match = match
      },
    )

    this.childViews.forEach((v) => {
      v.url = this.route.normalizeChildUrl(v.url)
      v.transition = v.transition || this.transition
    })

    this.childViewDos.forEach((v) => {
      v.url = this.route.normalizeChildUrl(v.url)
      v.transition = v.transition || this.transition
    })

    this.match = this.route.router?.matchPath({
      path: this.url,
      exact: this.exact,
      strict: true,
    })

    eventBus.on(DATA_EVENTS.DataChanged, async () => {
      debugIf(this.debug, `x-view: ${this.url} data changed `)
      await resolveChildElementXAttributes(this.el)
    })

    this.route.captureInnerLinks()
  }

  async componentWillRender() {
    debugIf(this.debug, `x-view: ${this.url} will render`)
    await this.resolveView()
  }

  private async resolveNext() {
    const viewDos = this.childViewDos.map((viewDo) => {
      const { when, visit, url } = viewDo
      const visited = hasVisited(url)
      return { when, visit, visited, url }
    })

    return await resolveNext(viewDos)
  }


  private async resolveView() {
    debugIf(this.debug, `x-view: ${this.url} resolve view called`)

    if (this.match) {
      this.el.classList.add('active-route')
      if (this.match.isExact) {
        debugIf(this.debug, `x-view: ${this.url} route is matched `)
        const nextDo = await this.resolveNext()
        if (nextDo) {
          this.route.goToRoute(nextDo.url)
        } else {
          this.activateView(this.match.url)
        }
      } else {
        this.el.classList.remove('active-route-exact')
      }
      await resolveChildElementXAttributes(this.el)
    } else {
      this.resetContent()
    }
  }

  private async activateView(url: string) {
    this.el.querySelectorAll('[no-render]').forEach((el) => {
      el.removeAttribute('no-render')
    })
    this.el.classList.add('active-route-exact')
    markVisit(url)
    await this.fetchHtml()
    if (this.route.transition) {
      this.route.transition.split(' ').forEach((c) => {
        this.el.classList.add(c)
      })
    }

    await this.route.loadCompleted()
  }

  private resetContent() {
    const remoteContent = this.el.querySelector(`#${this.contentKey}`);
    remoteContent?.remove();
    this.contentKey = null
    this.el.classList.remove('active-route')
  }

  private async fetchHtml() {
    if (!this.contentSrc || this.contentKey) {
      return
    }

    try {
      debugIf(this.debug, `x-view: ${this.url} fetching content from ${this.contentSrc}`)
      this.resetContent()
      const response = await fetch(this.contentSrc)
      if (response.status === 200) {
        const innerContent = await response.text()
        this.contentKey = `remote-content-${createKey(10)}`;
        const content = this.el.ownerDocument.createElement('div');
        content.slot = 'content';
        content.id = this.contentKey!
        content.innerHTML = innerContent
        if (this.route.transition) content.className = this.route.transition
        this.route.captureInnerLinks(content)
        this.el.append(content)
      } else {
        warn(`x-view: ${this.url} Unable to retrieve from ${this.contentSrc}`)
      }
    } catch {
      warn(`x-view: ${this.url} Unable to retrieve from ${this.contentSrc}`)
    }
  }

  disconnectedCallback() {
    this.dataChangedSubscription()
    this.route.destroy()
  }

  render() {
    debugIf(this.debug, `x-view: ${this.url} render`)
    return (
      <Host>
        <slot />
        <slot name="content" />
      </Host>
    )
  }
}
