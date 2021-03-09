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
  DataProviderRegistration,
  DATA_COMMANDS,
  DATA_TOPIC,
  SetData,
} from '../../services/data/interfaces'
import {
  actionBus,
  EventAction,
  eventBus,
} from '../../services/events'
import { CookieConsent, CookieService } from './cookie'

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
  private provider!: CookieService
  private consentKey = 'consent'
  private actionSubscription?: () => void
  @Element() el!: HTMLXDataProviderCookieElement

  @State() hide: boolean = false

  /**
   * When skipConsent is true, the accept-cookies banner will not
   * be displayed before accessing cookie-data.
   */
  @Prop() skipConsent: boolean = false

  /**
   * Provider name to use in x-ui expressions.
   */
  @Prop() name: string = 'cookie'

  /**
   * This event is raised when the consents to cookies.
   */
  @Event({
    eventName: 'didConsent',
    bubbles: true,
    composed: true,
    cancelable: false,
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
          provider: this.provider,
        },
      },
    })
    this.actionSubscription = actionBus.on(
      this.name,
      async (action: EventAction<SetData>) => {
        if (action.command == DATA_COMMANDS.SetData) {
          const { data } = action
          await Promise.all(
            Object.keys(action.data).map(key =>
              this.provider.set(key, data[key]),
            ),
          )
        }
      },
    )
    await this.provider.set(this.consentKey, true.toString())
    this.didConsent.emit({ consented: true })
    this.hide = true
    return this.el.ownerDocument.body.dispatchEvent(customEvent)
  }

  async componentWillLoad() {
    this.provider = new CookieService(
      this.el.ownerDocument,
      eventBus,
      this.name,
    )

    if (this.skipConsent) {
      this.registerProvider()
      this.hide = true
      return
    }

    const consented = await this.provider.get(this.consentKey)
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
