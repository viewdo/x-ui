import { logger } from '..'
import { SessionService } from '../data/session-service'
import { fetchRetry, promiseTimeout, stringToHash } from '../utils'

/**
 * Adds offline support to window.fetch - returning previous responses when offline, offline is detected when navigator.onLine = false or a request times-out
 * @param {string} url - URL to request
 * @param {object} options - fetch options with additional .offline property
 * @example
 *      const offLineOptions = {
 *
 *        timeout: 30 * 1000,         // how long should we wait before considering a connection offline?
 *        expires: 300 * 1000,        // how long should we store content without checking for an update?
 *        debug: true,                // console logger.debug all requests and their source (cache etc)
 *        renew: false,               // if true, this request is fetched regardless of expire state and added to cache
 *        // timeouts are not retried as they could cause the browser to hang
 *        retries: 3,                 // number of times to retry the request before considering it failed
 *        retryDelay: 1000,           // number of milliseconds to wait between each retry
 *        // what unique key should we use to cache the content
 *        cacheKeyGenerator: function(url, opts, hash) {
 *            return 'myapp:' + url;
 *        }
 *
 *      };
 *
 *      offlineFetch('https://courseof.life/johndoherty.json', options, offlineOptions).then(function(data) {
 *          // data contains either online request response or cached response
 *      });
 * @returns {Promise} executes .then with either cached or fetched response if successful, otherwise catch is throw
 */
export class OfflineFetchOptions {
  timeout?: number = 3 * 1000 // How long should we wait before considering a connection offline?
  expires?: number = 300 * 1000 // How long should we store content without checking for an update?
  debug?: boolean = false // Console logger.debug all requests and their source (cache etc)
  // timeouts are not retried as they could cause the browser to hang
  retries?: number = 10 // Number of times to retry the request before considering it failed
  retryDelay?: number = 500 // Number of milliseconds to wait between each retry
  // what unique key should we use to cache the content
  cacheKeyGenerator?: (url: string, options: OfflineFetchOptions, hash: string) => string
}

export class FetchService {
  constructor(public storage: SessionService, public options: OfflineFetchOptions) {
    if (options !== undefined && typeof options !== 'object') {
      throw new Error('If defined, options must be of type object')
    }
  }

  async fetch(url: string, fetchOptions: RequestInit, offline = true, renew = false, cacheOverride: number = this.options.expires) {
    if (!url || url === '') {
      return Promise.reject(new Error('Please provide a URL'))
    }

    if (!fetch) {
      return Promise.reject(new Error('fetch not supported, are you missing the window.fetch polyfill?'))
    }

    // Offline not requested, execute a regular fetch
    if (!offline) {
      return fetch(url, fetchOptions)
    }

    const { debug, timeout, retries, retryDelay, cacheKeyGenerator } = this.options

    const storage = this.storage

    // Method, defaults to GET
    const method = fetchOptions.method || 'GET'

    // Detect offline if supported (if true, browser supports the property & client is offline)
    const isOffline = !navigator.onLine

    // A hash of the method + url, used as default cache key if no generator passed
    const requestHash = 'offline:' + stringToHash(method + '|' + url)

    // If cacheKeyGenerator provided, use that otherwise use the hash generated above
    const cacheKey = typeof cacheKeyGenerator === 'function' ? cacheKeyGenerator(url, this.options, requestHash) : requestHash

    // Remove null items from options (EDGE does not like them)
    Object.keys(fetchOptions || {}).forEach((key) => {
      if (fetchOptions[key] === null) {
        delete fetchOptions[key]
      }
    })

    // Execute cache gets with a promise, just incase we're using a promise storage
    const cachedItem = storage.get(cacheKey)
    // Convert to JSON object if it's not already
    const parsedCachedItem = typeof cachedItem === 'string' ? JSON.parse(cachedItem) : cachedItem
    // Convert cached data into a fetch Response object, allowing consumers to process as normal
    let cachedResponse = null
    if (parsedCachedItem) {
      cachedResponse = new Response(parsedCachedItem.content, {
        status: parsedCachedItem.status,
        statusText: parsedCachedItem.statusText,
        headers: {
          'Content-Type': parsedCachedItem.contentType,
        },
      })
    }

    // Determine if the cached content has expired
    const cacheExpired = parsedCachedItem && cacheOverride > 0 ? Date.now() - parsedCachedItem.storedAt > cacheOverride : false
    // If the request is cached and we're offline, return cached content
    if (cachedResponse && isOffline) {
      if (debug) {
        logger.debug('offlineFetch[cache] (offline): ' + url)
      }

      return cachedResponse
    }

    // If the request is cached, expires is set but not expired, and this is not a renew request, return cached content
    if (cachedResponse && !cacheExpired && !renew) {
      if (debug) {
        logger.debug('offlineFetch[cache]: ' + url)
      }

      return cachedResponse
    }

    try {
      const res = await promiseTimeout(timeout, fetch(url, fetchOptions))
      // If response status is within 200-299 range inclusive res.ok will be true
      if (res.status >= 200 && res.status <= 299) {
        const contentType = res.headers.get('Content-Type') || ''

        // There is a .json() instead of .text() but we're going to store it as a string anyway.
        // If we don't clone the response, it will be consumed by the time it's returned.
        // This way we're being un-intrusive.
        const content = await res.clone().text()

        const contentToStore = JSON.stringify({
          status: res.status,
          statusText: res.statusText,
          contentType,
          content,
          storedAt: Date.now(), // Store the date-time in milliseconds that the item was cached
        })

        // Store the content in cache as a JSON object
        storage.set(cacheKey, contentToStore)
      }

      if (debug) {
        logger.debug('offlineFetch[live]: ' + url)
      }

      return res
    } catch (error) {
      const errorMessage = error.message || ''
      const timedout = errorMessage === 'Promise Timed Out'

      // If its a timeout and we have a cached response, return it
      if (timedout && cachedResponse) {
        if (debug) {
          logger.debug('offlineFetch[cache] (timedout): ' + url)
        }

        return cachedResponse
      }

      // If it was not a timeout, but we have retries, try them
      if (!timedout && retries) {
        if (debug) {
          logger.debug('offlineFetch[' + errorMessage + '] (retrying): ' + url)
        }

        // Retry fetch
        return fetchRetry(url, fetchOptions, retries, retryDelay, debug, logger)
      }

      throw error
    }
  }
}
