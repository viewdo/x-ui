;(self as any).importScripts('https://cdn.jsdelivr.net/npm/expr-eval@2.0.2/dist/bundle.min.js')

import type { ExpressionContext } from '../services/data/interfaces'

const expressionEvaluator = new (self as any).exprEval.Parser

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

  return expressionEvaluator.evaluate(expression, context)
}
