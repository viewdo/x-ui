/* istanbul ignore file */

import { LocationSegments } from '../interfaces'
/**
 * Ensures basename
 * @param path
 * @param prefix
 * @returns
 */
export function ensureBasename(path: string, prefix: string) {
  let result = hasBasename(path, prefix) ? path : `${prefix}/${path}`
  result = stripTrailingSlash(result.replace(/[/]{2,}/gi, '/'))
  return addLeadingSlash(result)
}
/**
 * Paths has basename
 * @param path
 * @param prefix
 */
export const hasBasename = (path: string, prefix: string) =>
  path.startsWith(prefix) || new RegExp(`^${prefix}(\\/|\\?|#|$)`, 'i').test(path)

export const stripBasename = (path: string, prefix: string, hash: boolean) => {
  let stripped = hasBasename(path, prefix) ? path.slice(prefix.length) : path
  if (isFilename(path) || hash) {
    stripped = '#' + stripped
  }
  return addLeadingSlash(stripped)
}

export const isFilename = (path: string) => path.includes('.')

export const stripTrailingSlash = (path: string) => (path?.endsWith('/') ? path.slice(0, -1) : path)

export const addLeadingSlash = (path: string) => (path?.startsWith('/') ? path : `/${path}`)

export const stripLeadingSlash = (path: string) => (path?.startsWith('/') ? path.slice(1) : path)

export function parsePath(path = '/'): LocationSegments {
  let pathname = path
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

export function createPath(location: LocationSegments) {
  const { pathname, search, hash } = location
  let path = pathname || '/'

  if (search && search !== '?') {
    path += search?.startsWith('?') ? search : `?${search}`
  }

  if (hash && hash !== '#') {
    path += hash?.startsWith('#') ? hash : `#${hash}`
  }

  return path
}

export function parseQueryString(query: string) {
  if (!query) {
    return {}
  }

  return (/^[?#]/.test(query) ? query.slice(1) : query)
    .split('&')
    .reduce<Record<string, any>>((parameters, parameter) => {
      const [key, value] = parameter.split('=')

      parameters[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''
      return parameters
    }, {})
}
