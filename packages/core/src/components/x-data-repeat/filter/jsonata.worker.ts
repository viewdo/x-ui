;(self as any).importScripts('https://cdn.jsdelivr.net/npm/jsonata@1.8.4/jsonata.min.js')

import { arrify } from '../../../services/common/arrify'
/**
 * Filters data
 * @param filterString
 * @param data
 * @returns
 */
export async function filterData(filterString: string, data: any) {
  const filter = (self as any).jsonata(filterString)
  return arrify(filter.evaluate(data))
}
