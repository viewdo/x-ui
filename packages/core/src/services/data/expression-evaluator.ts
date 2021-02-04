import { Parser } from 'expr-eval'
import { warn } from '../logging'
import { hasVisited } from '../routing/visits'
import { requireValue } from '../utils/misc-utils'
import { toBoolean } from '../utils/string-utils'
import { ExpressionContext } from './interfaces'
import { addDataProvider, getDataProvider, removeDataProvider } from './providers/factory'
import { DataItemProvider } from './providers/item'

const expressionRegEx = /{([\w-]*):([\w_]*)(?:\.([\w_.-]*))?(?:\?([\w_.-]*))?}/g
const expressionEvaluator = new Parser()

expressionEvaluator.functions.didVisit = (url: string) => hasVisited(url)

export function hasExpression(valueExpression: string) {
  requireValue(valueExpression, 'valueExpression')
  return valueExpression.match(expressionRegEx)
}

/**
 * This function replaces all {provider:key} values with the actual values
 * from the expressed provider & key. This is used by {evaluateExpression}
 * before it is sent to {evaluate} for calculation.
 *
 * @export resolveExpression
 * @param {string} valueExpression
 * @return {*}  {(Promise<string|null>)}
 */
export async function resolveExpression(valueExpression: string, data?: any): Promise<string> {
  requireValue(valueExpression, 'valueExpression')

  if (valueExpression === null || valueExpression === '') {
    return valueExpression
  }

  // If this expression doesn't match, leave it alone
  if (!valueExpression.match(expressionRegEx)) {
    return valueExpression
  }

  // Make a copy to avoid side effects
  let result = valueExpression.slice()

  if (data) {
    addDataProvider('data', new DataItemProvider(data))
  }

  // Replace each match
  let match: string | RegExpExecArray | null

  while ((match = expressionRegEx.exec(valueExpression))) {
    const expression = match[0]
    const providerKey = match[1]
    const dataKey = match[2]
    const propKey = match[3] || ''
    const defaultValue = match[4] || ''

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

    result = result.replace(expression, value)
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
export function evaluate(expression: string, context: ExpressionContext = {}): number | boolean | string {
  requireValue(expression, 'expression')
  try {
    context.null = null
    context.empty = ''
    return expressionEvaluator.evaluate(expression.toLowerCase(), context)
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
  const detokenizedExpression = await resolveExpression(expression)
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
  let negation = false
  let workingExpression = expression.slice()
  if (workingExpression.startsWith('!')) {
    negation = true
    workingExpression = workingExpression.slice(1, workingExpression.length)
  }

  const detokenizedExpression = await resolveExpression(workingExpression)
  try {
    context.null = null
    context.empty = ''
    const result = expressionEvaluator.evaluate(detokenizedExpression, context)
    if (typeof result === 'boolean') {
      return result
    }

    if (typeof result === 'number') {
      return result > 0
    }

    return toBoolean(result)
  } catch {
    const result = toBoolean(detokenizedExpression)
    return negation ? !result : result
  }
}
