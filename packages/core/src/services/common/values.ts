/* istanbul ignore file */

/**
 * Throws an error if the value parameter is not defined.
 * @param {string} value the value that should not be null
 * @param {string} name the name of the parameter/variable to use in the error
 * @param {string|null} origin the name of the component/system throwing the error
 */
export function requireValue(
  value: any,
  name: string,
  origin: string | null = null,
): void {
  if (isNotValue(value)) {
    throw new Error(
      `${origin || 'X-UI'} : A value for ${name} was not provided.`,
    )
  }
}

/**
 * Evaluate a value for existence. True if not null or undefined
 * @param {string} value
 * @returns {boolean}
 */
export function isValue(value: any): boolean {
  return isNotValue(value) == false
}

/**
 * Evaluate a value for non-existence. True if null or undefined
 * @param {string} value
 * @returns {boolean}
 */
export function isNotValue(value: any): boolean {
  return value === undefined || value == null
}
