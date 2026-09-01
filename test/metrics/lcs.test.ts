/**
 * Talisman metrics/distance/lcs tests
 * ====================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import {distance, similarity} from '../../src/metrics/lcs.js';

describe('lcs', function() {

  it('should correctly compute lcs distance/similarity.', function() {
    const tests: [string | string[], string | string[], number][] = [
      ['test', 'test', 1],
      ['test', '', 0],
      ['', '', 1],
      ['', 'test', 0],
      ['cat', 'hat', 2 / 3],
      ['Niall', 'Neil', 1 / 5],
      ['aluminum', 'Catalan', 0.25],
      ['ATCG', 'TAGC', 0.25],
      ['chat', 'cat', 1 / 2],
      [['h', 'a', 't'], ['c', 'a', 't'], 2 / 3]
    ];

    tests.forEach(function([a, b, d]) {
      assert.strictEqual(similarity(a, b), d, `${a} / ${b} => ${d}`);
      assert.strictEqual(distance(a, b), 1 - d, `${a} / ${b} => ${1 - d}`);
    });
  });
});
