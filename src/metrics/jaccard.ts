/**
 * Talisman metrics/jaccard
 * =========================
 *
 * Functions computing the Jaccard distance/similarity.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Jaccard_index
 *
 * [Article]:
 * Jaccard, Paul (1912), "The distribution of the flora in the alpine zone",
 * New Phytologist 11: 37–50
 *
 * [Tags]: metric, string metric.
 */
import type {Sequence} from '../types.js';

/**
 * Function returning the Jaccard similarity score between two sequences.
 *
 * @param a - The first sequence.
 * @param b - The second sequence.
 * @return The Jaccard similarity score between a & b.
 */
function jaccard<T>(a: Sequence<T>, b: Sequence<T>): number {
  if (a === b)
    return 1;

  const la = a.length,
        lb = b.length;

  if (!la || !lb)
    return 0;

  const setA: Record<string, true> = {},
        setB: Record<string, true> = {};

  let I = 0,
      sizeA = 0,
      sizeB = 0;

  for (let i = 0; i < la; i++) {
    const key = String(a[i]);

    if (!setA.hasOwnProperty(key)) {
      setA[key] = true;
      sizeA++;
    }
  }

  for (let i = 0; i < lb; i++) {
    const key = String(b[i]);

    if (!setB.hasOwnProperty(key)) {
      setB[key] = true;
      sizeB++;

      if (setA.hasOwnProperty(key))
        I++;
    }
  }

  // Size of the union is sum of size of both sets minus intersection
  const U = sizeA + sizeB - I;

  return I / U;
}

/**
 * Jaccard distance is 1 - the Jaccard index.
 */
const distance = <T>(x: Sequence<T>, y: Sequence<T>): number => 1 - jaccard(x, y);

/**
 * Exporting.
 */
export default jaccard;
export {
  jaccard as index,
  jaccard as similarity,
  distance
};
