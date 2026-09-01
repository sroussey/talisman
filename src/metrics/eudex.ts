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
import {bitwise} from './hamming.js';

/**
 * Helpers.
 */
// NOTE: the Hamming distance to zero is the population count, and
// `metrics/hamming#bitwise` already clears the lowest set bit at each turn
// rather than walking every bit position. The bytes below are extracted from
// the hash as numbers so that it runs on a machine word: iterating a bigint
// one bit at a time is both slower and non-terminating on a negative value,
// since `-1n >> 1n` is `-1n`.
function bits(value: number): number {
  return bitwise(value, 0);
}

/**
 * Function returning the distance between two strings hashed by Eudex.
 *
 * @param a - The first string.
 * @param b - The second string.
 * @return The distance.
 */
export function distance(a: string, b: string): number {
  let d = eudex(a) ^ eudex(b),
      sum = 0;

  // The further a difference sits from the first byte, the more it weighs
  for (let weight = 1; weight <= 128; weight *= 2) {
    sum += bits(Number(d & 0xFFn)) * weight;
    d >>= 8n;
  }

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
