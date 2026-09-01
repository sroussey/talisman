/**
 * Talisman metrics/suffix
 * ========================
 *
 * Function computing the Suffix distance/similarity. This is basically the
 * ratio of the length of the common suffix to the length of the shortest
 * sequence.
 *
 * [Tags]: metric, string metric.
 */
import type {Sequence} from '../types.js';

/**
 * Suffix similarity.
 *
 * @param a - First sequence.
 * @param b - Second sequence.
 * @return Similarity between 0 & 1.
 */
export function similarity<T>(a: Sequence<T>, b: Sequence<T>): number {
  if (a === b)
    return 1;

  if (!a.length || !b.length)
    return 0;

  if (a.length > b.length)
    [a, b] = [b, a];

  let i = 0;

  const la = a.length,
        lb = b.length;

  for (; i < la; i++) {
    if (a[la - i - 1] !== b[lb - i - 1])
      break;
  }

  return i / la;
}

/**
 * Suffix distance.
 *
 * @param a - First sequence.
 * @param b - Second sequence.
 * @return Distance between 0 & 1.
 */
export function distance<T>(a: Sequence<T>, b: Sequence<T>): number {
  return 1 - similarity(a, b);
}
