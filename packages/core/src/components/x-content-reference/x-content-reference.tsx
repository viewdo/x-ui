import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
} from '@stencil/core'
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
  @Prop() module: boolean = false

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

  /**
   * Timeout for waiting for the script of style tags
   * to confirm they were loaded.
   */
  @Prop() timeout = 1000

  /**
   * This event is fired when the script and style
   * elements are loaded or timed out. The value for each
   * style and script will be true or false, for loaded
   * or timedout, respectively.
   *
   * Event Details: {
   *  type: string,
   *  loaded:: boolean
   * }
   */
  @Event({
    eventName: 'x:complete',
    bubbles: true,
    cancelable: false,
  })
  public complete!: EventEmitter<{
    type: string
    loaded: boolean
  }>

  private registered(type: string, loaded: boolean) {
    this.complete.emit({ type, loaded })
  }

  private async getStylePromise(element: HTMLHeadElement) {
    if (this.styleSrc && !hasReference(this.styleSrc)) {
      const url = this.styleSrc
      return new Promise<void>((resolve, reject) => {
        const link = this.el.ownerDocument.createElement('link')
        link.href = url
        link.rel = 'stylesheet'
        let success = false
        link.addEventListener('load', () => {
          success = true
          markReference(url)
          this.registered('styles', success)
          resolve()
        })
        element.append(link)
        setTimeout(() => {
          if (!success) {
            this.registered('styles', success)
            reject(
              `Styles:${url} did not load before the ${this.timeout} timeout.`,
            )
          }
        }, this.timeout)
      })
    }
  }

  private getScriptPromise(element: HTMLHeadElement) {
    // Make the style reference
    if (this.scriptSrc && !hasReference(this.scriptSrc)) {
      const url = this.scriptSrc
      return new Promise<void>((resolve, reject) => {
        const script = this.el.ownerDocument.createElement('script')
        script.src = url
        let success = false

        if (this.module) {
          script.type = 'module'
        } else if (this.noModule) {
          script.setAttribute('nomodule', '')
        }

        script.addEventListener('load', () => {
          success = true
          markReference(url)
          this.registered('script', success)
          resolve()
        })

        element.append(script)
        setTimeout(() => {
          if (!success) {
            this.registered('script', success)
            reject(
              `Script:${url} did not load before the ${this.timeout} timeout.`,
            )
          }
        }, 500)
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
