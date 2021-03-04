import { Component, Element, forceUpdate, h, Host, Prop, State } from '@stencil/core'
import { arrify, debugIf, warnIf } from '../../services/common'
import { DATA_EVENTS, hasToken, resolveTokens } from '../../services/data'
import { eventBus } from '../../services/events'
import { RouterService, ROUTE_EVENTS } from '../../services/routing'
import { filterData } from './filter/jsonata.worker'
/**
 *  @system data
 */
@Component({
  tag: 'x-data-repeat',
  shadow: true,
})
export class XDataRepeat {
  private dataSubscription!: () => void
  private routeSubscription!: () => void
  @Element() el!: HTMLXDataRepeatElement
  @State() innerTemplate!: string
  @State() resolvedTemplate!: string
  private contentKey!: string

  /**
   The array-string or data expression to obtain a collection for rendering the template.
   {{session:cart.items}}
   */
  @Prop() items?: string

  /**
   * The URL to remote JSON collection to use for the items.
   * @example /data.json
   */
  @Prop() itemsSrc?: string

  /**
   * The JSONata query to filter the json items
   * see <https://try.jsonata.org> for more info.
   */
  @Prop() filter?: string

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad = false

  /**
   * Turn on debug statements for load, update and render events.
   */
  @Prop() debug = false

  private get router(): RouterService | undefined {
    return this.el.closest('x-app')?.router
  }

  get childTemplate(): HTMLTemplateElement | null {
    return this.el.querySelector('template')
  }

  private get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  async componentWillLoad() {
    debugIf(this.debug, 'x-data-repeat: loading')
    this.dataSubscription= eventBus.on(DATA_EVENTS.DataChanged, () => {
      forceUpdate(this.el)
    })

    this.routeSubscription = eventBus.on(ROUTE_EVENTS.RouteChanged, () => {
      forceUpdate(this.el)
    })

    if (this.childTemplate === null) {
      warnIf(this.debug, 'x-data-repeat: missing child <template> tag')
    } else {
      this.innerTemplate = this.childTemplate.innerHTML
    }

    this.contentKey = `data-content`
  }

  async componentWillRender() {
    if (!this.innerTemplate) return

    const remoteContent = this.el.querySelector(`.${this.contentKey}`)
    remoteContent?.remove()
    const items = await this.resolveItems()
    const innerContent = await this.resolveHtml(items)
    if (innerContent) {
      const content = this.el.ownerDocument.createElement('div')
      content.className = this.contentKey!
      content.innerHTML = innerContent
      content.slot = 'content'
      this.router?.captureInnerLinks(content)
      this.el.append(content)
    }
  }

  private async resolveHtml(items: any[]) {
    debugIf(this.debug, 'x-data-repeat: resolving html')
    if (this.deferLoad) {
      return null
    }

    // DebugIf(this.debug, `x-data-repeat: innerItems ${JSON.stringify(this.resolvedItems || [])}`);
    if (this.innerTemplate) {
      let resolvedTemplate = ''

      return await items.reduce(
        (previousPromise: Promise<any>, item: any) =>
          previousPromise.then(async () =>
            resolveTokens(this.innerTemplate.slice(), false, item).then((html) => {
              resolvedTemplate += html
              return resolvedTemplate
            }),
          ),
        Promise.resolve(),
      )
    }
    return null
  }

  private async resolveItems() {
    let items = []
    if (this.childScript) {
      try {
        const text = this.childScript.textContent?.replace('\n', '')
        items = arrify(JSON.parse(text || '[]'))
      } catch (error) {
        warnIf(this.debug, `x-data-repeat: unable to deserialize JSON: ${error}`)
      }
    } else if (this.itemsSrc) {
      items = await this.fetchJson()
    } else if (this.items) {
      items = await this.resolveItemsExpression()
    } else {
      warnIf(
        this.debug,
        'x-data-repeat: you must include at least one of the following: items, json-src or a <script> element with a JSON array.',
      )
    }
    if (this.filter) {
      let filterString = this.filter.slice()
      if (hasToken(filterString)) {
        filterString = await resolveTokens(filterString)
      }

      debugIf(this.debug, `x-data-repeat: filtering: ${filterString}`)
      items = await filterData(filterString, items)
    }
    return items
  }

  private async fetchJson() {
    try {
      debugIf(this.debug, `x-data-repeat: fetching items from ${this.itemsSrc}`)

      const response = await window.fetch(this.itemsSrc!)
      if (response.status === 200) {
        const data = await response.json()
        return arrify(data)
      }
      warnIf(this.debug, `x-data-repeat: Unable to parse response from ${this.itemsSrc}`)
    } catch (err) {
      warnIf(this.debug, `x-data-repeat: Unable to parse response from ${this.itemsSrc}: ${err}`)
    }
    return []
  }

  private async resolveItemsExpression() {
    let items = []
    try {
      let itemsString = this.items
      if (itemsString && hasToken(itemsString)) {
        itemsString = await resolveTokens(itemsString)
        debugIf(this.debug, `x-data-repeat: items resolved to ${itemsString}`)
      }

      items = itemsString ? JSON.parse(itemsString) : []
    } catch (error) {
      warnIf(this.debug, `x-data-repeat: unable to deserialize JSON: ${error}`)
    }
    return items
  }

  componentDidRender() {}

  disconnectedCallback() {
    this.dataSubscription?.call(this)
    this.routeSubscription?.call(this)
  }

  render() {
    return (
      <Host>
        <slot name="content"></slot>
      </Host>
    )
  }
}
