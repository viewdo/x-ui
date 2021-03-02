import { Component, Element, forceUpdate, h, Host, Prop, State } from '@stencil/core'
import { warn } from '../../services/common/logging'
import { DATA_EVENTS, evaluatePredicate, resolveTokens } from '../../services/data'
import { resolveChildElementXAttributes } from '../../services/elements'
import { eventBus } from '../../services/events'
import { RouterService, ROUTE_EVENTS } from '../../services/routing'
import { renderMarkdown } from './markdown/remarkable.worker'

/**
 *  @system content
 */
@Component({
  tag: 'x-content-markdown',
  shadow: false,
})
export class XContentMarkdown {
  private dataChangedSubscription!: () => void
  private routeChangedSubscription!: () => void
  @Element() el!: HTMLXContentMarkdownElement
  @State() content?: string | null = null

  /**
   * Remote Template URL
   */
  @Prop() src?: string

  /**
   * Base Url for embedded links
   */
  @Prop() baseUrl?: string

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad = false

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) renderIf?: string

  private get router(): RouterService | null {
    return this.el.closest('x-app')?.router || null
  }

  private get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  async componentWillLoad() {
    this.dataChangedSubscription = eventBus.on(DATA_EVENTS.DataChanged, () => {
      forceUpdate(this.el)
    })

    this.routeChangedSubscription = eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
      forceUpdate(this.el)
    })
  }

  async componentWillRender() {
    this.content = await this.resolveContent()
  }

  private async resolveContent() {
    if (this.deferLoad) {
      return null
    }

    //const renderValue = await evaluateExpression(this.renderIf || 'true')
    let shouldRender = true
    if (this.renderIf) {
      shouldRender = await evaluatePredicate(this.renderIf)
    }
    if (!shouldRender) {
      return null
    }

    let content = ''
    if (this.src) {
      content = await this.getContentFromSrc()
    } else if (this.childScript) {
      content = await this.getContentFromScript()
    }

    const div = document.createElement('div')
    div.innerHTML = content

    await resolveChildElementXAttributes(div)
    if (this.router) {
      this.router!.captureInnerLinks(div)
    }

    this.highlight(div)
    return div.innerHTML
  }

  private async getContentFromSrc() {
    try {
      const src = await resolveTokens(this.src!)
      const response = await window.fetch(src)
      if (response.status === 200) {
        const data = await response.text()
        return (await renderMarkdown(data)) || ''
      }

      warn(`x-content-markdown: unable to retrieve from ${this.src}`)
    } catch {
      warn(`x-content-markdown: unable to retrieve from ${this.src}`)
    }
    return ''
  }

  private async getContentFromScript() {
    const element = this.childScript
    if (!element?.textContent) return ''
    const md = this.dedent(element.textContent)
    return (await renderMarkdown(md)) || ''
  }

  private dedent(innerText: string) {
    const string = innerText?.replace(/^\n/, '')
    const match = string?.match(/^\s+/)
    return match ? string?.replace(new RegExp(`^${match[0]}`, 'gm'), '') : string
  }

  private highlight(container: { querySelectorAll: (arg0: string) => any }) {
    const win = window as any
    const prism = win.Prism
    if (prism?.highlightAllUnder) {
      const unhinted = container.querySelectorAll('pre>code:not([class*="language-"])')
      unhinted.forEach((n: any) => {
        // Dead simple language detection :)
        const lang = n.textContent.match(/^\s*</) ? 'markup' : n.textContent.match(/^\s*(\$|#)/) ? 'bash' : 'js'
        n.classList.add(`language-${lang}`)
      })
      prism.highlightAllUnder(container)
    }
  }

  disconnectedCallback() {
    this.dataChangedSubscription()
    this.routeChangedSubscription()
  }

  render() {
    return <Host hidden={!this.content}>{this.content ? <div innerHTML={this.content}></div> : null}</Host>
  }
}
