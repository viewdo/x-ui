/* istanbul ignore file */

import { LocationSegments } from '../interfaces'

export const hasBasename = (path: string, prefix: string) => new RegExp(`^${prefix}(\\/|\\?|#|$)`, 'i').test(path)

export const stripBasename = (path: string, prefix: string) => (hasBasename(path, prefix) ? path.slice(prefix.length) : path)

export const stripTrailingSlash = (path: string) => (path.endsWith('/') ? path.slice(0, -1) : path)

export const addLeadingSlash = (path: string) => (path.startsWith('/') ? path : `/${path}`)

export const stripLeadingSlash = (path: string) => (path.startsWith('/') ? path.slice(1) : path)

export const stripPrefix = (path: string, prefix: string) => (path.startsWith(prefix) ? path.slice(prefix.length) : path)

export const parsePath = (path: string): LocationSegments => {
  let pathname = path || '/'
  let search = ''
  let hash = ''

  const hashIndex = pathname.indexOf('#')
  if (hashIndex !== -1) {
    hash = pathname.slice(hashIndex)
    pathname = pathname.slice(0, Math.max(0, hashIndex))
  }

  const searchIndex = pathname.indexOf('?')
  if (searchIndex !== -1) {
    search = pathname.slice(searchIndex)
    pathname = pathname.slice(0, Math.max(0, searchIndex))
  }

  return {
    pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash,
    query: {},
    key: '',
    params: {},
  }
}

export const createPath = (location: LocationSegments) => {
  const { pathname, search, hash } = location
  let path = pathname || '/'

  if (search && search !== '?') {
    path += search.startsWith('?') ? search : `?${search}`
  }

  if (hash && hash !== '#') {
    path += hash.startsWith('#') ? hash : `#${hash}`
  }

  return path
}

export const parseQueryString = (query: string) => {
  if (!query) {
    return {}
  }

  return (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce<Record<string, any>>((parameters, parameter) => {
    const [key, value] = parameter.split('=')
    // eslint-disable-next-line no-param-reassign
    parameters[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''
    return parameters
  }, {})
}
