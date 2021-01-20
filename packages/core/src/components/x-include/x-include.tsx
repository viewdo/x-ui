import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import {
  DATA_EVENTS,
  eventBus,
  resolveChildElements,
  resolveExpression,
  RouterService,
  ROUTE_EVENTS,
  warn,
  wrapFragment
} from '../..';
import { createKey } from '../../services/routing/utils/location-utils';

/**
 *  @system content
 */
@Component({
  tag: 'x-include',
  shadow: false,
})
export class XInclude {
  private contentKey!: string
  private dataSubscription!: () => void
  private routeSubscription!: () => void

  @Element() el!: HTMLXIncludeElement
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
    return this.el.closest('x-ui')?.router
  }

  async componentWillLoad() {
    this.contentKey = `dynamic-content-${createKey(10)}`

    this.dataSubscription = eventBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.resolveContent()
    })

    this.routeSubscription = eventBus.on(ROUTE_EVENTS.RouteChanged, async () => {
      await this.resolveContent()
    })

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
      const src = await resolveExpression(this.src)
      const response = await fetch(src)
      if (response.status === 200) {
        const data = await response.text()
        this.content = data
      } else {
        warn(`x-include: Unable to retrieve from ${this.src}`)
      }
    } catch {
      warn(`x-include: Unable to retrieve from ${this.src}`)
    }
  }

  async componentWillRender() {
    if (this.content) {
      this.resetContent();
      let innerContent = `${this.content || ''}`;
      const content = wrapFragment(innerContent, 'content', this.contentKey)
      this.el.append(content)
    }
  }

  async componentDidRender() {
    if (this.router) {
      await resolveChildElements(this.el, this.router, location.href)
    }
  }

  disconnectedCallback() {
    this.dataSubscription()
    this.routeSubscription()
  }

  render() {
    return <Host><slot name="content" /></Host>
  }
}
