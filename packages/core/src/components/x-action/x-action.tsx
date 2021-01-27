import { Component, Element, h, Host, Method, Prop } from '@stencil/core';
import { EventAction, IActionElement, warn } from '../..';

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
  private deserializedData?: Record<string, any>

  @Element() el!: HTMLXActionElement
  /**
   * This is the topic this action-command is targeting.
   */
  @Prop() topic?: 'data' | 'routing' | 'document' | 'audio' | 'video'

  /**
   * The command to execute.
   */
  @Prop() command?: string

  /**
   * The JSON serializable data payload the command requires.
   */
  @Prop() data?: string

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

    return {
      topic: this.topic,
      command: this.command,
      data: this.deserializedData,
    }
  }

  private get parent(): HTMLXActionActivatorElement {
    return this.el.closest('x-action-activator')!
  }

  private get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  componentWillLoad() {
    if (this.parent === undefined) {
      warn('The x-action component must be wrapped with an x-action-activator component to work.')
    } else if (this.childScript) {
      this.deserializedData = JSON.parse(this.childScript?.textContent || '{}')
    } else {
      this.deserializedData = JSON.parse(this.data || '{}')
    }
  }

  render() {
    return <Host hidden></Host>
  }
}
