/**
 * Talisman metrics/manhattan
 * ===========================
 *
 * Function computing the Manhattan distance.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Taxicab_geometry
 *
 * [Tags]: metric, vector space.
 */
import type {Vector} from '../types.js';

/**
 * Function returning the Manhattan distance between two vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @return The Manhattan distance between a & b.
 *
 * @throws {Error} The function expects vector of same dimensions.
 */
export default function manhattan(a: Vector, b: Vector): number {
  if (a.length !== b.length)
    throw Error('talisman/metrics/distance/manhattan: the given vectors are not of the same dimension.');

  let distance = 0;

  for (let i = 0, l = a.length; i < l; i++)
    distance += Math.abs(a[i] - b[i]);

  return distance;
}
