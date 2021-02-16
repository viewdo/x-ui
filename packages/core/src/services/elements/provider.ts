import { MockWindow } from '@stencil/core/mock-doc';
import { EventAction, IEventEmitter } from '../actions';
import { interfaceState } from '../interface';
import { debugIf } from '../logging';
import { ELEMENTS_COMMANDS, ELEMENTS_TOPIC } from './interfaces';

export class ElementsProvider {
  private body: HTMLBodyElement
  disposeHandle: () => void

  constructor(win: MockWindow | Window = window, private actionBus: IEventEmitter) {
    this.body = win.document.body as HTMLBodyElement
    this.disposeHandle = this.actionBus.on(ELEMENTS_TOPIC, async (ev: EventAction<any>) => {
      debugIf(interfaceState.debug, `elements-listener: event received ${ev.topic}:${ev.command}`)
      await this.commandReceived(ev.command, ev.data)
    })
  }

  private async commandReceived(command: string, data: any) {
    switch (command) {
      case ELEMENTS_COMMANDS.ElementToggleClass: {
        this.elementToggleClass(data)
        break
      }

      case ELEMENTS_COMMANDS.ElementAddClasses: {
        this.elementAddClasses(data)
        break
      }

      case ELEMENTS_COMMANDS.ElementRemoveClasses: {
        this.elementRemoveClasses(data)
        break
      }

      case ELEMENTS_COMMANDS.ElementSetAttribute: {
        this.elementSetAttribute(data)
        break
      }

      case ELEMENTS_COMMANDS.ElementRemoveAttribute: {
        this.elementRemoveAttribute(data)
        break
      }

      case ELEMENTS_COMMANDS.ElementCallMethod: {
        this.elementCallMethod(data)
        break
      }

      default:
    }
  }

  elementToggleClass(args: any) {
    const { selector, className } = args
    if (!className) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && className) element.classList.toggle(className)
  }

  elementAddClasses(args: any) {
    const { selector, classes } = args
    if (!classes) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && classes)
      classes.split(' ').forEach((c: string) => {
        element.classList.add(c)
      })
  }

  elementRemoveClasses(args: any) {
    const { selector, classes } = args
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && classes)
      classes?.split(' ').forEach((c: string) => {
        element?.classList.remove(c)
      })
  }

  elementSetAttribute(args: any) {
    const { selector, attribute, value } = args
    if (!attribute) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && attribute) element.setAttribute(attribute, value || '')
  }

  elementRemoveAttribute(args: any) {
    const { selector, attribute } = args
    if (!attribute) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && attribute) element?.removeAttribute(attribute)
  }

  elementCallMethod(args: any) {
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
    this.disposeHandle()
  }
}
