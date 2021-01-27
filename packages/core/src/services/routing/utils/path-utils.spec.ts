import { ensureBasename } from './path-utils'

describe('match-path:', () => {
  it('renders', async () => {})
})

describe('path-utils', () => {
  it('router: ensureBasename', async () => {
    expect(ensureBasename('/home', '/root')).toBe('/root/home')

    expect(ensureBasename('/home', '')).toBe('/home')

    expect(ensureBasename('/home', '/')).toBe('/home')

    expect(ensureBasename('/home', '')).toBe('/home')

    expect(ensureBasename('/home', '/@root')).toBe('/@root/home')
  })
})
