import { evaluatePredicate } from '../data'
import { IViewDo, VisitStrategy } from './interfaces'
import { hasVisited } from './visits'

async function applyPredicate(viewDo: IViewDo): Promise<IViewDo> {
  let { when, url, visit = VisitStrategy.once } = viewDo
  let visited = await hasVisited(url)
  if (when) {
    const shouldGo = await evaluatePredicate(when)
    if (shouldGo) {
      visit = VisitStrategy.once
      visited = false
    } else {
      visit = VisitStrategy.optional
    }
  }
  return { when, visit, visited, url }
}

async function findFirstUnvisited(doList: IViewDo[]): Promise<IViewDo | null> {
  const found = doList.filter(d => d.visit !== VisitStrategy.optional).find(i => i.visited == false)
  return found || null
}

export async function resolveNext(childViewDos: Array<IViewDo>): Promise<IViewDo | null> {
  const converted = await Promise.all(childViewDos.map(e => applyPredicate(e)))

  const result = findFirstUnvisited(converted)

  return result
}
