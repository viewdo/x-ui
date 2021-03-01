import { evalExpression } from '../../workers/expr-eval.worker'
import { warn } from '../common/logging'
import { requireValue } from '../common/requireValue'
import { toBoolean } from '../common/strings'
import { hasVisited } from '../navigation'
import { ExpressionContext } from './interfaces'
import { addDataProvider, getDataProvider, removeDataProvider } from './providers/factory'
import { DataItemProvider } from './providers/item'

const expressionRegEx = /\{\{([\w-]*):([\w_]*)(?:\.([\w_.-]*))?(?:\?([\w_.-]*))?\}\}/gi
const funcRegEx = /[\{]{0,2}didVisit\(['"](.*)["']\)[\}]{0,2}/gi
const operatorRegex = /(in|for|[\>\<\+\-\=]{1})/gi
const escapeStringsRegex = /['"]?([a-zA-Z\/]{1}[\w-/_?.]+)['"]?/gi

export function hasToken(valueExpression: string) {
  return valueExpression.match(expressionRegEx)
}

export function hasExpression(value: string) {
  return value.match(operatorRegex) || value.match(funcRegEx)
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
export async function resolveTokens(textWithTokens: string, forExpression:boolean = false, data?: any): Promise<string> {
  requireValue(textWithTokens, 'valueExpression')

  let result = textWithTokens.slice()
  if (textWithTokens === null || textWithTokens === '') {
    return result
  }


  // If this expression doesn't match, leave it alone
  if (!textWithTokens.match(expressionRegEx) && !textWithTokens.match(funcRegEx)) {
    return result
  }


  if (data) {
    addDataProvider('data', new DataItemProvider(data))
  }

  if (textWithTokens.match(funcRegEx)) {
    const matches = funcRegEx.exec(textWithTokens)
    const value = matches ? hasVisited(matches[1]) : false
    result = textWithTokens.replace(funcRegEx, value.toString())
  }


  // Replace each match
  let match: string | RegExpExecArray | null

  while ((match = expressionRegEx.exec(textWithTokens))) {
    const expression = match[0]
    const providerKey = match[1]
    const dataKey = match[2]
    const propKey = match[3] || ''
    const defaultValue = match[4] || null

    const provider = await getDataProvider(providerKey)

    let value = (await provider?.get(dataKey)) || defaultValue

    if (propKey) {
      const object = typeof value === 'string' ? JSON.parse(value || '{}') : value
      const propSegments = propKey.split('.')
      let node = object
      propSegments.forEach((property) => {
        node = node[property]
      })
      value = typeof node === 'object' ? JSON.stringify(node) : `${node}`
    }

    let replacement = value || ''
    if (forExpression) {
      if (value === null || value == undefined || value == '')
        replacement = 'null'
      else
        replacement = value.replace(escapeStringsRegex, `'$1'`)
    }

    result = result.replace(expression, replacement)
  }

  if (data) {
    removeDataProvider('data')
  }

  return result
}

/**
 * This base expression parsing is performed by the library: expr-eval
 * Documentation: https://github.com/silentmatt/expr-eval
 *
 * @export evaluate
 * @param {string} expression A js-based expression for value comparisons or calculations
 * @param {object} context An object holding any variables for the expression.
 */
async function evaluate(
  expression: string,
  context: ExpressionContext = {},
): Promise<number | boolean | string> {
  requireValue(expression, 'expression')
  if (!hasExpression(expression))
    return expression

  try {
    context.null = null

    return await evalExpression(expression, context)
  } catch (error) {
    warn(`An exception was raised evaluating expression '${expression}': ${error}`)
    return expression
  }
}

/**
 * This function first resolves any data-tokens, then passes the response to the
 * {evaluate} function.
 *
 * @export evaluateExpression
 * @param {string} expression
 * @param {*} [context={}]
 * @return {*}  {Promise<any>}
 */
export async function evaluateExpression(expression: string, context: ExpressionContext = {}): Promise<any> {
  requireValue(expression, 'expression')

  const detokenizedExpression = await resolveTokens(expression, true)
  return evaluate(detokenizedExpression, context)
}

/**
 * This function first resolves any data-tokens, then passes the response to the
 * {evaluate} function, but uses the value to determine a true/false.
 *
 * @export
 * @param {string} expression
 * @param {ExpressionContext} [context={}]
 * @return {*}  {Promise<boolean>}
 */
export async function evaluatePredicate(expression: string, context: ExpressionContext = {}): Promise<boolean> {
  requireValue(expression, 'expression')

 let workingExpression = expression.slice()

 if (workingExpression.match(funcRegEx)) {
    const matches = funcRegEx.exec(workingExpression)
    const value = matches ? hasVisited(matches[1]) : false
    workingExpression = workingExpression.replace(funcRegEx, value.toString())
  }

  if (hasToken(workingExpression))
    workingExpression = await resolveTokens(workingExpression, true)

  if (!workingExpression) return false

  const negation = workingExpression.startsWith('!')

  if (negation) {
    workingExpression = workingExpression.slice(1, workingExpression.length)
  }

  let result:any =  toBoolean(workingExpression)
  if (hasExpression(workingExpression)) {
    try {
      result = await evaluate(workingExpression, context)
    } catch { }
  }
  return negation ? !result : result
}
