/**
 * Talisman helpers/vectors
 * =========================
 *
 * Compilation of various helpers to deal with vectors.
 */
import type {Vector} from '../types.js';

/**
 * Function creating a vector of n dimensions and filling it with a single
 * value if required.
 *
 * @param  n    - Dimensions of the vector to create.
 * @param  fill - Value to be used to fill the vector.
 * @return The resulting vector.
 */
export function vec<T>(n: number, fill: T): T[];
export function vec<T = unknown>(n: number): T[];
export function vec(n: number, fill?: unknown): unknown[] {
  const vector = new Array(n);

  if (arguments.length > 1) {
    for (let i = 0; i < n; i++)
      vector[i] = fill;
  }

  return vector;
}

/**
 * Function adding two vectors.
 *
 * @param  a - The first vector.
 * @param  b - The second vector.
 * @return The resulting vector.
 */
export function add(a: Vector, b: Vector): number[] {
  const dimensions = a.length,
        vector = new Array<number>(dimensions);

  for (let i = 0; i < dimensions; i++)
    vector[i] = a[i] + b[i];

  return vector;
}

/**
 * Function multiplying a vector & a scalar.
 *
 * @param  v - The vector.
 * @param  s - The scalar.
 * @return The resulting vector.
 */
export function scale(v: Vector, s: number): number[] {
  const dimensions = v.length,
        vector = new Array<number>(dimensions);

  for (let i = 0; i < dimensions; i++)
    vector[i] = v[i] * s;

  return vector;
}

/**
 * Function returning the mean of a list of vectors.
 *
 * @param  vectors - The list of vectors to process.
 * @return A mean vector.
 */
export function mean(vectors: ArrayLike<Vector>): number[] {
  const sum = vec(vectors[0].length, 0);

  for (let i = 0, l = vectors.length; i < l; i++) {
    const vector = vectors[i];

    for (let j = 0, m = vector.length; j < m; j++)
      sum[j] += vector[j];
  }

  for (let i = 0, l = sum.length; i < l; i++)
    sum[i] /= vectors.length;

  return sum;
}

/**
 * Function returning the scalar product of two vectors.
 *
 * @param  a - The first vector.
 * @param  b - The second vector.
 * @return The scalar product.
 */
export function dot(a: Vector, b: Vector): number {
  let product = 0;

  for (let i = 0, l = a.length; i < l; i++)
    product += (a[i] * b[i]);

  return product;
}
