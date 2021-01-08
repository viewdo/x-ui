/* eslint-disable no-self-compare */
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * *
 */

const { hasOwnProperty } = Object.prototype

/**
 * Inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
const is = (x: any, y: any) => {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  }

  // Step 6.a: NaN == NaN
  return x !== x && y !== y
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export const shallowEqual = (objectA: any, objectB: any) => {
  if (is(objectA, objectB)) {
    return true
  }

  if (typeof objectA !== 'object' || objectA === null || typeof objectB !== 'object' || objectB === null) {
    return false
  }

  const keysA = Object.keys(objectA)
  const keysB = Object.keys(objectB)

  if (keysA.length !== keysB.length) {
    return false
  }

  // Test for A's keys different from B.
  for (const element of keysA) {
    if (!hasOwnProperty.call(objectB, element) || !is(objectA[element], objectB[element])) {
      return false
    }
  }

  return true
}
