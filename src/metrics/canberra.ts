/**
 * Talisman metrics/canberra
 * ==========================
 *
 * Function computing the Canberra distance.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Canberra_distance
 *
 * [Tags]: metric, vector space.
 */
import type {Vector} from '../types.js';

/**
 * Function returning the Canberra distance between two vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @return The Canberra distance between a & b.
 *
 * @throws {Error} The function expects vectors of same dimension.
 */
export default function canberra(a: Vector, b: Vector): number {
  if (a.length !== b.length)
    throw Error('talisman/metrics/distance/canberra: the given vectors are not of the same dimension.');

  let distance = 0;

  for (let i = 0, l = a.length; i < l; i++)
    distance += Math.abs(a[i] - b[i]) / (Math.abs(a[i]) + Math.abs(b[i]));

  return distance;
}
