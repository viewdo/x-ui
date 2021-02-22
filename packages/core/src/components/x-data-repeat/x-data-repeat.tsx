import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import jsonata from 'jsonata';
import { DATA_EVENTS, debugIf, eventBus, hasExpression, resolveExpression, RouterService, ROUTE_EVENTS, warnIf } from '../../services';
import { arrify } from '../../services/utils/misc-utils';

/**
 *  @system data
 */
@Component({
  tag: 'x-data-repeat',
  shadow: false,
})
export class XDataRepeat {
  private subscriptionData!: () => void
  private subscriptionRoutes!: () => void
  @Element() el!: HTMLXDataRepeatElement
  @State() resolvedItems: any[] = []
  @State() innerTemplate!: string
  @State() resolvedTemplate!: string

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
  @Prop({ mutable: true }) noRender = false

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
    this.subscriptionData = eventBus.on(DATA_EVENTS.DataChanged, async () => {
      await this.resolveHtml()
    })

    this.subscriptionRoutes = eventBus.on(ROUTE_EVENTS.RouteChanged, async () => {
      await this.resolveHtml()
    })

    if (this.childTemplate === null) {
      warnIf(this.debug, 'x-data-repeat: missing child <template> tag')
    } else {
      this.innerTemplate = this.childTemplate.innerHTML
    }

    await this.resolveHtml()
  }

  private async fetchJson() {
    try {
      debugIf(this.debug, `x-data-repeat: fetching items from ${this.itemsSrc}`)

      if (!this.itemsSrc) {
        return
      }

      const response = await fetch(this.itemsSrc)
      if (response.status === 200) {
        const data = await response.json()
        this.resolvedItems = arrify(data)
        // DebugIf(this.debug, `x-data-repeat: remote items: ${JSON.stringify(data)}`);
      } else {
        warnIf(this.debug, `x-data-repeat: Unable to retrieve from ${this.itemsSrc}`)
      }
    } catch {
      warnIf(this.debug, `x-data-repeat: Unable to parse response from ${this.itemsSrc}`)
    }
  }

  private async resolveItemsExpression() {
    try {
      let itemsString = this.items
      if (itemsString && hasExpression(itemsString)) {
        itemsString = await resolveExpression(itemsString)
        debugIf(this.debug, `x-data-repeat: items resolved to ${itemsString}`)
      }

      this.resolvedItems = itemsString ? JSON.parse(itemsString) : []
    } catch (error) {
      warnIf(this.debug, `x-data-repeat: unable to deserialize JSON: ${error}`)
    }
  }

  private async resolveHtml() {
    debugIf(this.debug, 'x-data-repeat: resolving html')
    if (this.noRender) {
      return
    }

    if (this.childScript !== null) {
      try {
        this.resolvedItems = arrify(JSON.parse(this.childScript.textContent || '[]'))
      } catch (error) {
        warnIf(this.debug, `x-data-repeat: unable to deserialize JSON: ${error}`)
      }
    } else if (this.itemsSrc) {
      await this.fetchJson()
    } else if (this.items) {
      await this.resolveItemsExpression()
    } else {
      warnIf(
        this.debug,
        'x-data-repeat: you must include at least one of the following: items, json-src or a <script> element with a JSON array.',
      )
    }

    // DebugIf(this.debug, `x-data-repeat: innerItems ${JSON.stringify(this.resolvedItems || [])}`);
    if (this.resolvedItems && this.innerTemplate) {
      let resolvedTemplate = ''
      let items = this.resolvedItems

      if (this.filter) {
        let filterString = this.filter.slice()
        if (hasExpression(filterString)) {
          filterString = await resolveExpression(filterString)
        }

        const filter = jsonata(filterString)
        debugIf(this.debug, `x-data-repeat: filtering: ${filterString}`)
        items = arrify(filter.evaluate(this.resolvedItems))
      }

      this.resolvedTemplate = await items.reduce(
        (previousPromise, item) =>
          previousPromise.then(async () =>
            resolveExpression(this.innerTemplate.slice(), item).then((html) => {
              resolvedTemplate += html
              return resolvedTemplate
            }),
          ),
        Promise.resolve(),
      )
    }
  }

  componentDidRender() {
    this.router?.captureInnerLinks(this.el)
  }

  disconnectedCallback() {
    this.subscriptionData()
    this.subscriptionRoutes()
  }

  render() {
    return <Host innerHTML={this.resolvedTemplate}></Host>
  }
}
