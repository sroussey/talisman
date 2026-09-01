/**
 * Talisman helpers
 * =================
 *
 * Miscellaneous helper functions.
 */

import type {Sequence} from '../types.js';

/**
 * Function returning all the matches of a regular expression over the given
 * string.
 *
 * @param  pattern - The regular expression to apply.
 * @param  string  - The string to match.
 * @return An array of matches.
 */
export function findall(pattern: RegExp, string: string): RegExpExecArray[] {
  const matches: RegExpExecArray[] = [];

  if (!pattern.global) {
    const result = pattern.exec(string);

    if (result)
      matches.push(result);

    return matches;
  }

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(string)))
    matches.push(match);

  // Resetting state of the Regex for safety
  pattern.lastIndex = 0;

  return matches;
}

/**
 * Function normalizing the given variable into a proper array sequence.
 *
 * @param  target - The variable to normalize as a sequence.
 * @return The resulting sequence.
 */
export function seq(target: string): string[];
export function seq<T>(target: readonly T[]): readonly T[];
export function seq<T>(target: Sequence<T>): readonly (T | string)[];
export function seq(target: Sequence<unknown>): readonly unknown[] {
  return typeof target === 'string' ? target.split('') : target;
}

/**
 * Function squeezing the given sequence by dropping consecutive duplicates.
 *
 * Note: the name was actually chosen to mimic Ruby's naming since I did not
 * find any equivalent in other standard libraries.
 *
 * @param  target - The sequence to squeeze.
 * @return The resulting sequence.
 */
export function squeeze(target: string): string;
export function squeeze<T>(target: readonly T[]): T[];
export function squeeze<T>(target: Sequence<T>): string | T[];
export function squeeze(target: Sequence<unknown>): string | unknown[] {
  const isString = typeof target === 'string',
        sequence = seq(target),
        squeezed: unknown[] = [sequence[0]];

  for (let i = 1, l = sequence.length; i < l; i++) {
    if (sequence[i] !== sequence[i - 1])
      squeezed.push(sequence[i]);
  }

  return isString ? squeezed.join('') : squeezed;
}

/**
 * Function creating an index of mapped letters.
 *
 * @param  first  - First letters.
 * @param  second - Second letters.
 * @return The resulting index.
 */
export function translation(first: string, second: string): Record<string, string> {
  const index: Record<string, string> = {};

  const firstLetters = first.split(''),
        secondLetters = second.split('');

  if (firstLetters.length !== secondLetters.length)
    throw Error('talisman/helpers#translation: given strings don\'t have the same length.');

  for (let i = 0, l = firstLetters.length; i < l; i++)
    index[firstLetters[i]] = secondLetters[i];

  return index;
}
