/**
 * Talisman helpers/frequencies
 * =============================
 *
 * Functions related to sequences' frequencies.
 */
import {seq} from './index.js';
import type {Frequencies, Sequence} from '../types.js';

/**
 * Function taking a sequence and computing its frequencies.
 *
 * @param  sequence - The sequence to process.
 * @return A dict of the sequence's frequencies.
 *
 * @example
 *   // frequencies([1, 1, 2, 3, 3, 3]) => {1: 2, 2: 1, 3: 3}
 *   // frequencies('test') => {t: 2, e: 1, s: 1}
 */
function frequencies<T>(sequence: Sequence<T>): Frequencies {
  const index: Frequencies = {};

  // Handling strings
  const items = seq(sequence);

  for (let i = 0, l = items.length; i < l; i++) {
    const element = String(items[i]);

    if (!index[element])
      index[element] = 0;
    index[element]++;
  }

  return index;
}

/**
 * Relative version of the `frequencies` function.
 *
 * @param  sequence - The sequence to process. If an object is passed the
 *                    function will assume it's representing absolute
 *                    frequencies.
 * @return A dict of the sequence's relative frequencies.
 *
 * @example
 *   // frequencies([1, 1, 2, 3, 3, 3]) => {1: ~0.33, 2: ~0.16, 3: 0.5}
 *   // frequencies('test') => {t: 0.5, e: 0.25, s: 0.25}
 */
function relativeFrequencies<T>(sequence: Sequence<T> | Frequencies): Frequencies {
  let index: Frequencies,
      length: number;

  // Handling the object polymorphism
  if (typeof sequence === 'object' && !Array.isArray(sequence)) {
    index = sequence as Frequencies;
    length = 0;

    for (const k in index)
      length += index[k];
  }
  else {
    const items = sequence as Sequence<T>;
    length = items.length;
    index = frequencies(items);
  }

  const relativeIndex: Frequencies = {};

  for (const k in index)
    relativeIndex[k] = index[k] / length;

  return relativeIndex;
}

/**
 * Function taking frequencies and updating them with a new sequence.
 *
 * @param  previousFrequencies - The frequencies to update.
 * @param  sequence            - The added sequence.
 * @return The updated frequencies.
 */
export function updateFrequencies<T>(
  previousFrequencies: Frequencies,
  sequence: Sequence<T>
): Frequencies {
  const newFrequencies = frequencies(seq(sequence));

  // Merging frequencies
  for (const k in previousFrequencies)
    newFrequencies[k] = (newFrequencies[k] || 0) + previousFrequencies[k];

  return newFrequencies;
}

/**
 * Exporting
 */
export default frequencies;
export {
  frequencies as absolute,
  relativeFrequencies as relative
};
