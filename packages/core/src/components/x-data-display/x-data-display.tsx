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
import { DATA_EVENTS, resolveTokens } from '../../services/data'
import {
  removeAllChildNodes,
  replaceHtmlInElement,
  resolveChildElementXAttributes,
} from '../../services/elements'
import { eventBus } from '../../services/events'
import { RouterService, ROUTE_EVENTS } from '../../services/routing'

/**
 * Render data directly into HTML using declarative expressions.
 * This element renders the expression with all data-tokens
 * replaced with the values provided by the provider.
 *
 * @system data
 * @system content
 */
@Component({
  tag: 'x-data-display',
  styleUrl: 'x-data-display.scss',
  shadow: false,
})
export class XDataDisplay {
  private dataSubscription!: () => void
  private routeSubscription!: () => void
  private contentClass = 'dynamic'
  @Element() el!: HTMLXDataDisplayElement
  @State() innerTemplate!: string
  @State() innerData: any
  @State() contentElement: HTMLElement | null = null

  /**
   * The data expression to obtain a value for rendering as inner-text for this element.
   * {{session:user.name}}
   * @default null
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

    if (this.childTemplate !== null) {
      this.innerTemplate = this.childTemplate.innerHTML
    }

    if (this.childScript !== null) {
      try {
        this.innerData = JSON.parse(
          this.childScript.textContent || '',
        )
      } catch (error) {
        warn(`x-data-display: unable to deserialize JSON: ${error}`)
      }
    }
    removeAllChildNodes(this.el)
  }

  async componentWillRender() {
    let shouldRender = !this.deferLoad

    if (shouldRender)
      this.contentElement = await this.resolveContentElement()
    else this.contentElement = null
  }

  private async getContent() {
    let content: string | null = null
    if (this.text) {
      content = await resolveTokens(this.text, false, this.innerData)
    }

    if (this.innerTemplate) {
      content = await resolveTokens(
        this.innerTemplate,
        false,
        this.innerData,
      )
    }
    return content
  }

  private async resolveContentElement() {
    const content = await this.getContent()
    if (content == null) return null

    const container = document.createElement(
      this.innerTemplate ? 'div' : 'span',
    )
    container.innerHTML = content
    container.className = this.contentClass
    await resolveChildElementXAttributes(container)
    this.router?.captureInnerLinks(container)
    return container
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
    return (
      <Host>
        <slot />
      </Host>
    )
  }
}
