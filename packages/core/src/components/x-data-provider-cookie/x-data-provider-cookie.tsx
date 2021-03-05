import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import {
  CookieConsent,
  DataProviderRegistration,
  DATA_COMMANDS,
  DATA_TOPIC,
  evaluatePredicate,
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
  styles: `:host {display:block;}`,
})
export class XDataProviderCookie {
  private customProvider!: IDataProvider
  @Element() el!: HTMLXDataProviderCookieElement

  @State() hide?: boolean

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
  })
  didConsent!: EventEmitter<CookieConsent>

  private get consentKey() {
    return 'consent'
  }

  private registerProvider() {
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
    this.el.ownerDocument.body.dispatchEvent(customEvent)
  }

  async componentWillLoad() {
    this.hide = false
    if (this.hideWhen) {
      this.hide = await evaluatePredicate(this.hideWhen)
      return
    }

    this.customProvider = new CookieProvider()
    const consented = await this.customProvider.get(this.consentKey)
    if (consented != null) {
      this.hide = true
      if (consented == 'true') this.registerProvider()
    } else if (this.skipConsent) {
      this.hide = true
    }
  }

  private onAccept = async (ev: MouseEvent) => {
    ev.preventDefault()
    await this.handleConsentResponse(true)
  }

  private onReject = async (ev: MouseEvent) => {
    ev.preventDefault()
    await this.handleConsentResponse(false)
  }

  private async handleConsentResponse(consented: boolean) {
    if (consented) {
      this.registerProvider()
      await this.customProvider.set(
        this.consentKey,
        consented.toString(),
      )
    }

    this.didConsent.emit({ consented })
    this.hide = true
    forceUpdate(this)
  }

  render() {
    return (
      <Host hidden={this.hide}>
        <slot />
        <a onClick={async ev => await this.onAccept(ev)}>
          <slot name="accept">Accept</slot>
        </a>
        <a onClick={async ev => await this.onReject(ev)}>
          <slot name="reject">Reject</slot>
        </a>
      </Host>
    )
  }
}
