/**
 * Talisman metrics/eudex
 * =======================
 *
 * JavaScript implementation of the distance & similarity functions using
 * Eudex hashes.
 *
 * [Reference]:
 * https://github.com/ticki/eudex
 *
 * [Author]:
 * @ticki (https://github.com/ticki)
 *
 * [Tags]: metric, string metric.
 */
import eudex from '../phonetics/eudex.js';

/**
 * Helpers.
 */
// NOTE: this is somewhat hacky and some methods can retrieve this information
// in constant time rather than our linear time here.
function bits(value: bigint): number {
  let count = 0;

  while (value) {
    count += Number(value & 1n);
    value >>= 1n;
  }

  return count;
}

/**
 * Function returning the distance between two strings hashed by Eudex.
 *
 * @param a - The first string.
 * @param b - The second string.
 * @return The distance.
 */
export function distance(a: string, b: string): number {
  const d = eudex(a) ^ eudex(b);

  let sum = bits(d & 0xFFn);

  // The further a difference sits from the first byte, the more it weighs
  const toAdd = [
    bits((d >> 8n) & 0xFFn) * 2,
    bits((d >> 16n) & 0xFFn) * 4,
    bits((d >> 24n) & 0xFFn) * 8,
    bits((d >> 32n) & 0xFFn) * 16,
    bits((d >> 40n) & 0xFFn) * 32,
    bits((d >> 48n) & 0xFFn) * 64,
    bits((d >> 56n) & 0xFFn) * 128
  ];

  for (let i = 0, l = toAdd.length; i < l; i++)
    sum += toAdd[i];

  return sum;
}

/**
 * Function returning whether the two given strings are similar by appraising
 * the distance between their Eudex hash.
 *
 * @param a - The first string.
 * @param b - The second string.
 */
export function isSimilar(a: string, b: string): boolean {
  return distance(a, b) < 10;
}
