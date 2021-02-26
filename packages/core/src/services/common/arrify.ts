/**
 * Turn anything into an array.
 *
 * @param {any} any
 *
 * @returns {Array<any>}
 */

export function arrify(any: any): Array<any> {
  return any ? (Array.isArray(any) ? any : [any]) : []
}
