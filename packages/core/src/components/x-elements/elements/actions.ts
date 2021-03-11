import { MockWindow } from '@stencil/core/mock-doc'
import {
  EventAction,
  IEventActionListener,
} from '../../../services/actions'
import { IEventEmitter } from '../../../services/common/interfaces'
import { debugIf } from '../../../services/common/logging'
import { commonState } from '../../../services/common/state'
import { ELEMENTS_COMMANDS, ELEMENTS_TOPIC } from './interfaces'

export class ElementsActionListener implements IEventActionListener {
  actionsSubscription!: () => void
  eventBus!: IEventEmitter
  private body!: HTMLBodyElement

  initialize(
    win: Window | MockWindow,
    actionBus: IEventEmitter,
    eventBus: IEventEmitter,
  ): void {
    this.body = win.document.body as HTMLBodyElement
    this.eventBus = eventBus
    this.actionsSubscription = actionBus.on(
      ELEMENTS_TOPIC,
      async (ev: EventAction<any>) => {
        debugIf(
          commonState.debug,
          `elements-listener: action received ${ev.topic}:${ev.command}`,
        )
        await this.commandReceived(ev.command, ev.data)
      },
    )
  }

  private async commandReceived(command: string, data: any) {
    switch (command) {
      case ELEMENTS_COMMANDS.ToggleClass: {
        this.ToggleClass(data)
        break
      }

      case ELEMENTS_COMMANDS.AddClasses: {
        this.AddClasses(data)
        break
      }

      case ELEMENTS_COMMANDS.RemoveClasses: {
        this.RemoveClasses(data)
        break
      }

      case ELEMENTS_COMMANDS.SetAttribute: {
        this.SetAttribute(data)
        break
      }

      case ELEMENTS_COMMANDS.RemoveAttribute: {
        this.RemoveAttribute(data)
        break
      }

      case ELEMENTS_COMMANDS.CallMethod: {
        this.CallMethod(data)
        break
      }

      default:
    }
  }

  ToggleClass(args: any) {
    const { selector, className } = args
    if (!className) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && className) element.classList.toggle(className)
  }

  AddClasses(args: any) {
    const { selector, classes } = args
    if (!classes) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && classes)
      classes.split(' ').forEach((c: string) => {
        element.classList.add(c)
      })
  }

  RemoveClasses(args: any) {
    const { selector, classes } = args
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && classes)
      classes?.split(' ').forEach((c: string) => {
        element?.classList.remove(c)
      })
  }

  SetAttribute(args: any) {
    const { selector, attribute, value } = args
    if (!attribute) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && attribute)
      element.setAttribute(attribute, value || '')
  }

  RemoveAttribute(args: any) {
    const { selector, attribute } = args
    if (!attribute) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && attribute) element?.removeAttribute(attribute)
  }

  CallMethod(args: any) {
    const { selector, method, data } = args
    if (!method) return
    const element = this.body.querySelector(selector)
    if (element) {
      const elementMethod = element[method]
      if (elementMethod && typeof element === 'function') {
        elementMethod(data)
      }
    }
  }

  destroy() {
    this.actionsSubscription()
  }
}
