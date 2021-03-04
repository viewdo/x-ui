import { ensureBasename, hasBasename } from './path'

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

    expect(ensureBasename('/about', '/pages/routing/examples/simple.html#/')).toBe('/pages/routing/examples/simple.html#/about')
  })

  it('router: hasBaseName', async () => {
    expect(hasBasename('/root/home', '/root')).toBe(true)

    expect(hasBasename('/home', '')).toBe(true)

    expect(hasBasename('/home', '/')).toBe(true)

    expect(hasBasename('#/home', '#/')).toBe(true)

    expect(hasBasename('/examples/simple.html#/', '/examples/simple.html')).toBe(true)

    expect(hasBasename('/@root/home', '/@root')).toBe(true)

    expect(hasBasename('/pages/routing/examples/simple.html#/about', '/pages/routing/examples/simple.html#/')).toBe(true)
  })
})
