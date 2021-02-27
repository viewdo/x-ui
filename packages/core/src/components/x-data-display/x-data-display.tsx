import { Component, Element, forceUpdate, h, Host, Prop, State } from '@stencil/core'
import { eventBus } from '../../services/actions'
import { warn } from '../../services/common/logging'
import { DATA_EVENTS, resolveExpression } from '../../services/data'
import { removeAllChildNodes, resolveChildElementXAttributes } from '../../services/elements'
import { RouterService, ROUTE_EVENTS } from '../../services/routing'

/**
 *  @system data
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
   {{session:user.name}}
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
    return this.el.closest('x-app')?.router
  }

  private get childTemplate(): HTMLTemplateElement | null {
    return this.el.querySelector('template')
  }

  private get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  async componentWillLoad() {
    this.subscriptionData = eventBus.on(DATA_EVENTS.DataChanged, () => {
      forceUpdate(this.el)
    })

    this.subscriptionRoutes = eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
      forceUpdate(this.el)
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

    removeAllChildNodes(this.el)
  }

  async componentWillRender() {
    this.resetContent()
    await this.resolveTemplate()
    this.setContent()
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

  disconnectedCallback() {
    this.subscriptionData()
    this.subscriptionRoutes()
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }
}
