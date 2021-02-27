import { Component, Element, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core'
import { EventAction } from '../../services/actions'
import {
  CookieConsent,
  CookieProvider,
  DataProviderRegistration,
  DATA_COMMANDS,
  DATA_TOPIC,
  evaluatePredicate,
  IDataProvider
} from '../../services/data'

/**
 *  @system data
 */
@Component({
  tag: 'x-data-provider-cookie',
  shadow: true,
})
export class XDataProviderCookie {
  private customProvider!: IDataProvider
  @Element() el!: HTMLXDataProviderCookieElement
  @State() hide = false

  /**
   * An expression that tells this component how to determine if
   * the user has previously consented.
   * {{{storage:consented}}}
   */
  @Prop() hideWhen?: string

  /**
   * When skipConsent is true, the accept-cookies banner will not
   * be displayed before accessing cookie-data.
   */
  @Prop() skipConsent = false

  /**
   * This event is raised when the consents to cookies.
   */
  @Event({
    eventName: 'didConsent',
    bubbles: true,
    composed: true,
    cancelable: true,
  }) didConsent!: EventEmitter<CookieConsent>

  private get consentKey() {
    return 'consent'
  }

  private registerProvider() {
    const customEvent = new CustomEvent<EventAction<DataProviderRegistration>>('x:actions', {
      detail: {
        topic: DATA_TOPIC,
        command: DATA_COMMANDS.RegisterDataProvider,
        data: {
          name: 'cookie',
          provider: this.customProvider,
        },
      },
    })
    this.el.ownerDocument.body.dispatchEvent(customEvent)
  }

  async componentWillLoad() {
    this.customProvider = new CookieProvider()
    const consented = await this.customProvider.get(this.consentKey)
    if (consented) {
      this.hide = true
      this.registerProvider()
    } else if (this.hideWhen) {
      this.hide = await evaluatePredicate(this.hideWhen)
    } else if (this.skipConsent) {
      this.hide = true
    }
  }

  componentDidLoad() {
    if (!this.hide) {
      const acceptElement = this.el.querySelector('*[x-accept]')
      acceptElement?.addEventListener('click', async (e: any) => {
        e.preventDefault()
        await this.handleConsentResponse(true)
      })

      const rejectElement = this.el.querySelector('*[x-reject]')
      rejectElement?.addEventListener('click', async (e: any) => {
        e.preventDefault()
        await this.handleConsentResponse(false)
      })
    }
  }

  private async handleConsentResponse(consented: boolean) {
    if (consented) {
      this.registerProvider()
      await this.customProvider.set(this.consentKey, consented.toString())
    }

    this.didConsent.emit({ consented })
    this.hide = true
  }

  render() {
    return (
      <Host hidden={this.hide}>
        <slot />
      </Host>
    )
  }
}
