export type CookieAttributes = BaseCookieAttributes &
  SameSiteCookieAttributes

export interface BaseCookieAttributes {
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

export type SameSiteCookieAttributes =
  | LaxStrictSameSiteCookieAttributes
  | NoneSameSiteCookieAttributes

export interface LaxStrictSameSiteCookieAttributes {
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
export interface NoneSameSiteCookieAttributes {
  sameSite: 'none'
  secure: true
}

export type CookieConsent = {
  consented: boolean
}
