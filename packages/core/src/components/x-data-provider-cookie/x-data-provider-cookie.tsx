import { Component, Element, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core'
import { CookieConsent, CookieProvider, DataProviderRegistration, DATA_COMMANDS, DATA_TOPIC, evaluatePredicate, EventAction, IDataProvider } from '../..'

/**
 *  @system providers
 */
@Component({
  tag: 'x-data-provider-cookie',
  styleUrl: 'x-data-provider-cookie.scss',
  shadow: true,
})
export class XDataProviderCookie {
  private customProvider: IDataProvider
  @Element() el: HTMLXDataProviderCookieElement
  @State() hide = false

  /**
   * An expression that tells this component how to determine if
   * the user has previously consented.
   * @example {storage:consented}
   */
  @Prop() hideWhen: string

  /**
   * When skipConsent is true, the accept-cookies banner will not
   * be displayed before accessing cookie-data.
   */
  @Prop() skipConsent = false

  /**
   * This event is raised when the component obtains
   * consent from the user to use cookies.
   * The data-provider system should capture this event
   * and register the provider for use in expressions.
   */
  @Event({
    eventName: 'actionEvent',
    bubbles: true,
    composed: true,
    cancelable: true,
  })
  register: EventEmitter<EventAction<DataProviderRegistration>>

  /**
   * This event is raised when the consents to cookies.
   */
  @Event({
    eventName: 'didConsent',
    bubbles: true,
    composed: true,
    cancelable: true,
  })
  didConsent: EventEmitter<CookieConsent>

  private get consentKey() {
    return 'cookie-consent'
  }

  async componentWillLoad() {
    this.customProvider = new CookieProvider()
    const consented = await this.customProvider.get(this.consentKey)
    if (consented) {
      this.hide = true
      this.register.emit({
        topic: DATA_TOPIC,
        command: DATA_COMMANDS.RegisterDataProvider,
        data: {
          name: 'cookie',
          provider: this.customProvider,
        },
      })
      return
    }

    if (this.hideWhen) {
      this.hide = await evaluatePredicate(this.hideWhen)
    }

    if (this.skipConsent) {
      this.hide = true
    }
  }

  componentDidLoad() {
    const acceptElement = this.el.querySelector('[x-accept]')
    acceptElement?.addEventListener('click', (e) => {
      e.preventDefault()
      this.handleConsentResponse(true)
    })

    const rejectElement = this.el.querySelector('[x-reject]')
    rejectElement?.addEventListener('click', (e) => {
      e.preventDefault()
      this.handleConsentResponse(false)
    })
  }

  private async handleConsentResponse(consented: boolean) {
    if (consented) {
      this.register.emit({
        topic: DATA_TOPIC,
        command: DATA_COMMANDS.RegisterDataProvider,
        data: {
          name: 'cookie',
          provider: this.customProvider,
        },
      })
      await this.customProvider.set(this.consentKey, 'true')
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
