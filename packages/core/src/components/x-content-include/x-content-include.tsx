import { Component, Element, h, Host, Prop, State } from '@stencil/core'
import { eventBus } from '../../services/actions'
import { slugify, warn } from '../../services/common'
import { DATA_EVENTS, resolveTokens } from '../../services/data'
import { resolveChildElementXAttributes } from '../../services/elements'
import { RouterService, ROUTE_EVENTS } from '../../services/routing'

/**
 *  @system content
 */
@Component({
  tag: 'x-content-include',
  shadow: false,
})
export class XContentInclude {
  private contentKey!: string
  private dataSubscription!: () => void
  private routeSubscription!: () => void

  @Element() el!: HTMLXContentIncludeElement
  @State() content?: string

  /**
   * Remote Template URL
   */
  @Prop() src!: string

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) noRender = false

  private get router(): RouterService | undefined {
    return this.el.closest('x-app')?.router
  }

  async componentWillLoad() {
    this.dataSubscription = eventBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.resolveContent()
    })

    this.routeSubscription = eventBus.on(ROUTE_EVENTS.RouteChanged, async () => {
      await this.resolveContent()
    })

    this.contentKey = `dynamic-content-${slugify(this.src)}`
    await this.resolveContent()
  }

  private resetContent() {
    const remoteContent = this.el.querySelector(`#${this.contentKey}`)
    remoteContent?.remove()
  }

  private async resolveContent() {
    if (this.noRender) {
      return
    }

    try {
      const src = await resolveTokens(this.src)
      const response = await fetch(src)
      if (response.status === 200) {
        const data = await response.text()
        this.content = data
      } else {
        warn(`x-content-include: Unable to retrieve from ${this.src}`)
      }
    } catch {
      warn(`x-content-include: Unable to retrieve from ${this.src}`)
    }
  }

  async componentWillRender() {
    if (this.content) {
      this.resetContent()
      let innerContent = `${this.content || ''}`
      const content = this.el.ownerDocument.createElement('div')
      content.slot = 'content'
      content.id = this.contentKey
      content.innerHTML = innerContent
      await resolveChildElementXAttributes(content)
      if (this.router) {
        this.router!.captureInnerLinks(content)
      }
      this.el.append(content)
    }
  }

  async componentDidRender() {}

  disconnectedCallback() {
    this.dataSubscription()
    this.routeSubscription()
  }

  render() {
    return (
      <Host>
        <slot name="content" />
      </Host>
    )
  }
}
