/**
 * Talisman tokenizers/ngrams
 * ===========================
 *
 * Functions related to ngrams' computation.
 *
 * [Reference]: https://en.wikipedia.org/wiki/N-gram
 */
import type {Sequence} from '../../types.js';

/**
 * Function taking a sequence and computing its ngrams.
 *
 * @param n - Nb of elements in the subsequence.
 * @param sequence - The sequence to process.
 * @return The array of resulting ngrams.
 *
 * @throws {Error} The function expects a positive n > 0.
 */
export default function ngrams(n: number, sequence: string): string[];
export default function ngrams<T>(n: number, sequence: readonly T[]): T[][];
export default function ngrams<T>(n: number, sequence: Sequence<T>): (string | T[])[];
export default function ngrams(n: number, sequence: Sequence<unknown>): (string | unknown[])[] {
  if (n < 1)
    throw Error('talisman/tokenizers/ngrams: first argument should be a positive integer > 0.');

  const isString = typeof sequence === 'string';

  const subsequences: (string | unknown[])[] = [];

  for (let i = 0, l = sequence.length; i < l - n + 1; i++) {
    const subsequence: unknown[] = [];

    for (let j = 0; j < n; j++)
      subsequence.push(sequence[i + j]);

    subsequences.push(isString ? subsequence.join('') : subsequence);
  }

  return subsequences;
}

/**
 * Creating popular aliases.
 */
function bigrams(sequence: string): string[];
function bigrams<T>(sequence: readonly T[]): T[][];
function bigrams<T>(sequence: Sequence<T>): (string | T[])[];
function bigrams(sequence: Sequence<unknown>): (string | unknown[])[] {
  return ngrams(2, sequence);
}

function trigrams(sequence: string): string[];
function trigrams<T>(sequence: readonly T[]): T[][];
function trigrams<T>(sequence: Sequence<T>): (string | T[])[];
function trigrams(sequence: Sequence<unknown>): (string | unknown[])[] {
  return ngrams(3, sequence);
}

function quadrigrams(sequence: string): string[];
function quadrigrams<T>(sequence: readonly T[]): T[][];
function quadrigrams<T>(sequence: Sequence<T>): (string | T[])[];
function quadrigrams(sequence: Sequence<unknown>): (string | unknown[])[] {
  return ngrams(4, sequence);
}

export {bigrams, trigrams, quadrigrams};
