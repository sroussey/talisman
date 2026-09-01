/**
 * Talisman structures/suffix-array
 * =================================
 *
 * Generalized suffix array, built in linear time using the recursive method by
 * Kärkkäinen and Sanders. The library uses it to find the longest common
 * subsequence of two sequences.
 *
 * [References]:
 * https://www.cs.helsinki.fi/u/tpkarkka/publications/jacm05-revised.pdf
 * http://people.mpi-inf.mpg.de/~sanders/programs/suffix/
 *
 * [Article]:
 * "Simple Linear Work Suffix Array Construction", Kärkkäinen and Sanders.
 *
 * Ported from Mnemonist <https://github.com/Yomguithereal/mnemonist>
 * Copyright (c) 2016 Guillaume Plique (Yomguithereal), MIT licensed, itself
 * largely inspired by https://github.com/tixxit/suffixarray
 */

/**
 * Character used to join the sequences of a generalized suffix array.
 */
const SEPARATOR = '\u0001';

/**
 * A sequence the array can be built over.
 */
type Sequence = string | string[];

/**
 * Function radix-sorting the triples of the padded sequence in place.
 *
 * @param string - The padded sequence, as codes.
 * @param array  - The array to sort, mutated in place.
 * @param offset - Index offset.
 */
function sort(string: number[], array: number[], offset: number): void {
  const l = array.length,
        buckets: number[][] = [];

  let i = l,
      j = -1,
      b: number,
      d = 0;

  while (i--)
    j = Math.max(string[array[i] + offset], j);

  const bits = (j >> 24 && 32) || (j >> 16 && 24) || (j >> 8 && 16) || 8;

  for (; d < bits; d += 4) {
    for (i = 16; i--;)
      buckets[i] = [];

    for (i = l; i--;)
      buckets[(string[array[i] + offset] >> d) & 15].push(array[i]);

    for (b = 0; b < 16; b++) {
      for (j = buckets[b].length; j--;)
        array[++i] = buckets[b][j];
    }
  }
}

/**
 * Function comparing two suffixes.
 */
function compare(string: number[], lookup: number[], m: number, n: number): number {
  return (
    string[m] - string[n] ||
    (m % 3 === 2 ?
      string[m + 1] - string[n + 1] || lookup[m + 2] - lookup[n + 2] :
      lookup[m + 1] - lookup[n + 1])
  );
}

/**
 * Recursive function building the suffix array in linear time.
 *
 * @param  string - The padded sequence, as codes.
 * @param  l      - True length of the sequence, before padding.
 * @return The suffix array.
 */
function build(string: number[], l: number): number[] {
  const a: number[] = [],
        al = ((2 * l) / 3) | 0,
        bl = l - al,
        r = (al + 1) >> 1,
        lookup: number[] = [],
        result: number[] = [];

  let b: number[] = [],
      i = al,
      j = 0,
      k: number;

  if (l === 1)
    return [0];

  while (i--)
    a[i] = ((i * 3) >> 1) + 1;

  for (i = 3; i--;)
    sort(string, a, i);

  j = b[((a[0] / 3) | 0) + (a[0] % 3 === 1 ? 0 : r)] = 1;

  for (i = 1; i < al; i++) {
    if (
      string[a[i]] !== string[a[i - 1]] ||
      string[a[i] + 1] !== string[a[i - 1] + 1] ||
      string[a[i] + 2] !== string[a[i - 1] + 2]
    )
      j++;

    b[((a[i] / 3) | 0) + (a[i] % 3 === 1 ? 0 : r)] = j;
  }

  if (j < al) {
    b = build(b, al);

    for (i = al; i--;)
      a[i] = b[i] < r ? b[i] * 3 + 1 : (b[i] - r) * 3 + 2;
  }

  for (i = al; i--;)
    lookup[a[i]] = i;

  lookup[l] = -1;
  lookup[l + 1] = -2;

  b = l % 3 === 1 ? [l - 1] : [];

  for (i = 0; i < al; i++) {
    if (a[i] % 3 === 1)
      b.push(a[i] - 1);
  }

  sort(string, b, 0);

  for (i = 0, j = 0, k = 0; i < al && j < bl;)
    result[k++] = compare(string, lookup, a[i], b[j]) < 0 ? a[i++] : b[j++];

  while (i < al)
    result[k++] = a[i++];

  while (j < bl)
    result[k++] = b[j++];

  return result;
}

/**
 * Function converting the target sequence into the padded array of codes the
 * algorithm works on.
 */
function convert(target: Sequence): number[] {
  const length = target.length,
        paddingOffset = length % 3,
        array = new Array<number>(length + paddingOffset);

  let i: number;

  // An arbitrary sequence needs an alphabet of its own
  if (typeof target !== 'string') {
    const uniqueTokens: Record<string, true> = Object.create(null);

    for (i = 0; i < length; i++) {
      if (!uniqueTokens[target[i]])
        uniqueTokens[target[i]] = true;
    }

    const alphabet: Record<string, number> = Object.create(null),
          sortedUniqueTokens = Object.keys(uniqueTokens).sort();

    for (i = 0; i < sortedUniqueTokens.length; i++)
      alphabet[sortedUniqueTokens[i]] = i + 1;

    for (i = 0; i < length; i++)
      array[i] = alphabet[target[i]];
  }
  else {
    for (i = 0; i < length; i++)
      array[i] = target.charCodeAt(i);
  }

  // Padding
  for (i = length; i < length + paddingOffset; i++)
    array[i] = 0;

  return array;
}

export class GeneralizedSuffixArray {
  /** The concatenated sequences, separated by a sentinel. */
  readonly text: Sequence;

  /** Number of indexed sequences. */
  readonly size: number;

  /** Length of the concatenated text. */
  readonly length: number;

  /** The suffix array itself. */
  readonly array: number[];

  /** Length of the first sequence, used to tell both sequences apart. */
  private readonly firstLength: number;

  /** Whether the indexed sequences are arrays rather than strings. */
  private readonly hasArbitrarySequence: boolean;

  constructor(strings: string[] | string[][]) {
    this.hasArbitrarySequence = typeof strings[0] !== 'string';
    this.size = strings.length;

    if (this.hasArbitrarySequence) {
      const text: string[] = [];

      for (let i = 0, l = this.size; i < l; i++) {
        text.push.apply(text, strings[i] as string[]);

        if (i < l - 1)
          text.push(SEPARATOR);
      }

      this.text = text;
    }
    else {
      this.text = (strings as string[]).join(SEPARATOR);
    }

    this.firstLength = strings[0].length;
    this.length = this.text.length;

    this.array = build(convert(this.text), this.length);
  }

  /**
   * Method returning the longest subsequence common to the indexed sequences.
   */
  longestCommonSubsequence(): Sequence {
    let lcs: Sequence = this.hasArbitrarySequence ? [] : '';

    for (let i = 1; i < this.length; i++) {
      const s = this.array[i],
            t = this.array[i - 1];

      if (s < this.firstLength && t < this.firstLength)
        continue;

      if (s > this.firstLength && t > this.firstLength)
        continue;

      let lcp = Math.min(this.length - s, this.length - t);

      for (let j = 0; j < lcp; j++) {
        if (this.text[s + j] !== this.text[t + j]) {
          lcp = j;
          break;
        }
      }

      if (lcp > lcs.length)
        lcs = this.text.slice(s, s + lcp);
    }

    return lcs;
  }

  toString(): string {
    return this.array.join(',');
  }

  toJSON(): number[] {
    return this.array;
  }
}
