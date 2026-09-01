/**
 * Talisman metrics/prefix
 * ========================
 *
 * Function computing the Prefix distance/similarity. This is basically the
 * ratio of the length of the common prefix to the length of the shortest
 * sequence.
 *
 * [Tags]: metric, string metric.
 */
import type {Sequence} from '../types.js';

/**
 * Prefix similarity.
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

  const l = a.length;

  for (; i < l; i++) {
    if (a[i] !== b[i])
      break;
  }

  return i / l;
}

/**
 * Prefix distance.
 *
 * @param a - First sequence.
 * @param b - Second sequence.
 * @return Distance between 0 & 1.
 */
export function distance<T>(a: Sequence<T>, b: Sequence<T>): number {
  return 1 - similarity(a, b);
}
