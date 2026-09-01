/**
 * Talisman metrics/lcs
 * =====================
 *
 * Function computing the Longest Common Subsequence distance/similarity.
 *
 * [Tags]: metric, string metric.
 */
import {GeneralizedSuffixArray} from '../structures/suffix-array.js';

/**
 * LCS similarity.
 *
 * @param a - First sequence.
 * @param b - Second sequence.
 * @return Similarity between 0 & 1.
 */
export function similarity<T extends string | string[]>(a: T, b: T): number {
  if (a === b)
    return 1;

  const la = a.length,
        lb = b.length;

  if (!la || !lb)
    return 0;

  const gst = new GeneralizedSuffixArray([a, b] as string[] | string[][]),
        lcs = gst.longestCommonSubsequence().length;

  return lcs / Math.max(la, lb);
}

/**
 * LCS distance.
 *
 * @param a - First sequence.
 * @param b - Second sequence.
 * @return Distance between 0 & 1.
 */
export function distance<T extends string | string[]>(a: T, b: T): number {
  return 1 - similarity(a as string, b as string);
}
