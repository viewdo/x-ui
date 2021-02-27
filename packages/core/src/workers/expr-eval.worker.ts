;(self as any).importScripts('https://cdnjs.cloudflare.com/ajax/libs/expr-eval/2.0.2/bundle.min.js')

import type { ExpressionContext } from '../services/data/interfaces'
import { hasVisited } from '../services/navigation/visits'

let initialized = false
const expressionEvaluator = new (self as any).Parser()

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
  return expressionEvaluator.evaluate(expression, context)
}
