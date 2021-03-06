import { Component, Element, Prop } from '@stencil/core'
import { hasReference, markReference } from '../../services/elements'

/**
 * This component makes a single reference to script and css sources. It can
 * be used by HTML fragment to ensure a reference is made, without worry
 * that it will create duplicate references.
 * @system content
 */
@Component({
  tag: 'x-content-reference',
  shadow: false,
})
export class XContentReference {
  @Element() el!: HTMLXContentReferenceElement

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
  @Prop() noModule: boolean = false

  /**
   * When inline the link/script tags are rendered in-place
   * rather than added to the head.
   */
  @Prop() inline: boolean = false

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad = false

  private async getStylePromise(element: HTMLHeadElement) {
    if (this.styleSrc && !hasReference(this.styleSrc)) {
      const url = this.styleSrc
      return new Promise(resolve => {
        const registered = () => {
          markReference(url)
          resolve({})
        }
        const link = this.el.ownerDocument.createElement('link')
        link.href = url
        link.rel = 'stylesheet'
        link.addEventListener('load', () => registered())
        element.append(link)
        setTimeout(() => registered(), 500)
      })
    }
  }

  private async getScriptPromise(element: HTMLHeadElement) {
    // Make the style reference
    if (this.scriptSrc && !hasReference(this.scriptSrc)) {
      const url = this.scriptSrc
      return new Promise(resolve => {
        const registered = () => {
          markReference(url)
          resolve({})
        }
        const script = this.el.ownerDocument.createElement('script')
        script.src = url
        if (this.module) {
          script.type = 'module'
        } else if (this.noModule) {
          script.setAttribute('nomodule', '')
        }

        script.addEventListener('load', () => registered())

        element.append(script)
        setTimeout(() => registered(), 500)
      })
    }
  }

  async componentWillRender() {
    if (this.deferLoad) {
      return
    }

    const element = this.inline ? this.el : this.el.ownerDocument.head

    await this.getStylePromise(element)

    await this.getScriptPromise(element)
  }
}
