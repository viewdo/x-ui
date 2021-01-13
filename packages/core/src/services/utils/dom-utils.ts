/* istanbul ignore file */

import { evaluatePredicate, hasExpression, resolveExpression } from '..'

export type TimedNode = {
  start: number
  end: number
  classIn: string | null
  classOut: string | null
  element: {
    id: any
    classList: { contains: (arg0: string) => any; add: (arg0: string) => void; remove: (arg0: string) => void }
    hasAttribute: (arg0: string) => any
    removeAttribute: (arg0: string) => void
    setAttribute: (arg0: string, arg1: string) => void
  }
}

export function wrapFragment(html: string, slot?: string, id?: string): HTMLDivElement {
  const wrapper = document.createElement('div')
  if (slot) {
    wrapper.slot = slot
  }

  if (id) {
    wrapper.id = id
  }

  wrapper.innerHTML = html
  return wrapper
}

export async function resolveElementVisibility(element: HTMLElement) {
  element.querySelectorAll('[x-hide-when]').forEach(async (element_) => {
    const expression = element_.getAttribute('x-hide-when')
    if (!expression) {
      return
    }

    const hide = await evaluatePredicate(expression)
    if (hide) {
      element_.setAttribute('hidden', '')
    } else {
      element_.removeAttribute('hidden')
    }
  })

  element.querySelectorAll('[x-show-when]').forEach(async (element_) => {
    const expression = element_.getAttribute('x-show-when')
    if (!expression) {
      return
    }

    const show = await evaluatePredicate(expression)

    if (show) {
      element_.removeAttribute('hidden')
    } else {
      element_.setAttribute('hidden', '')
    }
  })

  element.querySelectorAll('[no-render]').forEach(async (element_) => {
    element_.removeAttribute('no-render')
  })
}

export async function resolveElementValues(element: HTMLElement) {
  element.querySelectorAll('[x-value-from]').forEach(async (element_) => {
    const expression = element_.getAttribute('x-value-from')
    if (expression && hasExpression(expression)) {
      const value = await resolveExpression(expression)
      if (value) {
        element_.setAttribute('value', value)
      }
    }
  })
}

export function removeAllChildNodes(parent: HTMLElement) {
  while (parent?.firstChild) {
    parent.firstChild.remove()
  }
}
