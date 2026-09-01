/**
 * Talisman metrics/distance/bag tests
 * ====================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import bag from '../../src/metrics/bag.js';

describe('bag', function() {

  it('should correctly compute the Bag distance.', function() {
    const tests: [string, string, number][] = [
      ['cat', 'cat', 0],
      ['cat', '', 3],
      ['', 'cat', 3],
      ['cat', 'hat', 1],
      ['Niall', 'Neil', 2],
      ['aluminum', 'Catalan', 5],
      ['ATCG', 'TAGC', 0]
    ];

    tests.forEach(function([a, b, distance]) {
      assert.strictEqual(bag(a, b), distance, `${a}, ${b}`);
    });
  });
});
