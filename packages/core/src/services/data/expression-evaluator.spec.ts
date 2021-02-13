jest.mock('../logging')

import { clearVisits, markVisit } from '../navigation/visits'
import { evaluate, evaluateExpression, evaluatePredicate, resolveExpression } from './expression-evaluator'
import { addDataProvider } from './providers/factory'
import { InMemoryProvider } from './providers/memory'

describe('resolveExpression', () => {
  let session: InMemoryProvider
  let storage: InMemoryProvider

  beforeEach(() => {
    session = new InMemoryProvider()
    storage = new InMemoryProvider()

    addDataProvider('session', session)
    addDataProvider('storage', storage)
  })

  it('returns null for non-existent value', async () => {
    const value = (await resolveExpression('{session:name}')) || ''
    expect(value).toBe('')
  })

  it('returns the literal string if no expression is detected', async () => {
    const value = await resolveExpression('my_value')
    expect(value).toBe('my_value')
  })

  it('returns the right value for a good expression', async () => {
    await session.set('name', 'biden')
    const value = await resolveExpression('{session:name}')
    expect(value).toBe('biden')
  })

  it('returns the right value for a JSON expression', async () => {
    await session.set('user', '{"name":"Joe"}')
    const value = await resolveExpression('{session:user.name}')
    expect(value).toBe('Joe')
  })

  it('returns the right value for a deep JSON expression', async () => {
    await session.set('user', '{"name": { "first":"Joe"}}')
    const value = await resolveExpression('{session:user.name.first}')
    expect(value).toBe('Joe')
  })

  it('replaces multiple expressions in the same string', async () => {
    await session.set('rate', '1')
    await session.set('vintage', '1985')
    const value = await resolveExpression('${session:rate} in {session:vintage}')
    expect(value).toBe('$1 in 1985')
  })
})

describe('evaluate', () => {
  it('evaluates simple math', async () => {
    const value = await evaluate('1 + 1')
    expect(value).toBe(2)
  })

  it('evaluates simple predicate', async () => {
    const value = await evaluate('2 == 2')
    expect(value).toBe(true)
  })

  it('evaluates string comparison expression', async () => {
    const value = await evaluate('"word" == "word"')
    expect(value).toBe(true)
  })

  it('evaluates string comparison expression (false)', async () => {
    const value = await evaluate('"word" != "word"')
    expect(value).toBe(false)
  })

  it('evaluates value in array expression', async () => {
    const value = await evaluate('1 in [1,2,3]')
    expect(value).toBe(true)
  })

  it('evaluates value in array expression (false)', async () => {
    const value = await evaluate('4 in [1,2,3]')
    expect(value).toBe(false)
  })
})

describe('evaluateExpression', () => {
  let session: InMemoryProvider
  let storage: InMemoryProvider

  beforeEach(() => {
    session = new InMemoryProvider()
    storage = new InMemoryProvider()

    addDataProvider('session', session)
    addDataProvider('storage', storage)
  })

  it('evaluates simple math', async () => {
    const value = await evaluateExpression('1+1')
    expect(value).toBe(2)
  })

  it('evaluates simple predicate', async () => {
    const value = await evaluateExpression('2==2')
    expect(value).toBe(true)
  })

  it('evaluates simple expression with data-provider values', async () => {
    await session.set('rate', '1')
    await session.set('vintage', '1985')
    const value = await evaluateExpression('{session:rate} + {session:vintage}')
    expect(value).toBe(1986)
  })

  it('evaluates array in expression', async () => {
    await session.set('items', '["foo","boo"]')
    await session.set('item', 'foo')
    const value = await evaluateExpression('"{session:item}" in {session:items}')
    expect(value).toBe(true)
  })

  it('evaluates default values', async () => {
    const value = await evaluateExpression('"{bad:value?default}"')
    expect(value).toBe('default')
  })

  it('evaluates default values unquoted', async () => {
    const value = await evaluateExpression('{bad:value?default}')
    expect(value).toBe('default')
  })
})

