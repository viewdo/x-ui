import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core'
import { DATA_EVENTS, debugIf, eventBus, hasVisited, markVisit, MatchResults, resolveElementVisibility, resolveNext, Route, warn, wrapFragment } from '../..'
import '../x-view-do/x-view-do'

/**
 *  @system routing
 */
@Component({
  tag: 'x-view',
  styleUrl: 'x-view.scss',
  shadow: true,
})
export class XView {
  private readonly subscription!: () => void
  private route!: Route
  @Element() el!: HTMLXViewElement
  @State() match!: MatchResults | null
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

  private get childViewDos(): HTMLXViewDoElement[] {
    if (!this.el.hasChildNodes()) {
      return []
    }

    return Array.from(this.el.childNodes)
      .filter((c) => c.nodeName === 'X-VIEW-DO')
      .map((v) => v as HTMLXViewDoElement)
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

    this.route = this.routeContainer.router.createRoute(
      this.el,
      this.url,
      this.exact,
      this.pageTitle,
      this.transition || this.parent?.transition || null,
      this.scrollTopOffset,
      async (match) => {
        this.match = match
        await this.resolveView()
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
    await this.resolveView()

    eventBus.on(DATA_EVENTS.DataChanged, async () => {
      debugIf(this.debug, `x-view: ${this.url} data changed `)
      await this.resolveView()
    })
  }

  async componentDidRender() {
    debugIf(this.debug, `x-view: ${this.url} did render`)
    await resolveElementVisibility(this.el)
  }

  private async fetchHtml() {
    if (!this.contentSrc || this.fetched) {
      return
    }

    try {
      debugIf(this.debug, `x-view: ${this.url} fetching content from ${this.contentSrc}`)
      const response = await fetch(this.contentSrc)
      if (response.status === 200) {
        const data = await response.text()
        const content = wrapFragment(data, 'content', 'content')
        if (this.route.transition) content.className = this.route.transition
        this.el.append(content)
        this.fetched = true
        this.el.querySelectorAll('a[href]')
      } else {
        warn(`x-view: ${this.url} Unable to retrieve from ${this.contentSrc}`)
      }
    } catch {
      warn(`x-view: ${this.url} Unable to retrieve from ${this.contentSrc}`)
    }
  }

  private async resolveView() {
    debugIf(this.debug, `x-view: ${this.url} resolve view called`)

    if (this.match) {
      this.el.classList.add('active-route')
      if (this.match.isExact) {
        debugIf(this.debug, `x-view: ${this.url} route is matched `)

        const viewDos = this.childViewDos.map((viewDo) => {
          const { when, visit, url } = viewDo
          const visited = hasVisited(url)
          return { when, visit, visited, url }
        })

        const nextDo = await resolveNext(viewDos)
        if (nextDo) {
          this.route.router?.history.push(nextDo.url)
        } else {
          markVisit(this.match.url)
          await this.fetchHtml()
          this.el.classList.add('active-route-exact')
          if (this.route.transition) {
            this.route.transition.split(' ').forEach((c) => {
              this.el.classList.add(c)
            })
          }

          await this.route.loadCompleted()
        }
      } else {
        this.el.classList.remove('active-route-exact')
      }
    } else {
      this.el.classList.remove('active-route')
    }
  }

  disconnectedCallback() {
    this.subscription()
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
