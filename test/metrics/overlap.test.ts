/**
 * Talisman metrics/distance/overlap tests
 * ========================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import overlap from '../../src/metrics/overlap.js';
import type {Sequence} from '../../src/types.js';

describe('overlap', function() {

  it('should correctly compute the overlap coefficient.', function() {
    const tests: [Sequence<string | number>, Sequence<string | number>, number][] = [
      ['abc', 'abc', 1],
      ['abc', 'def', 0],
      ['abc', 'abd', 2 / 3],
      ['abc', 'abcde', 1],
      ['abcdefij', 'abc', 1],
      ['abcdefij'.split(''), 'abc'.split(''), 1],
      [[1, 2, 3], [1, 2], 1]
    ];

    tests.forEach(function([a, b, distance]) {
      assert.strictEqual(overlap(a, b), distance, `${a} / ${b}`);
    });
  });
});
