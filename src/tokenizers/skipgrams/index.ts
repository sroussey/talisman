/**
 * Talisman tokenizers/skipgrams
 * ==============================
 *
 * Functions related to skipgrams' computation.
 *
 * [Reference]: https://en.wikipedia.org/wiki/N-gram#Skip-gram
 */
import {combinations} from 'obliterator';
import {seq} from '../../helpers/index.js';
import {vec} from '../../helpers/vectors.js';
import ngrams from '../ngrams/index.js';
import type {Sequence} from '../../types.js';

/**
 * Sentinel object.
 */
const SENTINEL = {};

/**
 * Function taking a sequence and computing its skipgrams.
 *
 * @param k - Nb of elements to skip.
 * @param n - Nb of elements in the subsequence.
 * @param sequence - The sequence to process.
 * @return The array of resulting skipgrams.
 *
 * @throws {Error} The function expects a positive k.
 * @throws {Error} The function expects a positive n > 0.
 * @throws {Error} n should be > k.
 */
export default function skipgrams<T>(
  k: number,
  n: number,
  sequence: Sequence<T>
): (string | (T | string)[])[] {
  if (k < 1)
    throw new Error('talisman/tokenizers/skipgrams: `k` should be a positive integer > 0.');

  if (n < 1)
    throw Error('talisman/tokenizers/skipgrams: `n` should be a positive integer > 0.');

  if (n < k)
    throw Error('talisman/tokenizers/skipgrams: `n` should be greater than `k`.');

  const isString = typeof sequence === 'string';

  // NOTE: should be n or k?
  const padding = vec(n, SENTINEL);

  const items = (seq(sequence) as unknown[]).concat(padding);

  const subsequences: (string | (T | string)[])[] = [],
        grams = ngrams(n + k, items) as unknown[][];

  for (let i = 0, l = grams.length; i < l; i++) {
    const head = grams[i][0],
          tail = grams[i].slice(1);

    const iterator = combinations(tail, n - 1);

    let step: IteratorResult<unknown[]>;

    while ((step = iterator.next(), !step.done)) {
      const skipTail = step.value;

      if (skipTail[skipTail.length - 1] === SENTINEL)
        continue;

      if (isString)
        subsequences.push((head as string) + skipTail.join(''));
      else
        subsequences.push([head].concat(skipTail) as (T | string)[]);
    }
  }

  return subsequences;
}
