import { requireValue, toBoolean, warn } from '../common'
import { evalExpression } from './evaluate.worker'
import { ExpressionContext } from './interfaces'
import { hasToken, resolveTokens } from './tokens'

const operatorRegex = /(in|for|[\>\<\+\-\=]{1})/gi

export function hasExpression(value: string) {
  return value.match(operatorRegex)
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
