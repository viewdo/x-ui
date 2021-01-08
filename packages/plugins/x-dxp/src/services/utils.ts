import { LoggingService } from './logging'

export function requireValue(value: string, name: string): void {
  if (value == undefined || value == '') {
    throw new Error(`A value for ${name} was not provided.`)
  }
}

export function getLocalDate(utcDateString: string, justDate = false): string {
  const milliseconds = Date.parse(utcDateString)
  const offset = new Date().getTimezoneOffset() * 60 * 1000
  if (!isNaN(milliseconds)) {
    const serverDate = new Date(milliseconds)
    const localDate = new Date(serverDate.getTime() - offset)

    if (justDate) {
      return localDate.toISOString().slice(0, 10)
    }

    return localDate.toISOString().replace('Z', '')
  }
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

/**
 * Wraps a promise in a timeout, allowing the promise to reject if not resolve with a specific period of time
 * @param {integer} ms - milliseconds to wait before rejecting promise if not resolved
 * @param {Promise} promise to monitor
 * @example
 *  promiseTimeout(1000, fetch('https://courseof.life/johndoherty.json'))
 *      .then(function(cvData){
 *          alert(cvData);
 *      })
 *      .catch(function(){
 *          alert('request either failed or timed-out');
 *      });
 * @returns {Promise} resolves as normal if not timed-out, otherwise rejects
 */
export async function promiseTimeout(ms: number, promise: Promise<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    // Create a timeout to reject promise if not resolved
    const timer = setTimeout(() => {
      reject(new Error('Promise Timed Out'))
    }, ms)

    promise
      .then((res) => {
        clearTimeout(timer)
        resolve(res)
      })
      .catch((error) => {
        clearTimeout(timer)
        reject(error)
      })
  })
}

/**
 * Returns the hash of string (slightly compressed)
 * @param {string} value - string to hash
 * @returns {string} hash of the value
 */
export function stringToHash(value: string): string {
  let hash = 0

  if (value.length === 0) {
    return hash.toString()
  }

  for (let i = 0, l = value.length; i < l; i++) {
    const char = value.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash &= hash // Convert to 32bit integer
  }

  return hash.toString()
}

/**
 * Retries a fetch if it fails
 * @param {string} url - url to fetch
 * @param {object} options - fetch options
 * @param {integer} retries - number of times to retry the request
 * @param {integer} retryDelay - the number of milliseconds to wait between retries
 * @param {boolean} debug - logs retry count to console if true
 * @returns {Promise} executes .then if successful otherwise .catch
 */
export async function fetchRetry(url, options, retries, retryDelay, debug, logger: LoggingService) {
  retries = retries || 3
  retryDelay = retryDelay || 1000

  return new Promise((resolve, reject) => {
    const wrappedFetch = (n) => {
      if (debug) {
        logger.debug('offlineFetch[retrying] (' + n + ' of ' + retries + '): ' + url)
      }

      fetch(url, options)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          if (n > 0) {
            setTimeout(() => {
              wrappedFetch(--n)
            }, retryDelay)
          } else {
            reject(error)
          }
        })
    }

    wrappedFetch(retries)
  })
}
