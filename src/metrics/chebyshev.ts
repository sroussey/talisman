/**
 * Talisman metrics/chebyshev
 * ===========================
 *
 * Function computing the Chebyshev distance.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Chebyshev_distance
 *
 * [Tags]: metric, vector space.
 */
import type {Vector} from '../types.js';

/**
 * Function returning the Chebyshev distance between two vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @return The Chebyshev distance between a & b.
 *
 * @throws {Error} The function expects vectors of same dimension.
 */
export default function chebyshev(a: Vector, b: Vector): number {
  if (a.length !== b.length)
    throw Error('talisman/metrics/distance/chebyshev: the given vectors are not of the same dimension.');

  let distance = 0;

  for (let i = 0, l = a.length; i < l; i++)
    distance = Math.max(distance, Math.abs(a[i] - b[i]));

  return distance;
}
