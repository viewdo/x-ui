import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import {
  DATA_EVENTS,
  debugIf,
  eventBus,
  markVisit,
  MatchResults,
  resolveChildElementXAttributes,
  Route,
  warn
} from '../..';
import { ActionActivationStrategy, resolveNext, slugify } from '../../services';
import { RouterService } from '../../services/routing/router';

/**
 *  @system routing
 *  @system presentation
 */
@Component({
  tag: 'x-app-view',
  styleUrl: 'x-app-view.scss',
  shadow: true,
})
export class XAppView {
  private dataChangedSubscription!: () => void
  private route!: Route
  @Element() el!: HTMLXAppViewElement
  @State() match: MatchResults | null = null
  @State() exactMatch = false
  private contentKey?: string | null

  /**
   * The router-service instance  (internal)
   *
   */
  @Prop({ mutable: true }) router!: RouterService

  /**
   * The title for this view. This is prefixed
   * before the app title configured in x-app
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
  @Prop({ mutable: true, reflect: true }) url!: string

  /**
   * The url for this route should only be matched
   * when it is exact.
   */
  @Prop() exact: boolean = false

  /**
   * Remote URL for this Route's content.
   */
  @Prop() contentSrc?: string

  /**
   * Turn on debug statements for load, update and render events.
   */
  @Prop() debug = false

  private get parent() {
    return this.el.parentElement?.closest('x-app-view')
  }

  private get routeContainer() {
    return this.el.closest('x-app')
  }

  private get actionActivators(): HTMLXActionActivatorElement[] {
    return Array.from(this.el.querySelectorAll('x-action-activator')).filter((e) => this.isChild(e))
  }

  private isChild(element: HTMLElement) {
    return element.parentElement?.closest('x-app-view') === this.el || false
      && element.parentElement?.closest('x-view-do') == null
  }

  private get childViewDos(): HTMLXAppViewDoElement[] {
    return Array.from(this.el.querySelectorAll('x-app-view-do')||[])
      .filter((e) => this.isChild(e))
  }

  private get childViews(): HTMLXAppViewElement[] {
    return Array.from(this.el.querySelectorAll('x-app-view')||[])
      .filter((e) => this.isChild(e))
  }

  componentWillLoad() {
    debugIf(this.debug, `x-app-view: ${this.url} loading`)

    if (!this.routeContainer || !this.routeContainer.router) {
      warn(`x-app-view: ${this.url} cannot load outside of an x-app element`)
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
      (match:MatchResults|null) => {
        this.match = match
        this.exactMatch = match?.isExact || false
      },
    )

    debugIf(this.debug, `x-app-view: ${this.url} match: ${this.route.match?'true':'false'}`)

    debugIf(this.debug, `x-app-view: ${this.url} found ${this.childViews.length} child views`)
    this.childViews.forEach((v) => {
      v.url = this.route.normalizeChildUrl(v.url)
      v.transition = v.transition || this.transition
    })

    debugIf(this.debug, `x-app-view: ${this.url} found ${this.childViewDos.length} child view-dos`)
    this.childViewDos.forEach((v) => {
      v.url = this.route.normalizeChildUrl(v.url)
      v.transition = v.transition || this.transition
    })

    this.dataChangedSubscription = eventBus.on(DATA_EVENTS.DataChanged, async () => {
      debugIf(this.debug, `x-app-view: ${this.url} data changed `)
      if (this.match?.isExact)
        await resolveChildElementXAttributes(this.el)
    })

    this.contentKey = `remote-content-${slugify(this.contentSrc || 'none')}`;
  }

  async componentWillRender() {
    debugIf(this.debug, `x-app-view: ${this.url} will render`)

    if (this.match?.isExact) {
      debugIf(this.debug, `x-app-view: ${this.url} route is matched `)
      const viewDos = this.childViewDos.map(el => {
        const { url, when, visit } = el;
        return { url, when, visit }
      })
      const nextDo = await resolveNext(viewDos)
      if (nextDo) {
        this.route.goToRoute(nextDo.url)
        return
      } else {
        markVisit(this.match.url)
        await this.fetchHtml()
      }
    } else {
      this.resetContent()
    }
  }

  private async fetchHtml() {
    if (!this.contentSrc || this.el.querySelector(`#${this.contentKey}`)) {
      return
    }

    try {
      debugIf(this.debug, `x-app-view: ${this.url} fetching content from ${this.contentSrc}`)

      const response = await window.fetch(this.contentSrc)
      if (response.status === 200) {
        const innerContent = await response.text()
        const content = this.el.ownerDocument.createElement('div');
        content.slot = 'content';
        content.id = this.contentKey!
        content.innerHTML = innerContent
        this.route.captureInnerLinks(content)
        await resolveChildElementXAttributes(content)
        this.el.append(content)
      } else {
        warn(`x-app-view: ${this.url} Unable to retrieve from ${this.contentSrc}`)
      }
    } catch {
      warn(`x-app-view: ${this.url} Unable to retrieve from ${this.contentSrc}`)
    }
  }

  async componentDidRender() {
    debugIf(this.debug, `x-app-view: ${this.url} did render`)

    if (this.match?.isExact) {
      await  this.route?.activateActions(
        this.actionActivators,
        ActionActivationStrategy.OnEnter)
    } else {
      if (this.route?.didExit()) {
        await this.route?.activateActions(
          this.actionActivators,
          ActionActivationStrategy.OnExit)
      }
    }

    await this.route?.loadCompleted()
  }

  private resetContent() {
    const remoteContent = this.el.querySelector(`#${this.contentKey}`);
    remoteContent?.remove();
    this.contentKey = null
  }

  disconnectedCallback() {
    this.dataChangedSubscription()
    this.route.destroy()
  }

  render() {
    debugIf(this.debug, `x-app-view: ${this.url} render`)
    return (
      <Host>
        <slot />
        <slot name="content" />
      </Host>
    )
  }
}
