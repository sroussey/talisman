/**
 * Talisman metrics/identity
 * ==========================
 *
 * Identity distance/similarity.
 *
 * [Tags]: metric, string metric.
 */
import type {Sequence} from '../types.js';

/**
 * Identity distance.
 *
 * @param a - First sequence.
 * @param b - Second sequence.
 * @return Distance between 0 & 1.
 */
export function distance<T>(a: Sequence<T>, b: Sequence<T>): number {
  if (typeof a === 'string')
    return a === b ? 0 : 1;

  if (a === b)
    return 0;

  if (a.length !== b.length)
    return 1;

  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i])
      return 1;
  }

  return 0;
}

/**
 * Identity similarity.
 *
 * @param a - First sequence.
 * @param b - Second sequence.
 * @return Similarity between 0 & 1.
 */
export function similarity<T>(a: Sequence<T>, b: Sequence<T>): number {
  if (typeof a === 'string')
    return a === b ? 1 : 0;

  if (a === b)
    return 1;

  if (a.length !== b.length)
    return 0;

  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i])
      return 0;
  }

  return 1;
}
