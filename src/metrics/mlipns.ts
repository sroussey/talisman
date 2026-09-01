/**
 * Talisman metrics/mlipns
 * ========================
 *
 * Function computing the Modified Language-Independent Product Name Search
 * similarity (MLIPNS).
 *
 * [Reference]:
 * http://www.sial.iias.spb.su/files/386-386-1-PB.pdf
 *
 * [Article]:
 * Shannaq, Boumedyen A. N. and Victor V. Alexandrov. 2010. "Using Product
 * Similarity for Adding Business." Global Journal of Computer Science and
 * Technology. 10(12). 2-8.
 *
 * [Tags]: metric.
 */
import type {Sequence} from '../types.js';

/**
 * Function returning the LIPNS distance between two sequences, which is
 * basically the Hamming distance tolerating strings of different lengths.
 *
 * @param a - The first sequence to process.
 * @param b - The second sequence to process.
 * @return The LIPNS similarity between a & b.
 */
export function lipns<T>(a: Sequence<T>, b: Sequence<T>): number {

  if (a === b)
    return 0;

  if (a.length > b.length)
    [a, b] = [b, a];

  let distance = b.length - a.length;

  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i])
      distance++;
  }

  return distance;
}

/**
 * Function returning the MLIPNS similarity between two sequences.
 *
 * @param settings - Settings:
 * @param threshold - maximum similarity score below which
 *                                    strings  are considered similar.
 * @param maxMismatches - Maximum allowed mismatches.
 * @param a - The first sequence to process.
 * @param b - The second sequence to process.
 * @return The MLIPNS similarity between a & b.
 */
/**
 * Settings of the MLIPNS metric.
 */
export interface MLIPNSSettings {
  /** Maximum acceptable ratio of mismatching characters. */
  readonly threshold: number;
  /** Maximum number of tolerated mismatches. */
  readonly maxMismatches: number;
}

export function custom<T>(settings: MLIPNSSettings, a: Sequence<T>, b: Sequence<T>): number {
  const threshold = settings.threshold,
        maxMismatches = settings.maxMismatches;

  if (a === b)
    return 1;

  if (!a.length || !b.length)
    return 0;

  let mismatches = 0,
      distance = lipns(a, b),
      maximumLength = Math.max(a.length, b.length);

  while (mismatches <= maxMismatches) {
    if (maximumLength < 1 ||
        (1 - (maximumLength - distance) / maximumLength) <= threshold)
      return 1;

    mismatches++;
    distance--;
    maximumLength--;
  }

  if (maximumLength < 1)
    return 1;

  return 0;
}

const DEFAULT_SETTINGS: MLIPNSSettings = {
  threshold: 0.25,
  maxMismatches: 2
};

const mlipns = <T>(a: Sequence<T>, b: Sequence<T>): number => custom(DEFAULT_SETTINGS, a, b);

export default mlipns;
