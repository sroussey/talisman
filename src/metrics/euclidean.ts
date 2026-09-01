/**
 * Talisman metrics/euclidean
 * ===========================
 *
 * Function computing the euclidean distance.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Euclidean_distance
 *
 * [Tags]: metric, string metric.
 */
import type {Vector} from '../types.js';

/**
 * Function returning the squared euclidean distance between two vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @return The squared euclidean distance between a & b.
 *
 * @throws {Error} The function expects vectors of same dimension.
 */
export function squared(a: Vector, b: Vector): number {
  if (a.length !== b.length)
    throw Error('talisman/metrics/distance/euclidean: the given vectors are not of the same dimension.');

  let distance = 0;

  for (let i = 0, l = a.length; i < l; i++)
    distance += Math.pow(a[i] - b[i], 2);

  return distance;
}

/**
 * Function returning the euclidean distance between two vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @return The euclidean distance between a & b.
 *
 * @throws {Error} The function expects vector of same dimensions.
 */
export default function euclidean(a: Vector, b: Vector): number {
  return Math.sqrt(squared(a, b));
}
