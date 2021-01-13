/* istanbul ignore file */

type CookieAttributes = BaseCookieAttributes & SameSiteCookieAttributes

interface BaseCookieAttributes {
  /**
   * A number will be interpreted as days from time of creation
   */
  expires?: Date | number

  /**
   * Hosts to which the cookie will be sent
   */
  domain?: string

  /**
   * The cookie will only be included in an HTTP request if the request
   * path matches (or is a subdirectory of) the cookie's path attribute.
   */
  path?: string

  /**
   * If enabled, the cookie will only be included in an HTTP request
   * if it is transmitted over a secure channel (typically HTTP over TLS).
   */
  secure?: boolean
}

type SameSiteCookieAttributes = LaxStrictSameSiteCookieAttributes | NoneSameSiteCookieAttributes

interface LaxStrictSameSiteCookieAttributes {
  /**
   * Only send the cookie if the request originates from the same website the
   * cookie is from. This provides some protection against cross-site request
   * forgery attacks (CSRF).
   *
   * The strict mode withholds the cookie from any kind of cross-site usage
   * (including inbound links from external sites). The lax mode withholds
   * the cookie on cross-domain sub-requests (e.g. images or frames), but
   * sends it whenever a user navigates safely from an external site (e.g.
   * by following a link).
   */
  sameSite?: 'strict' | 'lax'
}

/**
 * Cookies with `SameSite=None` must also specify 'Secure'
 */
interface NoneSameSiteCookieAttributes {
  sameSite: 'none'
  secure: true
}

function stringifyAttribute(key: string, value: string | boolean | undefined): string {
  if (!value) {
    return ''
  }

  const stringified = `; ${key}`
  if (value === true) {
    return stringified // Boolean attributes shouldn't have a value
  }

  return `${stringified}=${value}`
}

function stringifyAttributes(attributes: CookieAttributes): string {
  if (typeof attributes.expires === 'number') {
    const expires = new Date()
    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e5)
    attributes.expires = expires
  }

  return (
    stringifyAttribute('Expires', attributes.expires ? attributes.expires.toUTCString() : '') +
    stringifyAttribute('Domain', attributes.domain) +
    stringifyAttribute('Path', attributes.path) +
    stringifyAttribute('Secure', attributes.secure) +
    stringifyAttribute('SameSite', attributes.sameSite)
  )
}

function readValue(value: string): string {
  return value.replace(/%3B/g, ';')
}

function writeValue(value: string): string {
  return value.replace(/;/g, '%3B')
}

function encode(key: string, value: string, attributes: CookieAttributes): string {
  return `${writeValue(key).replace(/=/g, '%3D')}=${writeValue(value)}${stringifyAttributes(attributes)}`
}

function parse(cookieString: string): Record<string, string> {
  const result: Record<string, string> = {}
  const cookies = cookieString ? cookieString.split('; ') : []

  for (const cookie of cookies) {
    const parts = cookie.split('=')
    const value = parts.slice(1).join('=')
    const name = readValue(parts[0]).replace(/%3D/g, '=')
    result[name] = readValue(value)
  }

  return result
}

export function getAll(document: HTMLDocument): Record<string, string> {
  return parse(document.cookie)
}

export function getCookie(document: HTMLDocument, key: string): string | undefined {
  return getAll(document)[key]
}

export function setCookie(document: HTMLDocument, key: string, value: string, attributes?: CookieAttributes): void {
  document.cookie = encode(key, value, { path: '/', ...attributes })
}
