/**
 * Talisman metrics/distance/mlipns tests
 * =======================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import mlipns from '../../src/metrics/mlipns.js';

describe('mlipns', function() {

  it('should correctly compute the MLIPNS distance.', function() {
    const tests: [string, string, number][] = [
      ['cat', 'cat', 1],
      ['cat', '', 0],
      ['', 'cat', 0],
      ['cat', 'hat', 1],
      ['Niall', 'Neil', 0],
      ['aluminum', 'Catalan', 0],
      ['ATCG', 'TAGC', 0]
    ];

    tests.forEach(function([a, b, distance]) {
      assert.strictEqual(mlipns(a, b), distance, `${a}, ${b}`);
    });
  });
});
