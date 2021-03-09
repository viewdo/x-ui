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
import {
  getRemoteContent,
  resolveSrc,
} from '../../services/content/remote'
import { evaluatePredicate } from '../../services/data/expressions'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { resolveTokens } from '../../services/data/tokens'
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
  private contentKey: string | null = null
  private renderCache: Record<string, HTMLElement> = {}
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
  @Prop({ mutable: true }) deferLoad: boolean = false

  /**
   * A data-token predicate to advise this component when
   * to render (useful if used in a dynamic route or if
   * tokens are used in the 'src' attribute)
   */
  @Prop({ mutable: true }) when?: string

  /**
   * Force render with data & route changes.
   */
  @Prop() noCache: boolean = false

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
    if (shouldRender && this.when)
      shouldRender = await evaluatePredicate(this.when)

    if (shouldRender) {
      if (this.contentElement && this.noCache == false) return
      this.contentElement = await this.resolveContentElement()
    } else {
      this.contentElement = null
    }
  }

  private fixMarkdown(content: string) {
    return content.split('\\|').join('or')
  }

  private async resolveContentElement() {
    const key = this.src
      ? await resolveSrc(this.src!)
      : this.contentKey
    if (key && !this.noCache && this.renderCache[key])
      return this.renderCache[key]

    const content = this.src
      ? await this.getContentFromSrc()
      : await this.getContentFromScript()
    if (content == null) return null

    const div = document.createElement('div')
    div.innerHTML =
      (await renderMarkdown(this.fixMarkdown(content))) || ''
    div.className = this.contentClass
    await resolveChildElementXAttributes(div)
    this.router?.captureInnerLinks(div)
    this.highlight(div)
    return div
  }

  private async getContentFromSrc() {
    this.contentKey = await resolveSrc(this.src!)
    try {
      const content = await getRemoteContent(
        window,
        this.src!,
        this.mode,
        this.resolveTokens,
      )
      return content
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
    this.contentKey = 'script'

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
