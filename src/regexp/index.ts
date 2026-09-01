/**
 * Talisman regexp
 * ================
 *
 * Some RegExp-related helpers.
 */

/**
 * Function escaping a string for insertion in a regular expression.
 *
 * @param string - The string to escape.
 * @return The escaped string.
 */
const RE = /([|\\{}()[\]^$+*?.\-])/g;

export function escapeRegexp(string: string): string {
  return string.replace(RE, '\\$1');
}

/**
 * Function creating a fuzzy matching pattern from the given query.
 *
 * @param string - The string to escape.
 * @return The created pattern.
 */
export function createFuzzyPattern(query: string): string {
  return query
    .split('')
    .map((character: string) => {
      return `(${escapeRegexp(character)})`;
    })
    .join('.*?');
}
