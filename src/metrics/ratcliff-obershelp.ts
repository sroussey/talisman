/**
 * Talisman metrics/ratcliff-obershelp
 * ====================================
 *
 * Function computing the Ratcliff-Obershelp similarity/distance.
 *
 * [References]:
 * https://xlinux.nist.gov/dads/HTML/ratcliffObershelp.html
 * http://collaboration.cmc.ec.gc.ca/science/rpn/biblio/ddj/Website/articles/DDJ/1988/8807/8807c/8807c.htm
 *
 * [Articles]:
 * PATTERN MATCHING: THE GESTALT APPROACH
 * John W. Ratcliff, David E. Metzener
 *
 * Paul E. Black, "Ratcliff/Obershelp pattern recognition", in Dictionary of
 * Algorithms and Data Structures [online], Vreda Pieterse and Paul E. Black,
 * eds. 17 December 2004.
 *
 * [Tags]: string metric.
 */
import {GeneralizedSuffixArray} from 'mnemonist';

/**
 * The kind of sequences the metric is able to handle.
 */
type StringSequence = string | string[];

/**
 * Abstract indexOf helper needed to find the given subsequence's starting
 * index in the given sequence. Note that this function may seem naive
 * because it misses cases when, for instance, the subsequence is not found
 * but this is of no concern because we use the function in cases when it's
 * not possible that the subsequence is not found.
 *
 * @param haystack - Target sequence.
 * @param needle - Subsequence to find.
 * @return The starting index.
 */
function indexOf(haystack: StringSequence, needle: StringSequence): number {
  if (typeof haystack === 'string')
    return haystack.indexOf(needle as string);

  for (let i = 0, j = 0, l = haystack.length, n = needle.length; i < l; i++) {
    if (haystack[i] === needle[j]) {
      j++;

      if (j === n)
        return i - j + 1;
    }
    else {
      j = 0;
    }
  }

  return -1;
}

/**
 * Function returning the number of Ratcliff-Obershelp matches. This works
 * by finding the LCS of both strings before recursively finding the LCS
 * of the substrings both before and after the LCS in the initial strings and
 * so on...
 *
 * @param a - The first sequence to process.
 * @param b - The second sequence to process.
 * @return The number of matches.
 */
function matches(a: StringSequence, b: StringSequence): number {
  const stack: StringSequence[] = [a, b];

  let m = 0;

  while (stack.length) {
    a = stack.pop() as StringSequence;
    b = stack.pop() as StringSequence;

    if (!a.length || !b.length)
      continue;

    const lcs = (new GeneralizedSuffixArray([a, b] as string[] | string[][]).longestCommonSubsequence()),
          length = lcs.length;

    if (!length)
      continue;

    // Increasing matches
    m += length;

    // Add to the stack
    const aStart = indexOf(a, lcs),
          bStart = indexOf(b, lcs);

    stack.push(a.slice(0, aStart), b.slice(0, bStart));
    stack.push(a.slice(aStart + length), b.slice(bStart + length));
  }

  return m;
}

/**
 * Function returning the Ratcliff-Obershelp similarity between two sequences.
 *
 * @param a - The first sequence to process.
 * @param b - The second sequence to process.
 * @return The Ratcliff-Obershelp similarity between a & b.
 */
export function similarity<T extends StringSequence>(a: T, b: T): number {
  if (a === b)
    return 1;

  if (!a.length || !b.length)
    return 0;

  return 2 * matches(a, b) / (a.length + b.length);
}

/**
 * Function returning the Ratcliff-Obershelp distance between two sequences.
 *
 * @param a - The first sequence to process.
 * @param b - The second sequence to process.
 * @return The Ratcliff-Obershelp distance between a & b.
 */
export function distance<T extends StringSequence>(a: T, b: T): number {
  return 1 - similarity(a as string, b as string);
}
