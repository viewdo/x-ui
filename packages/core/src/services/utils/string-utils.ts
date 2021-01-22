/**
 * Turns 'truthy' values into true and 'falsy' into false.
 * @param {any} value
 * @return {boolean}
 */
export function toBoolean(value: string) {
  if (value == undefined || value == null) {
    return false
  }

  const stringResult = value.slice()
  if (['false', 'no', 'off', '!'].includes(stringResult.toLocaleLowerCase().trim())) {
    return false
  }

  if (['true', 'yes', 'on'].includes(stringResult.toLocaleLowerCase().trim())) {
    return true
  }

  return value !== ''
}

/**
 * Convert kebab case to camel
 *
 * @example some-attribute => someAttribute
 *
 * @param {string} kebabString
 * @return {string}
 */
export function kebabToCamelCase(kebabString: string) {
  return kebabString.toLowerCase().replace(/-./g, (x) => x[1].toUpperCase())
}
