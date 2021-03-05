import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
} from '@stencil/core'
import { warn } from '../../services/common/logging'
import {
  actionBus,
  ActionTopicType,
  EventAction,
  IActionElement,
} from '../../services/events'

/**
 * This element just holds data to express the actionEvent to fire. This element
 * should always be the child of a x-action-activator.
 *
 * @system actions
 */
@Component({
  tag: 'x-action',
  shadow: false,
})
export class XAction implements IActionElement {
  @Element() el!: HTMLXActionElement
  /**
   * This is the topic this action-command is targeting.
   *
   * data: []
   */
  @Prop() topic?: ActionTopicType

  /**
   * The command to execute.
   */
  @Prop() command?: string

  /**
   * Get the underlying actionEvent instance. Used by the x-action-activator element.
   */
  @Method()
  async getAction(): Promise<EventAction<any> | null> {
    if (!this.topic) {
      warn(`x-action: unable to fire action, missing topic`)
      return null
    }

    if (!this.command) {
      warn(`x-action: unable to fire action, missing command`)
      return null
    }

    let data: Record<string, any> = { ...this.el.dataset }

    if (this.childScript) {
      Object.assign(
        data,
        JSON.parse(this.childScript!.textContent || '{}'),
      )
    }

    this.childInputs.forEach((el: any, index: number) => {
      data![el.id || el.name || index] = el.value || el.checked
    })

    return {
      topic: this.topic,
      command: this.command,
      data,
    }
  }

  /**
   * Send this action to the the action messaging system.
   */
  @Method()
  async sendAction(data?: Record<string, any>) {
    const action = await this.getAction()
    if (action) {
      if (data) Object.assign(action.data, data)
      actionBus.emit(action.topic, action)
    }
  }

  private get parent(): HTMLXActionActivatorElement {
    return this.el.closest('x-action-activator')!
  }

  private get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  private get childInputs() {
    return this.el.querySelectorAll('input,select,textarea')
  }

  componentWillLoad() {
    if (this.parent === null) {
      warn(
        'The x-action component must be wrapped with an x-action-activator component to work.',
      )
    }
  }

  render() {
    return <Host></Host>
  }
}
