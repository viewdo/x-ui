import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core'
import {
  CookieConsent,
  DataProviderRegistration,
  DATA_COMMANDS,
  DATA_TOPIC,
  IDataProvider,
} from '../../services/data'
import { EventAction } from '../../services/events'
import { CookieProvider } from './cookie'

/**
 * This component enables the *Cookie Data Provider*,
 * after requesting consent from the user. The consent
 * message and the accept/reject button are customizable.
 *
 * @system data
 */
@Component({
  tag: 'x-data-provider-cookie',
  shadow: true,
  styles: `:host {display:block; display:contents;}`,
})
export class XDataProviderCookie {
  private customProvider!: IDataProvider
  private consentKey = 'consent'
  @Element() el!: HTMLXDataProviderCookieElement

  @State() hide: boolean = false

  /**
   * When skipConsent is true, the accept-cookies banner will not
   * be displayed before accessing cookie-data.
   */
  @Prop() skipConsent: boolean = false

  /**
   * This event is raised when the consents to cookies.
   */
  @Event({
    eventName: 'didConsent',
    bubbles: true,
    composed: true,
    cancelable: true,
  })
  didConsent!: EventEmitter<CookieConsent>

  /**
   * Immediately register the provider.
   */
  @Method({
    name: 'registerProvider',
  })
  public async registerProvider() {
    const customEvent = new CustomEvent<
      EventAction<DataProviderRegistration>
    >('x:actions', {
      detail: {
        topic: DATA_TOPIC,
        command: DATA_COMMANDS.RegisterDataProvider,
        data: {
          name: 'cookie',
          provider: this.customProvider,
        },
      },
    })
    await this.customProvider.set(this.consentKey, true.toString())
    this.didConsent.emit({ consented: true })
    this.hide = true
    return this.el.ownerDocument.body.dispatchEvent(customEvent)
  }

  async componentWillLoad() {
    this.customProvider = new CookieProvider(this.el.ownerDocument)

    if (this.skipConsent) {
      this.registerProvider()
      this.hide = true
      return
    }

    const consented = await this.customProvider.get(this.consentKey)
    if (consented != null) {
      this.hide = true
      if (consented == 'true') this.registerProvider()
    }
  }

  private async handleConsentResponse(
    ev: MouseEvent,
    consented: boolean,
  ) {
    ev.preventDefault()
    if (consented) {
      await this.registerProvider()
    } else {
      this.hide = true
    }
  }

  render() {
    return (
      <Host hidden={this.hide}>
        <slot />
        <a
          id="accept"
          onClick={async ev =>
            await this.handleConsentResponse(ev, true)
          }
        >
          <slot name="accept">Accept</slot>
        </a>
        <a
          id="reject"
          onClick={async ev =>
            await this.handleConsentResponse(ev, false)
          }
        >
          <slot name="reject">Reject</slot>
        </a>
      </Host>
    )
  }
}
