import { Host, Element, Component, h, Prop, State, Fragment } from '@stencil/core'
import { DATA_EVENTS, eventBus, resolveExpression, ROUTE_EVENTS, warn, removeAllChildNodes } from '../../services'

/**
 *  @system data
 *  @system content
 */
@Component({
  tag: 'x-data-display',
  styleUrl: 'x-data-display.scss',
  shadow: false,
})
export class XDataDisplay {
  private subscriptionData: () => void
  private subscriptionRoutes: () => void
  @Element() el: HTMLXDataDisplayElement
  @State() innerTemplate: string
  @State() resolvedTemplate: string
  @State() innerData: any
  @State() value: string

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
  // eslint-disable-next-line @stencil/strict-mutable
  @Prop({ mutable: true }) noRender = false

  get childTemplate(): HTMLTemplateElement {
    if (!this.el.hasChildNodes()) {
      return null
    }

    const childTemplates = Array.from(this.el.childNodes)
      .filter((c) => c.nodeName === 'TEMPLATE')
      .map((v) => v as HTMLTemplateElement)

    if (childTemplates.length > 0) {
      return childTemplates[0]
    }

    return null
  }

  private get childScript(): HTMLScriptElement {
    if (!this.el.hasChildNodes()) {
      return null
    }

    const childScripts = Array.from(this.el.childNodes)
      .filter((c) => c.nodeName === 'SCRIPT')
      .map((v) => v as HTMLScriptElement)

    if (childScripts.length > 0) {
      return childScripts[0]
    }

    return null
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
        this.innerData = JSON.parse(this.childScript.textContent)
      } catch (error) {
        warn(`x-data-display: unable to deserialize JSON: ${error}`)
      }
    }

    removeAllChildNodes(this.el)
  }

  async componentWillRender() {
    await this.resolveTemplate()
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

  disconnectedCallback() {
    this.subscriptionData()
    this.subscriptionRoutes()
  }

  render() {
    if (this.resolvedTemplate) {
      return <Host innerHTML={this.resolvedTemplate}>{this.value}</Host>
    }

    if (this.value) {
      return <Fragment>{this.value}</Fragment>
    }

    return null
  }
}
