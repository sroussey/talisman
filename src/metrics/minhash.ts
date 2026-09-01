/**
 * Talisman metrics/minhash
 * =========================
 *
 * Function computing the similarity/distance between MinHash signatures.
 */

/**
 * Function returning the similarity between two MinHash signatures.
 *
 * @param a - The first signature.
 * @param b - The second signature.
 * @return The similarity between a & b.
 *
 * @throws {Error} The function expects signatures of same length.
 */

/**
 * A MinHash signature.
 */
export type Signature = ArrayLike<number>;

export function similarity(a: Signature, b: Signature): number {
  if (a.length !== b.length)
    throw Error('talisman/metrics/distance/minhash: the given signatures are not of same length.');

  const L = a.length;

  let s = 0;

  for (let i = 0; i < L; i++) {
    if (a[i] === b[i])
      s++;
  }

  return s / L;
}

/**
 * MinHash distance is simply 1 - similarity.
 */
export function distance(a: Signature, b: Signature): number {
  return 1 - similarity(a, b);
}
