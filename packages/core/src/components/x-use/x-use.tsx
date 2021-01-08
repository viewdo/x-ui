import { Component, Element, Prop } from '@stencil/core'
import { hasReference, markReference } from '../../services'

/**
 *  @system content
 */
@Component({
  tag: 'x-use',
  shadow: false,
})
export class XUse {
  @Element() el!: HTMLXUseElement

  /**
   * The css file to reference
   */
  @Prop() styleSrc?: string

  /**
   * The script file to reference.
   */
  @Prop() scriptSrc?: string

  /**
   * Import the script file as a module.
   */
  @Prop() module!: boolean

  /**
   * Declare the script only for use when
   * modules aren't supported
   */
  @Prop() noModule!: boolean

  /**
   * When inline the link/script tags are rendered in-place
   * rather than added to the head.
   */
  @Prop() inline!: boolean

  /**
   * INTERNAL - disables the DOM onload await to finish
   * rendering
   */
  @Prop() nowait!: boolean

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) noRender = false

  private async getStylePromise(element: HTMLHeadElement) {
    if (this.styleSrc && !hasReference(this.styleSrc)) {
      return new Promise((resolve) => {
        const link = this.el.ownerDocument.createElement('link')
        link.href = this.styleSrc
        link.rel = 'stylesheet'
        link.addEventListener('load', () => {
          markReference(this.styleSrc)
          resolve({})
        })

        element.append(link)
        if (this.nowait) {
          resolve({})
        }
      })
    }

    return Promise.resolve()
  }

  private async getScriptPromise(element: HTMLHeadElement) {
    // Make the style reference
    if (this.scriptSrc && !hasReference(this.scriptSrc)) {
      return new Promise((resolve) => {
        const script = this.el.ownerDocument.createElement('script')
        script.src = this.scriptSrc
        if (this.module) {
          script.type = 'module'
        } else if (this.noModule) {
          script.noModule = true
        }

        script.addEventListener('load', () => {
          markReference(this.scriptSrc)
          resolve({})
        })

        element.append(script)
        if (this.nowait) {
          resolve({})
        }
      })
    }

    return Promise.resolve()
  }

  async componentWillRender() {
    if (this.noRender) {
      return
    }

    const element = this.inline ? this.el : this.el.ownerDocument.head
    const resultsAggregator = []

    resultsAggregator.push(this.getStylePromise(element))

    resultsAggregator.push(this.getScriptPromise(element))

    return Promise.all(resultsAggregator)
  }
}
