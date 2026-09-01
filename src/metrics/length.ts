/**
 * Talisman metrics/length
 * ========================
 *
 * Length distance/similarity. Basically just the ratio of the shorter length
 * over the longer length.
 *
 * [Tags]: metric, string metric.
 */
import type {Sequence} from '../types.js';

/**
 * Length similarity.
 *
 * @param a - First sequence.
 * @param b - Second sequence.
 */
export function similarity<T>(a: Sequence<T>, b: Sequence<T>): number {
  if (a === b)
    return 1;

  const la = a.length,
        lb = b.length;

  if (!la || !lb)
    return 0;

  if (la < lb)
    return la / lb;

  return lb / la;
}

/**
 * Length distance.
 *
 * @param a - First sequence.
 * @param b - Second sequence.
 */
export function distance<T>(a: Sequence<T>, b: Sequence<T>): number {
  return 1 - similarity(a, b);
}
