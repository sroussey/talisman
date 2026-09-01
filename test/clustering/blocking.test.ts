/**
 * Talisman clustering/record-linkage/blocking tests
 * ==================================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import levenshtein from '../../src/metrics/levenshtein.js';
import blocking from '../../src/clustering/blocking.js';

const DATA = [
  'abc',
  'bde',
  'bd',
  'bde',
  'bcde',
  'abcde',
  'ab'
];

describe('blocking', function() {

  it('should throw if the blocker function is invalid.', function() {
    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      blocking({blocker: null, similarity: Function.prototype}, []);
    }, /blocker/);
  });

  it('should correctly cluster data.', function() {
    const clusters = blocking({
      block: a => a[0],
      distance: levenshtein,
      radius: 1
    }, DATA);

    assert.deepEqual(clusters, [
      ['abc', 'ab'],
      ['bde', 'bd', 'bde', 'bcde']
    ]);
  });

  it('should be possible to map items to multiple blocks.', function() {
    const clusters = blocking({
      blocks: a => a.split(''),
      similarity: (a, b) => levenshtein(a, b) <= 1
    }, DATA);

    assert.deepEqual(clusters, [
      ['abc', 'ab'],
      ['bde', 'bd', 'bde', 'bcde'],
      ['abcde', 'bcde']
    ]);
  });

  it('should provide the index of the item to the blocker function.', function() {
    const blocks = DATA.map(item => item[0]);

    const clusters = blocking({
      block: (item, i) => blocks[i],
      distance: levenshtein,
      radius: 1
    }, DATA);

    assert.deepEqual(clusters, [
      ['abc', 'ab'],
      ['bde', 'bd', 'bde', 'bcde']
    ]);
  });
});