describe('evaluatePredicate [session]', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    session = new InMemoryProvider()
    addDataProvider('session', session)
  })

  it('evaluates simple predicate with data-provider values', async () => {
    await session.set('a', '1')
    await session.set('b', '1985')
    const value = await evaluatePredicate('{session:a} < {session:b}')
    expect(value).toBe(true)
  })

  it('evaluates simple predicate with data-provider values reversed', async () => {
    await session.set('a', '1985')
    await session.set('b', '1')
    const value = await evaluatePredicate('{session:a} > {session:b}')
    expect(value).toBe(true)
  })

  it('evaluates simple predicate with data-provider values equal', async () => {
    await session.set('a', '5')
    await session.set('b', '5')
    const value = await evaluatePredicate('{session:a} == {session:b}')
    expect(value).toBe(true)
  })

  it('evaluates simple predicate with data-provider values not equal', async () => {
    await session.set('a', '5')
    await session.set('b', '5')
    const value = await evaluatePredicate('{session:a} != {session:b}')
    expect(value).toBe(false)
  })

  it('evaluates string predicate with data-provider values equal', async () => {
    await session.set('a', 'foo')
    const value = await evaluatePredicate('"{session:a}" == "foo"')
    expect(value).toBe(true)
  })

  it('string predicate with data-provider values not equal', async () => {
    await session.set('a', 'foo')
    const value = await evaluatePredicate('"{session:a}" != "foo"')
    expect(value).toBe(false)
  })

  it('string predicate with data-provider values without quotes', async () => {
    await session.set('a', 'foo')
    const value = await evaluatePredicate('"{session:a}" != "foo"')
    expect(value).toBe(false)
  })

  it('evaluates string includes', async () => {
    await session.set('a', 'foo')
    const value = await evaluatePredicate('"f" in "{session:a}"')
    expect(value).toBe(true)
  })

  it('evaluates string includes false', async () => {
    await session.set('a', 'foo')
    const value = await evaluatePredicate('"d" in "{session:a}"')
    expect(value).toBe(false)
  })

  it('evaluates string "true" to be true', async () => {
    const value = await evaluatePredicate('true')
    expect(value).toBe(true)
  })

  it('evaluates string "True" to be true', async () => {
    const value = await evaluatePredicate('True')
    expect(value).toBe(true)
  })

  it('evaluates string "value" to be true', async () => {
    const value = await evaluatePredicate('"value"')
    expect(value).toBe(true)
  })

  it('evaluates empty strings', async () => {
    await session.set('a', '')
    const value = await evaluatePredicate('{session:a} == empty')
    expect(value).toBe(true)
  })

  it('evaluates did visit', async () => {
    markVisit('/foo')
    const value = await evaluatePredicate('didVisit("/foo")')
    expect(value).toBe(true)
  })

  it('evaluates did not visit', async () => {
    clearVisits()
    const value = await evaluatePredicate('didVisit("/foo")')
    expect(value).toBe(false)
  })

  it('evaluates null session values', async () => {
    const value = await evaluatePredicate('{session:bad}')
    expect(value).toBe(false)
  })

  it('evaluates not null session values', async () => {
    const value = await evaluatePredicate('"{session:bad}" != empty')
    expect(value).toBe(false)
  })

  it('evaluates null session values as empty', async () => {
    const value = await evaluatePredicate('{session:bad} == empty')
    expect(value).toBe(true)
  })

  it('evaluates with ! for true on empty', async () => {
    const value = await evaluatePredicate('!{session:bad}')
    expect(value).toBe(true)
  })

  it('evaluates with ! for false on not empty', async () => {
    await session.set('name', 'jason')
    const value = await evaluatePredicate('!{session:name}')
    expect(value).toBe(false)
  })

  it('evaluates with ! for true when value', async () => {
    await session.set('name', 'jason')
    const value = await evaluatePredicate('{session:name}')
    expect(value).toBe(true)
  })

  it('evaluates with ! for false on not empty string', async () => {
    await session.set('name', '')
    const value = await evaluatePredicate('!{session:name}')
    expect(value).toBe(true)
  })
})
