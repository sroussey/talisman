/**
 * Talisman metrics/sift4
 * =======================
 *
 * Implementation of the SIFT4 distance which is a linear time approximation of
 * the Levenshtein or Damerau-Levenshtein distance.
 *
 * [Reference]:
 * http://web.archive.org/web/20190613223908/https://siderite.blogspot.com/2014/11/super-fast-and-accurate-string-distance.html
 *
 * [Author]: Siderite Zackwehdex
 *
 * [Tags]: string metric, asymmetric.
 */
import type {Sequence} from '../types.js';

// TODO: implement options of the most complex version.

/**
 * Defaults.
 */
const DEFAULTS = {
  transpositions: false,
  maxOffset: 5
};

/**
 * Options of the SIFT4 distance.
 */
export interface Sift4Options {
  /** Search window. */
  readonly maxOffset?: number;
  /** Maximum distance before exiting early. */
  readonly maxDistance?: number;
  /** Whether to take transpositions into account. */
  readonly transpositions?: boolean;
  /** Whether to use the symmetric version of the algorithm. */
  readonly symmetric?: boolean;
}

/**
 * A transposition offset, tracked by the transposition-aware version.
 */
interface Offset {
  readonly cursorA: number;
  readonly cursorB: number;
  isTransposition: boolean;
}

/**
 * Simplest version of the SIFT4 algorithm.
 *
 * @param maxOffset - Search window.
 * @param maxDistance - Maximum distance before exiting.
 * @param a - First sequence.
 * @param b - Second sequence.
 * @return The distance.
 */
function withoutTranspositions<T>(
  maxOffset: number,
  maxDistance: number | undefined,
  a: Sequence<T>,
  b: Sequence<T>
): number {
  // Early termination
  if (a === b)
    return 0;

  const la = a.length,
        lb = b.length;

  if (!la || !lb)
    return Math.max(la, lb);

  let cursorA = 0,
      cursorB = 0,
      longestCommonSubsequence = 0,
      localCommonSubstring = 0;

  while (cursorA < la && cursorB < lb) {
    if (a[cursorA] === b[cursorB]) {
      localCommonSubstring++;
    }
    else {
      longestCommonSubsequence += localCommonSubstring;
      localCommonSubstring = 0;

      if (cursorA !== cursorB)
        cursorA = cursorB = Math.max(cursorA, cursorB);

      for (let i = 0; i < maxOffset && (cursorA + i < la || cursorB + i < lb); i++) {
        if (cursorA + i < la && a[cursorA + i] === b[cursorB]) {
          cursorA += i;
          localCommonSubstring++;
          break;
        }

        if (cursorB + i < lb && a[cursorA] === b[cursorB + i]) {
          cursorB += i;
          localCommonSubstring++;
          break;
        }
      }
    }

    cursorA++;
    cursorB++;

    if (maxDistance) {
      const tempDistance = Math.max(cursorA, cursorB) - longestCommonSubsequence;

      if (tempDistance === maxDistance)
        return maxDistance;

      if (tempDistance > maxDistance)
        return Infinity;
    }
  }

  longestCommonSubsequence += localCommonSubstring;

  return Math.max(la, lb) - longestCommonSubsequence;
}

/**
 * Version of the SIFT4 function computing transpositions.
 *
 * @param maxOffset - Search window.
 * @param maxDistance - Maximum distance before exiting.
 * @param a - First sequence.
 * @param b - Second sequence.
 * @return The distance.
 */
function withTranspositions<T>(
  maxOffset: number,
  maxDistance: number | undefined,
  a: Sequence<T>,
  b: Sequence<T>
): number {

  // Early termination
  if (a === b)
    return 0;

  const la = a.length,
        lb = b.length;

  if (!la || !lb)
    return Math.max(la, lb);

  let cursorA = 0,
      cursorB = 0,
      longestCommonSubsequence = 0,
      localCommonSubstring = 0,
      transpositions = 0;

  const offsetArray: Offset[] = [];

  while (cursorA < la && cursorB < lb) {

    if (a[cursorA] === b[cursorB]) {
      localCommonSubstring++;

      let isTransposition = false,
          i = 0;

      while (i < offsetArray.length) {
        const offset = offsetArray[i];

        if (cursorA <= offset.cursorA || cursorB <= offset.cursorB) {

          isTransposition = Math.abs(cursorB - cursorA) >= Math.abs(offset.cursorB - offset.cursorA);

          if (isTransposition) {
            transpositions++;
          }
          else {
            if (!offset.isTransposition) {
              offset.isTransposition = true;
              transpositions++;
            }
          }

          break;
        }

        else {

          // NOTE: we could marginally enhance the performance of the algo
          // by using an object rather than splicing the array
          if (cursorA > offset.cursorB && cursorB > offset.cursorA)
            offsetArray.splice(i, 1);
          else
            i++;
        }
      }

      offsetArray.push({
        cursorA,
        cursorB,
        isTransposition
      });
    }

    else {
      longestCommonSubsequence += localCommonSubstring;
      localCommonSubstring = 0;

      if (cursorA !== cursorB)
        cursorA = cursorB = Math.min(cursorA, cursorB);

      for (let i = 0; i < maxOffset && (cursorA + i < la || cursorB + i < lb); i++) {

        if ((cursorA + i < la) && a[cursorA + i] === b[cursorB]) {
          cursorA += i - 1;
          cursorB--;
          break;
        }

        if ((cursorB + i < lb) && a[cursorA] === b[cursorB + i]) {
          cursorA--;
          cursorB += i - 1;
          break;
        }
      }
    }

    cursorA++;
    cursorB++;

    // NOTE: this was below maxDistance check in original implemenation but
    // this looked suspicious
    if (cursorA >= la || cursorB >= lb) {
      longestCommonSubsequence += localCommonSubstring;
      localCommonSubstring = 0;
      cursorA = cursorB = Math.min(cursorA, cursorB);
    }

    if (maxDistance) {
      const tempDistance = (
        Math.max(cursorA, cursorB) -
        longestCommonSubsequence +
        transpositions
      );

      if (tempDistance === maxDistance)
        return maxDistance;

      if (tempDistance > maxDistance)
        return Infinity;
    }
  }

  longestCommonSubsequence += localCommonSubstring;

  return Math.max(la, lb) - longestCommonSubsequence + transpositions;
}

/**
 * Function computing the SIFT4 distance.
 *
 * @param options - Options:
 * @param [symmetric] - Symmetric version of the algorithm.
 * @param [maxOffset] - Search window.
 * @param [maxDistance] - Maximum distance before exiting.
 * @param a - First sequence.
 * @param b - Second sequence.
 * @return The distance.
 */
export function custom<T>(options: Sift4Options, a: Sequence<T>, b: Sequence<T>): number {
  const maxOffset = options.maxOffset || DEFAULTS.maxOffset,
        maxDistance = options.maxDistance,
        transpositions = options.transpositions === true,
        symmetric = options.symmetric === true;

  const fn = transpositions ? withTranspositions : withoutTranspositions,
        distance = fn(maxOffset, maxDistance, a, b);

  if (symmetric) {
    const reversedDistance = fn(maxOffset, maxDistance, b, a);

    return Math.min(distance, reversedDistance);
  }

  return distance;
}

/**
 * Exporting default function.
 */
const sift4 = <T>(a: Sequence<T>, b: Sequence<T>): number => custom({}, a, b);
export default sift4;
