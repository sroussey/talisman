/**
 * Talisman metrics/distance/smith-waterman tests
 * ===============================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import {score} from '../../src/metrics/smith-waterman.js';
import type {SmithWatermanOptions} from '../../src/metrics/smith-waterman.js';
import type {Sequence} from '../../src/types.js';

describe('smith-waterman', function() {

  it('should correctly compute the smith-waterman distance.', function() {
    const tests: [
      Sequence<string | number>,
      Sequence<string | number>,
      number,
      SmithWatermanOptions<string | number>?
    ][] = [
      ['hello', 'hello', 5],
      ['hello', '', 0],
      ['', 'hello', 0],
      ['cat', 'hat', 2],
      ['xxxxABCx', 'yABCyyyy', 3],
      ['dva', 'deeve', 1, {gap: 2.2}],
      [[0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0], [1, 1, 1, 1], 3],
      ['dva', 'deeve', 2, {similarity: (a, b) => a === b ? 2 : -1}],
      ['GCATAGCU', 'GATTACA', 6.5, {gap: 1.4, similarity: (a, b) => a === b ? 1.5 : 0.5}]
    ];

    tests.forEach(function([a, b, result, options = {}]) {
      assert.strictEqual(score(options, a, b), result, `${a} / ${b}`);
    });
  });
});
