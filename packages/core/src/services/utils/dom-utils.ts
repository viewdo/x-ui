/* istanbul ignore file */

import { evaluatePredicate, hasExpression, resolveExpression } from '..';

export async function resolveChildElementXAttributes(element: HTMLElement) {
  resolveChildXHideWhenAttributes(element)
  resolveChildXShowWhenAttributes(element)
  resolveChildXClassWhenAttributes(element)
  resolveChildXValueFromAttributes(element)
}

export function resolveChildXHideWhenAttributes(element: Element) {
  element.querySelectorAll('[x-hide-when]').forEach(async (el) => {
    await resolveXHideWhenAttribute(el)
  })
}

export async function resolveXHideWhenAttribute(element:Element) {
 const expression = element.getAttribute('x-hide-when')
  if (!expression) return
  const hide = await evaluatePredicate(expression)
  element.toggleAttribute('hidden', hide)
}

export function resolveChildXShowWhenAttributes(element: Element) {
  element.querySelectorAll('[x-show-when]').forEach(async (el) => {
    await resolveXShowWhenAttribute(el)
  })
}

export async function resolveXShowWhenAttribute(element:Element) {
  const expression = element.getAttribute('x-show-when')
  if (!expression) return
  const show = await evaluatePredicate(expression)
  element.toggleAttribute('hidden', !show)
}

export function resolveChildXClassWhenAttributes(element: Element) {
  element.querySelectorAll('[x-class-when]').forEach(async (el) => {
    await resolveXClassWhenAttribute(el)
  })
}

export async function resolveXClassWhenAttribute(element:Element) {
  const expression = element.getAttribute('x-class-when')
  const className = element.getAttribute('x-class')
  if (!expression || !className) return
  const when = await evaluatePredicate(expression)
  element.classList.toggle(className, when)
}

export function resolveChildXValueFromAttributes(element: Element) {
   element.querySelectorAll('[x-value-from]').forEach(async (el) => {
    await resolveXValueFromAttribute(el)
  })
}

export async function resolveXValueFromAttribute(element:Element) {
  const expression = element.getAttribute('x-value-from')
  if (expression && hasExpression(expression)) {
    const value = await resolveExpression(expression)
    if (value) {
      element.setAttribute('value', value)
    }
  }
}

export function captureElementsEventOnce<TElement extends HTMLElement,TEvent extends Event>(
  rootElement: HTMLElement,
  query: string,
  event: string,
  clickHandler: (el:TElement, ev:TEvent) => void) {
  const attribute = `x-attached-${event}`
  Array.from(rootElement.querySelectorAll(query))
    .map(el => el as TElement)
    .filter(el => !el.hasAttribute(attribute))
    .forEach((el: TElement) => {
      el.addEventListener(event, (ev) => {
        clickHandler(el, ev as TEvent)
      })
      el.setAttribute(attribute, '')
    })
}


export function getChildInputValidity(parent: HTMLElement) {
  let valid = true;
  const inputElements = parent.querySelectorAll('*:enabled');
  inputElements.forEach((i) => {
    const input = i as HTMLInputElement;
    input.blur?.call(i);
    if (!input.reportValidity()) {
      valid = false;
    }
  });
  return valid;
}

export function removeAllChildNodes(parent: HTMLElement) {
  while (parent.firstChild !== null) {
    parent.firstChild.remove()
  }
}

export function captureXBackClickEvent(
  parent: HTMLElement,
  handler: (tag:string) => void) {
  captureElementsEventOnce<HTMLElement, MouseEvent>(
    parent,
    '[x-back]',
    'click',
    (el:HTMLElement, e:MouseEvent) => {
      e.preventDefault()
      handler(el.localName)
    })
}

export function captureXNextClickEvent(
  parent: HTMLElement,
  handler: (tag:string, route?:string|null) => void) {
  captureElementsEventOnce<HTMLElement, MouseEvent>(
    parent,
    '[x-next]',
    'click',
    (el:HTMLElement, e:MouseEvent) => {
      const route = el.getAttribute('x-next')
      e.preventDefault()
      handler(el.localName, route)
    })
}

export function captureXLinkClickEvent(
  parent: HTMLElement,
  handler: (tag:string, route?:string|null) => void) {
  captureElementsEventOnce<HTMLElement, MouseEvent>(
    parent,
    '[x-link]',
    'click',
    (el:HTMLElement, e:MouseEvent) => {
      const route = el.getAttribute('x-link')
      e.preventDefault()
      handler(el.localName, route)
    })
}
