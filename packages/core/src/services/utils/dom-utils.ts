/* istanbul ignore file */

import { evaluatePredicate, hasExpression, resolveExpression } from '..'
import { RouterService } from '../routing/router'

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

export async function resolveChildElements(element: HTMLElement, router?: RouterService, url?: string) {
  element.querySelectorAll('[x-hide-when]').forEach(async (el) => {
    const expression = el.getAttribute('x-hide-when')
    if (!expression) {
      return
    }

    const hide = await evaluatePredicate(expression)
    if (hide) {
      el.setAttribute('hidden', '')
    } else {
      el.removeAttribute('hidden')
    }
  })

  element.querySelectorAll('[x-show-when]').forEach(async (el) => {
    const expression = el.getAttribute('x-show-when')
    if (!expression) {
      return
    }

    const show = await evaluatePredicate(expression)

    if (show) {
      el.removeAttribute('hidden')
    } else {
      el.setAttribute('hidden', '')
    }
  })

  element.querySelectorAll('[x-class-when]').forEach(async (el) => {
    const expression = el.getAttribute('x-class-when')
    const className = el.getAttribute('x-class')
    if (!expression || !className) {
      return
    }

    const when = await evaluatePredicate(expression)
    el.classList.toggle(className, when)
  })

  element.querySelectorAll('[x-value-from]').forEach(async (el) => {
    const expression = el.getAttribute('x-value-from')
    if (expression && hasExpression(expression)) {
      const value = await resolveExpression(expression)
      if (value) {
        el.setAttribute('value', value)
      }
    }
  })

  if (router)
    element.querySelectorAll('a[href]').forEach((el) => {
      const href = el.getAttribute('href')
      if (!router || !href || el.hasAttribute('x-link-attached')) return
      el.addEventListener('click', (e) => {
        e.preventDefault()
        const path = router.resolvePathname(href, url)
        router.history.push(path)
      })
      el.setAttribute('x-link-attached', '')
    })
}

export function removeAllChildNodes(parent: HTMLElement) {
  while (parent?.firstChild) {
    parent.firstChild.remove()
  }
}
