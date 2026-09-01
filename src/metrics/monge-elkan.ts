/**
 * Talisman metrics/monge-elkan
 * =============================
 *
 * Implementation of the Monge-Elkan distance.
 *
 * [Reference]: http://www.aaai.org/Papers/KDD/1996/KDD96-044.pdf
 *
 * [Article]:
 * Monge, Alvaro E. and Charles P. Elkan. 1996. "The field matching problem:
 * Algorithms and applications." KDD-9 Proceedings.
 *
 * [Tags]: metric, asymmetric, string metric.
 */
import type {Comparator} from '../types.js';

/**
 * Function computing the Monge-Elkan similarity.
 *
 * @param similarity - Similarity function to use.
 * @param source - Source sequence.
 * @param target - Target sequence.
 * @return Monge-Elkan similarity.
 */
export default function mongeElkan<T>(
  similarity: Comparator<T>,
  source: ArrayLike<T>,
  target: ArrayLike<T>
): number {
  if (source === target)
    return 1;
  if (!source.length && !target.length)
    return 1;
  if (!source.length || !target.length)
    return 0;

  let sum = 0;

  for (let i = 0, l = source.length; i < l; i++) {
    let max = -Infinity;

    for (let j = 0, m = target.length; j < m; j++) {
      const score = similarity(source[i], target[j]);

      if (score > max)
        max = score;
    }

    sum += max;
  }

  return sum / source.length;
}

/**
 * Function computing the symmetric Monge-Elkan similarity.
 * This is achieved by computing the mean of me(a, b) & me(b, a).
 */
export function symmetric<T>(
  similarity: Comparator<T>,
  source: ArrayLike<T>,
  target: ArrayLike<T>
): number {
  const a = mongeElkan(similarity, source, target),
        b = mongeElkan(similarity, target, source);

  return (a + b) / 2;
}

/**
 * Aliases.
 */
const similarity = mongeElkan;

export {
  similarity
};
