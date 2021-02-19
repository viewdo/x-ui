import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import {
  DATA_EVENTS,
  eventBus,
  resolveChildElementXAttributes,
  resolveExpression,
  RouterService,
  ROUTE_EVENTS,
  warn
} from '../..';
import { evaluatePredicate } from '../../services';
import { render } from './markdown.worker';

/**
 *  @system content
 */
@Component({
  tag: 'x-content-md',
  shadow: false,
})
export class XContentMD {
  @Element() el!: HTMLXContentMdElement
  @State() content?: string

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
  @Prop({ mutable: true }) noRender = false

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
    eventBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.resolveContent()
    })

    eventBus.on(ROUTE_EVENTS.RouteChanged, async () => {
      await this.resolveContent()
    })

    await this.resolveContent()
  }

  private async resolveContent() {
    if (this.noRender) {
      return
    }

    if(await evaluatePredicate(this.renderIf || 'true') == false){
      return
    }

    let content = ''
    if (this.src) {
      content = await this.getContentFromSrc() || ''
    } else if (this.childScript) {
      content = await this.getContentFromScript() || ''
    }

    const div = document.createElement('div')
    div.innerHTML = content
    this.highlight(div)
    this.content = div.innerHTML
  }

  async componentDidRender() {
    await resolveChildElementXAttributes(this.el)
    if (this.router) {
      this.router!.captureInnerLinks(this.el)
    }
  }

  private async getContentFromSrc() {
    if (!this.src) return
    try {
      const src = await resolveExpression(this.src)
      const response = await fetch(src)
      if (response.status === 200) {
        const data = await response.text()
        return await render(data);
      }

      warn(`x-content-md: unable to retrieve from ${this.src}`)
    } catch {
      warn(`x-content-md: unable to retrieve from ${this.src}`)
    }
  }

  private async getContentFromScript() {
    const element = this.childScript
    if (!element?.textContent) return
    const md = this.dedent(element.textContent)
    return await render(md)
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

  render() {
    if (this.content) {
      return (
        <Host>
          <div innerHTML={this.content}></div>
        </Host>
      )
    }

    return <Host hidden></Host>
  }
}
