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
  if (['false', 'no', 'off', '!', '0', 'null', 'undefined', ''].includes(stringResult.toLocaleLowerCase().trim())) {
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
  return kebabString.toLowerCase().replace(/-./g, x => x[1].toUpperCase())
}

/**
 *
 * @param text
 */
export function slugify(text: String) {
  return text
    .toString() // Cast to string
    .toLowerCase() // Convert the string to lowercase letters
    .normalize('NFD') // The normalize() method returns the Unicode Normalization Form of a given string.
    .trim() // Remove whitespace from both sides of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}
