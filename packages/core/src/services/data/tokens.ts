import { requireValue } from '../common'
import {
  addDataProvider,
  getDataProvider,
  removeDataProvider,
} from './factory'
import { DataItemProvider } from './providers/item'

const tokenRegEx = /\{\{([\w-]*):([\w_]*)(?:\.([\w_.-]*))?(?:\?([\w_.-]*))?\}\}/gi

const escapeStringsRegex = /['"]?([a-zA-Z\/]{1}[\w-/_?.]+)['"]?/gi

export function hasToken(value: string) {
  return value.match(tokenRegEx)
}

/**
 * This function replaces all tokens: (ie `{{provider:key}}`) values with the actual values
 * from the expressed provider & key. This is used by {evaluateExpression}
 * before it is sent to {evaluate} for calculation.
 *
 * @export resolveTokens
 * @param {string} textWithTokens
 * @return {*}  {(Promise<string|null>)}
 */
export async function resolveTokens(
  textWithTokens: string,
  forExpression: boolean = false,
  data?: any,
): Promise<string> {
  requireValue(textWithTokens, 'valueExpression')

  let result = textWithTokens.slice()
  if (textWithTokens === null || textWithTokens === '') {
    return result
  }

  // If this expression doesn't match, leave it alone
  if (!hasToken(textWithTokens)) {
    return result
  }

  if (data) {
    addDataProvider('data', new DataItemProvider(data))
  }

  // Replace each match
  let match: string | RegExpExecArray | null

  while ((match = tokenRegEx.exec(textWithTokens))) {
    const expression = match[0]
    const providerKey = match[1]
    const dataKey = match[2]
    const propKey = match[3] || ''
    const defaultValue = match[4] || null

    const provider = await getDataProvider(providerKey)

    let value = (await provider?.get(dataKey)) || defaultValue

    if (propKey) {
      const object =
        typeof value === 'string' ? JSON.parse(value || '{}') : value
      const propSegments = propKey.split('.')
      let node = object
      propSegments.forEach(property => {
        node = node[property]
      })
      value =
        typeof node === 'object' ? JSON.stringify(node) : `${node}`
    }

    let replacement = value || ''
    if (forExpression) {
      if (value === null || value == undefined || value == '')
        replacement = 'null'
      else replacement = value.replace(escapeStringsRegex, `'$1'`)
    }

    result = result.replace(expression, replacement)
  }

  if (data) {
    removeDataProvider('data')
  }

  return result
}
