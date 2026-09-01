/**
 * Talisman helpers/combinatorics
 * ===============================
 *
 * Iterators over the combinations & the power set of an array.
 *
 * Ported from Obliterator <https://github.com/Yomguithereal/obliterator>
 * Copyright (c) 2018 Guillaume Plique (Yomguithereal), MIT licensed.
 */

/**
 * Function returning an iterator over the combinations of the given size that
 * can be drawn from the array, in lexicographic order.
 *
 * @param  array - The array to draw from.
 * @param  r     - Size of the combinations.
 * @return An iterator over the combinations.
 *
 * @throws {Error} The size should not exceed the array's length.
 *
 * @example
 *   // [...combinations(['a', 'b', 'c'], 2)] => [['a','b'], ['a','c'], ['b','c']]
 */
export function* combinations<T>(array: readonly T[], r: number): Generator<T[]> {
  const n = array.length;

  if (r > n)
    throw new Error('talisman/helpers/combinatorics: the size of the subsequences should not exceed the length of the array.');

  const indices = new Array<number>(r);

  for (let i = 0; i < r; i++)
    indices[i] = i;

  yield indices.map(index => array[index]);

  // The first combination is also the last one in those two cases
  if (r === 0 || r === n)
    return;

  for (;;) {

    // Rightmost index that can still be bumped
    let i = r - 1;

    while (i >= 0 && indices[i] === n - r + i)
      i--;

    if (i < 0)
      return;

    indices[i]++;

    for (let j = i + 1; j < r; j++)
      indices[j] = indices[j - 1] + 1;

    yield indices.map(index => array[index]);
  }
}

/**
 * Function returning an iterator over the power set of the given array, from
 * the empty set to the array itself.
 *
 * @param  array - The array to draw from.
 * @return An iterator over the subsets.
 *
 * @example
 *   // [...powerSet(['a', 'b'])] => [[], ['a'], ['b'], ['a','b']]
 */
export function* powerSet<T>(array: readonly T[]): Generator<T[]> {
  yield [];

  for (let i = 1, l = array.length; i <= l; i++)
    yield* combinations(array, i);
}
