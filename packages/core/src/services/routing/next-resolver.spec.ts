jest.mock('../logging')

import { actionBus, eventBus } from '..'
import { evaluatePredicate } from '../data'
import { addDataProvider } from '../data/providers/factory'
import { InMemoryProvider } from '../data/providers/memory'
import { IViewDo, VisitStrategy } from './interfaces'
import { resolveNext } from './next-resolver'

describe('next-resolver', () => {
  let toDos: IViewDo[]
  let session: InMemoryProvider
  beforeEach(() => {
    session = new InMemoryProvider()
    addDataProvider('session', session)
    toDos = []
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  it('find next with only one item', async () => {
    await session.set('name', 'biden')

    const todo = {
      visit: VisitStrategy.always,
      when: '"{session:name}" != empty',
      visited: false,
      path: 'me',
      url: 'home',
    }

    toDos.push(todo)

    const result = await resolveNext(toDos)
    expect(result).toBe(todo)
  })

  it('find next with when using negation', async () => {
    await session.set('name', 'biden')

    const todo = {
      visit: VisitStrategy.always,
      when: '!{session:name}',
      visited: false,
      path: 'me',
      url: 'home',
    }

    toDos.push(todo)

    const result = await resolveNext(toDos)
    expect(result).toBeNull()
  })

  it('find next with when using negation, no value', async () => {
    const todo = {
      visit: VisitStrategy.always,
      when: '!{session:name}',
      visited: false,
      path: 'me',
      url: 'home',
    }

    toDos.push(todo)

    const result = await resolveNext(toDos)
    expect(result).toBe(result)
  })

  it('find next with only one item visited', async () => {
    await session.set('name', 'biden')

    const todo = {
      visit: VisitStrategy.always,
      when: '"{session:name}" !== empty',
      visited: true,
      path: 'me',
      url: 'home',
    }

    toDos.push(todo)

    const result = await resolveNext(toDos)
    expect(result).toBe(todo)
  })

  it('find next with visited restriction still applicable', async () => {
    await session.set('name', 'biden')

    const todo1 = {
      visit: VisitStrategy.always,
      when: '"{session:name}" != empty',
      visited: true,
      path: 'me',
      url: 'home',
    }

    toDos.push(todo1)

    const pred = await evaluatePredicate(todo1.when)
    expect(pred).toBe(true)

    const result = await resolveNext(toDos)
    expect(result).toBe(todo1)
  })

  it('find next with all open, should give first', async () => {
    const todo1 = {
      visit: VisitStrategy.always,
      visited: false,
      url: 'foo',
    }
    const todo2 = {
      visit: VisitStrategy.always,
      visited: false,
      url: 'boo',
    }

    toDos.push(todo1, todo2)

    const result = await resolveNext(toDos)
    expect(result).toBe(todo1)
  })

  it('one visited and one optional', async () => {
    const todo1 = {
      visit: VisitStrategy.optional,
      visited: false,
      url: 'home',
    }
    const todo2 = {
      visit: VisitStrategy.always,
      visited: false,
      url: 'profile',
    }

    toDos.push(todo1, todo2)

    const result = await resolveNext(toDos)
    expect(result).toBe(todo2)
  })

  it('all optional', async () => {
    const todo1 = {
      visit: VisitStrategy.optional,
      visited: false,
      url: 'home',
    }
    const todo2 = {
      visit: VisitStrategy.optional,
      visited: false,
      url: 'profile',
    }

    toDos.push(todo1, todo2)

    const result = await resolveNext(toDos)
    expect(result).toBe(null)
  })
})
