/**
 * Talisman metrics/minkowski
 * ===========================
 *
 * Function computing the Minkowski distance.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Minkowski_distance
 *
 * [Tags]: metric, vector space.
 */
import type {Vector} from '../types.js';

/**
 * Function returning the Minkowski distance between two vectors.
 *
 * @param p - The value for p.
 * @param a - The first vector.
 * @param b - The second vector.
 * @return The Minkowski distance between a & b.
 *
 * @throw  {Error} The function expects a p value >= 1.
 * @throws {Error} The function expects vectors of same dimension.
 */
export default function minkowski(p: number, a: Vector, b: Vector): number {
  if (p < 1)
    throw Error('talisman/metrics/distance/minkowski: the given p-value should be >= 1.');

  if (a.length !== b.length)
    throw Error('talisman/metrics/distance/minkowski: the given vectors are not of the same dimension.');

  let sum = 0;

  for (let i = 0, l = a.length; i < l; i++)
    sum += Math.pow(Math.abs(a[i] - b[i]), p);

  return Math.pow(sum, 1 / p);
}
