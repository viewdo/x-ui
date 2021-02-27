import { Parser } from 'expr-eval'
import type { ExpressionContext } from '../../services/data/interfaces'
import { hasVisited } from '../../services/navigation/visits'

let initialized = false
const expressionEvaluator = new Parser()
expressionEvaluator.functions.didVisit = function (url: string) {
  return hasVisited(url)
}

/**
 * This base expression parsing is performed by the library: expr-eval
 * Documentation: https://github.com/silentmatt/expr-eval
 *
 * @export evaluate
 * @param {string} expression A js-based expression for value comparisons or calculations
 * @param {object} context An object holding any variables for the expression.
 */
export async function evalExpression(
  expression: string,
  context: ExpressionContext = {},
): Promise<number | boolean | string> {
  if (!initialized) {
    expressionEvaluator.functions.didVisit = function (url: string) {
      return hasVisited(url)
    }
  }

  if (expression == undefined || expression == null) return ''
  return expressionEvaluator.evaluate(expression, context)
}
