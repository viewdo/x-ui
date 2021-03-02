jest.mock('../common/logging')
jest.mock('./evaluate.worker')

import { addDataProvider } from './factory'
import { InMemoryProvider } from './providers/memory'
import { resolveTokens } from './tokens'

describe('resolveTokens', () => {
  let session: InMemoryProvider
  let storage: InMemoryProvider

  beforeEach(() => {
    session = new InMemoryProvider()
    storage = new InMemoryProvider()

    addDataProvider('session', session)
    addDataProvider('storage', storage)
  })

  it('returns null for non-existent value', async () => {
    const value = await resolveTokens('{{session:name}}')
    expect(value).toBe('')
  })

  it('returns null for non-existent values used in expressions', async () => {
    const value = await resolveTokens('{{session:name}}', true)
    expect(value).toBe('null')
  })


  it('returns empty for empty value', async () => {
    await session.set('name', '')
    const value = await resolveTokens('{{session:name}}')
    expect(value).toBe(``)
  })

  it('returns null for empty values in expressions', async () => {
    await session.set('name', '')
    const value = await resolveTokens('{{session:name}}', true)
    expect(value).toBe(`null`)
  })

  it('returns the literal string if no expression is detected', async () => {
    const value = await resolveTokens('my_value')
    expect(value).toBe('my_value')
  })

  it('returns the right value for a good expression', async () => {
    await session.set('name', 'biden')
    const value = await resolveTokens('{{session:name}}')
    expect(value).toBe('biden')
  })

  it('returns the right value for a JSON expression', async () => {
    await session.set('user', '{"name":"Joe"}')
    const value = await resolveTokens('{{session:user.name}}')
    expect(value).toBe('Joe')
  })

  it('returns the right value for a deep JSON expression', async () => {
    await session.set('user', '{"name": { "first":"Joe"}}')
    const value = await resolveTokens('{{session:user.name.first}}')
    expect(value).toBe('Joe')
  })

  it('replaces multiple expressions in the same string', async () => {
    await session.set('rate', '1')
    await session.set('vintage', '1985')
    const value = await resolveTokens('${{session:rate}} in {{session:vintage}}')
    expect(value).toBe('$1 in 1985')
  })

})
