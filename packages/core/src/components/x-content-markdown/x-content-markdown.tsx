import {
  Component,
  Element,
  forceUpdate,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { warn } from '../../services/common/logging'
import { getRemoteContent } from '../../services/content/remote'
import {
  DATA_EVENTS,
  evaluatePredicate,
  resolveTokens,
} from '../../services/data'
import {
  replaceHtmlInElement,
  resolveChildElementXAttributes,
} from '../../services/elements'
import { eventBus } from '../../services/events'
import { RouterService, ROUTE_EVENTS } from '../../services/routing'
import { renderMarkdown } from './markdown/remarkable.worker'

/**
 * This component converts markdown text to HTML. It can render
 * from an inline-template or from a remote source.
 *
 * @system content
 */
@Component({
  tag: 'x-content-markdown',
  shadow: false,
})
export class XContentMarkdown {
  private readonly contentClass = 'rendered-content'
  private dataSubscription!: () => void
  private routeSubscription!: () => void

  @Element() el!: HTMLXContentMarkdownElement
  @State() contentElement: HTMLElement | null = null

  /**
   * Remote Template URL
   */
  @Prop() src?: string

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
  @Prop() resolveTokens: boolean = false

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

  private get router(): RouterService | null {
    return this.el.closest('x-app')?.router || null
  }

  private get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  async componentWillLoad() {
    if (this.resolveTokens || this.when != undefined) {
      this.dataSubscription = eventBus.on(
        DATA_EVENTS.DataChanged,
        () => {
          forceUpdate(this.el)
        },
      )
      this.routeSubscription = eventBus.on(
        ROUTE_EVENTS.RouteChanged,
        () => {
          forceUpdate(this.el)
        },
      )
    }
  }

  async componentWillRender() {
    let shouldRender = !this.deferLoad
    if (this.when) shouldRender = await evaluatePredicate(this.when)

    if (shouldRender)
      this.contentElement = await this.resolveContentElement()
    else this.contentElement = null
  }

  private async resolveContentElement() {
    const content = this.src
      ? await this.getContentFromSrc()
      : await this.getContentFromScript()
    if (content == null) return null

    const div = document.createElement('div')
    div.innerHTML = (await renderMarkdown(content)) || ''
    div.className = this.contentClass
    await resolveChildElementXAttributes(div)
    this.router?.captureInnerLinks(div)
    this.highlight(div)
    return div
  }

  private async getContentFromSrc() {
    try {
      return await getRemoteContent(
        window,
        this.src!,
        this.mode,
        this.resolveTokens,
      )
    } catch {
      warn(`x-content-markdown: unable to retrieve from ${this.src}`)
      return null
    }
  }

  private async getContentFromScript() {
    const element = this.childScript
    if (!element?.textContent) return null

    let content = this.dedent(element.textContent)
    if (this.resolveTokens) content = await resolveTokens(content)
    return content
  }

  private dedent(innerText: string) {
    const string = innerText?.replace(/^\n/, '')
    const match = string?.match(/^\s+/)
    return match
      ? string?.replace(new RegExp(`^${match[0]}`, 'gm'), '')
      : string
  }

  private highlight(container: HTMLElement) {
    const win = window as any
    const prism = win.Prism
    if (prism?.highlightAllUnder) {
      prism.highlightAllUnder(container)
    }
  }

  disconnectedCallback() {
    this.dataSubscription?.call(this)
    this.routeSubscription?.call(this)
  }

  render() {
    replaceHtmlInElement(
      this.el,
      `.${this.contentClass}`,
      this.contentElement,
    )
    return <Host hidden={this.contentElement == null}></Host>
  }
}
