import { evaluatePredicate } from '../data/expression-evaluator';
import { IViewDo, VisitStrategy } from './interfaces';
import { hasVisited } from './visits';

async function getVisited(item: IViewDo) {
  if (item.when) {
    const shouldGo = await evaluatePredicate(item.when);
    return shouldGo ? false : true
  }
  return hasVisited(item.url)
}

async function applyPredicate(viewDo: IViewDo): Promise<IViewDo> {
  const { when, url, visit = VisitStrategy.once } = viewDo
  const visited = await getVisited(viewDo)
  return { when, visit, visited, url }
}

async function findFirstUnvisited(doList: IViewDo[]): Promise<IViewDo | null> {
  const found = doList
    .filter((d) => d.visit !== VisitStrategy.optional)
    .find(i => i.visited == false)
  return found || null
}

export async function resolveNext(childViewDos: Array<IViewDo>): Promise<IViewDo | null> {
  const converted = childViewDos.slice()

  await Promise.all(converted.map(async (e,i) => {
    converted[i] = await applyPredicate(e);
  }))

  return findFirstUnvisited(converted)
}
