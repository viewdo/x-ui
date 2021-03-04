import { Component, Element, forceUpdate, h, Host, Prop, State } from '@stencil/core'
import { warn } from '../../services/common/logging'
import { DATA_EVENTS, resolveTokens } from '../../services/data'
import { removeAllChildNodes, resolveChildElementXAttributes } from '../../services/elements'
import { eventBus } from '../../services/events'
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
  private dataSubscription!: () => void
  private routeSubscription!: () => void
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

  @Prop({ mutable: true }) deferLoad = false

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
    this.dataSubscription = eventBus.on(DATA_EVENTS.DataChanged, () => {
      forceUpdate(this.el)
    })

    this.routeSubscription = eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
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
    if (this.deferLoad) {
      return
    }

    if (this.text) {
      this.value = await resolveTokens(this.text, false, this.innerData)
    }

    if (this.innerTemplate) {
      this.resolvedTemplate = await resolveTokens(this.innerTemplate, false, this.innerData)
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
    this.dataSubscription?.call(this)
    this.routeSubscription?.call(this)
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }
}
