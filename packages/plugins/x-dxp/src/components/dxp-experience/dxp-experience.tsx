import { Component, Prop, Event, EventEmitter, Host, h, State, Method, Element } from '@stencil/core'
import { getXAPIUrlFromNamespace } from '../../services/api/conventions'
import { onChange, logger, urlService as url, state } from '../../services'
import { promiseTimeout } from '../../services/utils'
import { Experience, ExperienceInformation } from '../..'
import { Namespace } from '../../models/namespace'
import { ExperienceController } from '../../services/experience-controller'

@Component({
  tag: 'dxp-experience',
  styleUrl: 'dxp-experience.scss',
  shadow: true,
})
export class DXPExperience {
  private controller: ExperienceController
  @Element() el: HTMLDxpExperienceElement
  @State() experience: Experience
  @State() started = 0

  /**
   * Enable Debug mode to prevent API calls.
   * (falls back to ?debug )
   * @default false
   */
  @Prop() debug = url.debug

  /**
   * Enable preview mode to fake data and prevent API calls.
   * (falls back to ?preview )
   * @default false
   */
  @Prop() preview = url.preview

  /**
   * The platform environment target. (optional)
   */
  @Prop() namespace: Namespace

  /**
   * Experience API Url (optional)
   */
  @Prop({
    reflect: true,
  })
  xapiUrl: string

  /**
   * Story Key
   * (falls back to ?storyKey )
   */
  @Prop() storyKey = url.storyKey

  /**
   * User Key
   * (falls back to ?userKey )
   */
  @Prop() userKey = url.userKey

  /**
   * Enable Debug mode to prevent API calls.
   * @default false
   */
  @Prop() loadAssets = false

  /**
   * Display mode for this element.
   * @default none
   */
  @Prop() display: 'logo' | 'debug' | 'none' = 'logo'

  /**
   * Experience data (bypasses XAPI to retrieve it)
   */
  @Prop() experienceData: string

  /**
   * When an experience is retrieved, this event fires
   * with 'event.detail' being the full experience,
   * w/ data methods like 'setData()' and 'setComplete()'.
   */
  @Event({
    bubbles: true,
    eventName: 'dxp:initialized',
  })
  initialized: EventEmitter<Experience>

  /**
   * When an experience is unable to be retrieved, this event fires
   * with 'event.detail' = error message.
   */
  @Event({
    bubbles: true,
    eventName: 'dxp:errored',
  })
  errored: EventEmitter<string>

  /**
   * This event is raised when reset() is called.
   */
  @Event({
    bubbles: true,
    eventName: 'dxp:reset',
  })
  didReset: EventEmitter<void>

  /**
   * This method resets the stored session-id & experience-key,
   * effectively resetting the current experience. Useful for testing
   * or dynamically switching experiences in-page.
   */
  @Method()
  async reset() {
    this.controller.reset()
    this.didReset.emit()
  }

  /**
   * This method gets waits for the experience.
   */
  @Method()
  async getExperience(timeout: number): Promise<Experience> {
    // Provide a way for components to wait for the experience
    return promiseTimeout(
      timeout,
      new Promise((res) => {
        while (!this.experience) {
          // Do wait
        }

        res(this.experience)
      }),
    )
  }

  async componentWillLoad() {
    onChange('experience', (e) => {
      this.experience = e
      this.initialized.emit(this.experience)
    })

    if (this.namespace) {
      this.xapiUrl = getXAPIUrlFromNamespace(this.namespace)
    }

    if (this.xapiUrl) {
      this.controller = new ExperienceController(
        window.document,
        this.debug,
        this.preview,
        this.loadAssets,
        this.xapiUrl,
        this.storyKey || state.experience?.story?.key || 'funnel',
        this.userKey,
      )

      await this.initializeExperience()
    } else {
      logger.warn('A value for xapi-url OR namespace must be specified')
    }
  }

  private async initializeExperience(): Promise<void> {
    try {
      let experienceInfo: ExperienceInformation
      experienceInfo = this.experienceData ? new ExperienceInformation(JSON.parse(this.experienceData)) : await this.controller.getExperience()
      await this.controller.startSession(experienceInfo)
      this.experience = new Experience(this.controller, experienceInfo)
      if (!this.debug && typeof process !== 'undefined') {
        this.started = performance.now()
        const terminationEvent = 'onpagehide' in document ? 'pagehide' : 'unload'
        // Send the view-time to XAPI
        document?.addEventListener(terminationEvent, () => {
          const elapsed = performance.now() - this.started
          this.controller.unload(this.experience.key, elapsed * 1000)
        })
      }

      logger.debug(`Successfully retrieved and initialized experience
        \n\tExperience Key: [${this.experience.key}]
        \n\tStory Key: [${this.experience.story.key}]
        \n\tSession Id: [${this.experience.sessionId}]
        \n\tUrl: ${this.xapiUrl}/experience/${this.experience.key} `)

      state.experience = this.experience
    } catch (error) {
      logger.error('Unable to init,', error)
      this.errored.emit(error)
    }
  }

  render() {
    const Container = (options, children) => (
      <div class={`${options.class}`} part="container">
        <a href="https://view.do" target="blank" title="Learn how to bring your static content to life with View.DO personalized experiences.">
          <img alt="view.DO Logo" src="https://static.view.do/view-do/viewdo-logo-color.svg" />
        </a>
        {children}
      </div>
    )

    switch (this.display) {
      case 'logo':
        return (
          <Host>
            <Container class="logo"></Container>
            {this.controller.message ? <div class="message">{this.controller.message}</div> : null}
          </Host>
        )
      case 'debug':
        return (
          <Host>
            <Container class="debug">
              <hr />
              <div class="info">
                <button type="button" onClick={async () => this.reset()}>
                  Reset
                </button>
                <h4>
                  Experience:{' '}
                  <span>
                    <a href={`${this.xapiUrl}/experience/${this.experience?.key}`} target="_blank" rel="noreferrer">
                      {this.experience?.key}
                    </a>
                  </span>
                </h4>
              </div>
              <h4>Experience JSON: </h4>
              <pre>
                <code>{JSON.stringify(this.experience || {}, null, 2)}</code>
              </pre>
            </Container>
            {this.controller.message ? <div class="message">{this.controller.message}</div> : null}
          </Host>
        )
      default:
        return <Host hidden></Host>
    }
  }
}
