import { Component, Element, forceUpdate, h, Host, Prop, State } from '@stencil/core'
import { warn } from '../../services/common'
import { getRemoteContent } from '../../services/content/remote'
import { DATA_EVENTS, evaluatePredicate } from '../../services/data'
import { replaceHtmlInElement, resolveChildElementXAttributes } from '../../services/elements'
import { eventBus } from '../../services/events'
import { RouterService, ROUTE_EVENTS } from '../../services/routing'

/**
 *  @system content
 */
@Component({
  tag: 'x-content-include',
  shadow: false,
})
export class XContentInclude {
  private readonly contentClass = 'remote-content'
  private dataSubscription!: () => void
  private routeSubscription!: () => void

  @Element() el!: HTMLXContentIncludeElement

  @State() contentElement: HTMLElement | null = null

  /**
   * Remote Template URL
   */
  @Prop() src!: string

  /**
   * Cross Origin Mode
   */
  @Prop() mode: RequestMode = 'cors'

  /**
   * Before rendering HTML, replace any data-tokens with their
   * resolved values. This also commands this component to
   * re-render it's HTML for data-changes. This can affect
   * performance.
   */
  @Prop() resolveTokens: boolean = true

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad = false

  /**
   * A data-token predicate to advise this component when
   * to render (useful if used in a dynamic route or if
   * tokens are used in the 'src' attribute)
   */
  @Prop({ mutable: true }) when?: string

  private get router(): RouterService | undefined {
    return this.el.closest('x-app')?.router
  }

  async componentWillLoad() {
    if (this.resolveTokens || this.when != undefined) {
      this.dataSubscription = eventBus.on(DATA_EVENTS.DataChanged, () => {
        forceUpdate(this.el)
      })
      this.routeSubscription = eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
        forceUpdate(this.el)
      })
    }
  }

  async componentWillRender() {
    let shouldRender = !this.deferLoad
    if (this.when) shouldRender = await evaluatePredicate(this.when)

    if (shouldRender) this.contentElement = this.src ? await this.resolveContentElement() : null
    else this.contentElement = null
  }

  private async resolveContentElement() {
    try {
      const content = await getRemoteContent(window, this.src, this.mode, this.resolveTokens)
      if (content == null) return null

      const div = document.createElement('div')
      div.innerHTML = content
      div.className = this.contentClass
      await resolveChildElementXAttributes(div)
      this.router?.captureInnerLinks(div)
      return div
    } catch {
      warn(`x-content-include: unable to retrieve from ${this.src}`)
      return null
    }
  }

  disconnectedCallback() {
    this.dataSubscription?.call(this)
    this.routeSubscription?.call(this)
  }

  render() {
    replaceHtmlInElement(this.el, `.${this.contentClass}`, this.contentElement)
    return <Host hidden={this.contentElement == null}></Host>
  }
}
