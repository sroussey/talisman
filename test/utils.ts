/**
 * Talisman unit tests helpers
 * ============================
 *
 */
import assert from 'node:assert';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const RESOURCES = new URL('./_resources/', import.meta.url);

/**
 * Function used to easily load some resources from the file system.
 */
export function loadResource(location: string): string {
  return readFileSync(fileURLToPath(new URL(location, RESOURCES)), 'utf-8');
}

/**
 * Assertion checking that the given number is close enough to the expected one.
 * Stands in for chai's `assert.approximately`.
 */
export function approximately(
  actual: number,
  expected: number,
  delta: number,
  message?: string
): void {
  assert.ok(
    Math.abs(actual - expected) <= delta,
    message || `expected ${actual} to be close to ${expected} +/- ${delta}`
  );
}

/**
 * Assertion checking that both arrays hold the same members, in any order.
 * Stands in for chai's `assert.sameMembers`.
 */
export function sameMembers<T>(
  actual: readonly T[],
  expected: readonly T[],
  message?: string
): void {
  assert.strictEqual(
    actual.length,
    expected.length,
    message || `expected ${actual.length} members, got ${expected.length}`
  );

  const remaining = expected.slice();

  for (let i = 0, l = actual.length; i < l; i++) {
    const index = remaining.indexOf(actual[i]);

    assert.notStrictEqual(
      index,
      -1,
      message || `unexpected member: ${String(actual[i])}`
    );

    remaining.splice(index, 1);
  }
}
