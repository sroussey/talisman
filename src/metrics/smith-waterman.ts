/**
 * Talisman metrics/smith-waterman
 * ================================
 *
 * Functions computing the Smith-Waterman distance.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Smith%E2%80%93Waterman_algorithm
 *
 * [Article]:
 * Smith, Temple F. & Waterman, Michael S. (1981). "Identification of Common
 * Molecular Subsequences" (PDF). Journal of Molecular Biology. 147: 195–197.
 *
 * [Tags]: metric, string metric.
 */
import type {Comparator, Sequence} from '../types.js';

/**
 * Options of the Smith-Waterman score.
 */
export interface SmithWatermanOptions<T = string> {
  /** Cost of a gap. */
  readonly gap?: number;
  /** Similarity function used to compare two items. */
  readonly similarity?: Comparator<T>;
}

const SIMILARITY = <T>(a: T, b: T): number => {
  return a === b ? 1 : 0;
};

/**
 * Function returning the Smith-Waterman score between two sequences.
 *
 * @param options - Options:
 * @param gap - Gap cost.
 * @param similarity - Similarity function.
 * @param a - The first sequence to process.
 * @param b - The second sequence to process.
 * @return The Smith-Waterman score between a & b.
 */
export function score<T>(
  options: SmithWatermanOptions<T>,
  a: Sequence<T>,
  b: Sequence<T>
): number {
  const {gap = 1, similarity = SIMILARITY} = options;

  // Early terminations
  if (a === b)
    return a.length;

  const m = a.length,
        n = b.length;

  if (!m || !n)
    return 0;

  // TODO: Possibility to optimize for common prefix, but need to know max substitution cost

  const d: number[][] = new Array(m + 1);

  let D = 0;

  for (let i = 0; i <= m; i++) {
    d[i] = new Array(2);
    d[i][0] = 0;
  }

  for (let j = 1; j <= n; j++) {
    d[0][j % 2] = 0;

    for (let i = 1; i <= m; i++) {
      const cost = similarity(a[i - 1] as T, b[j - 1] as T);

      d[i][j % 2] = Math.max(
        0, // Start over
        d[i - 1][(j - 1) % 2] + cost, // Substitution
        d[i - 1][j % 2] - gap, // Insertion
        d[i][(j - 1) % 2] - gap // Deletion
      );

      // Storing max
      if (d[i][j % 2] > D)
        D = d[i][j % 2];
    }
  }

  return D;
}

/**
 * Exporting standard distance.
 */
const smithWaterman = <T>(a: Sequence<T>, b: Sequence<T>): number => score({}, a, b);

export default smithWaterman;
