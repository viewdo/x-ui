import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import { DATA_EVENTS, eventBus, resolveChildElementXAttributes, resolveExpression, RouterService, ROUTE_EVENTS, warn } from '../../services';
import { removeAllChildNodes } from '../../services/utils/dom-utils';

/**
 *  @system data
 *  @system content
 */
@Component({
  tag: 'x-data-display',
  styleUrl: 'x-data-display.scss',
  shadow: true,
})
export class XDataDisplay {
  private subscriptionData!: () => void
  private subscriptionRoutes!: () => void
  @Element() el!: HTMLXDataDisplayElement
  @State() innerTemplate!: string
  @State() resolvedTemplate?: string
  @State() innerData: any
  @State() value?: string


  /**
   The data expression to obtain a value for rendering as inner-text for this element.
   @example {session:user.name}
   @default null
   */
  @Prop() text?: string

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */

  @Prop({ mutable: true }) noRender = false

  private get router(): RouterService | undefined {
    return this.el.closest('x-ui')?.router
  }

  private get childTemplate(): HTMLTemplateElement | null {
    return this.el.querySelector('template')
  }

  private get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  async componentWillLoad() {
    this.subscriptionData = eventBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.resolveTemplate()
    })

    this.subscriptionRoutes = eventBus.on(ROUTE_EVENTS.RouteChanged, async () => {
      await this.resolveTemplate()
    })

    if (this.childTemplate !== null) {
      this.innerTemplate = this.childTemplate.innerHTML
    }

    if (this.childScript !== null) {
      try {
        this.innerData = JSON.parse(this.childScript.textContent || '')
      } catch (error) {
        warn(`x-data-display: unable to deserialize JSON: ${error}`)
      }
    }

    await this.resolveTemplate()
    removeAllChildNodes(this.el)
  }

  private async resolveTemplate() {
    if (this.noRender) {
      return
    }

    if (this.text) {
      this.value = await resolveExpression(this.text, this.innerData)
    }

    if (this.innerTemplate) {
      this.resolvedTemplate = await resolveExpression(this.innerTemplate, this.innerData)
    }
  }

  private resetContent() {
    const remoteContent = this.el.querySelector(`.dynamic`)
    remoteContent?.remove()
  }

  private async setContent() {
    const span = document.createElement('span')
    span.innerHTML = `${this.value || ''}${this.resolvedTemplate || ''}`
    span.className = 'dynamic'
    await resolveChildElementXAttributes(span)
    this.router?.captureInnerLinks(span)
    this.el.append(span)
  }

  async componentWillRender() {
    this.resetContent()
    this.setContent()
  }

  disconnectedCallback() {
    this.subscriptionData()
    this.subscriptionRoutes()
  }

  render() {
    return <Host><slot /></Host>
  }
}
