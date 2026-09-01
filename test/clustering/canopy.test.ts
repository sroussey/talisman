/**
 * Talisman clustering/record-linkage/canopy tests
 * ================================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import canopy from '../../src/clustering/canopy.js';
import levenshtein from '../../src/metrics/levenshtein.js';

const DATA = [
  'abc',
  'ab',
  'bd',
  'bde',
  'bcde',
  'abcde',
  'abcdef',
  'abcdefg'
];

describe('canopy', function() {

  it('should throw if the arguments are invalid.', function() {
    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      canopy({distance: null}, []);
    }, /distance/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      canopy({distance: Function.prototype}, []);
    }, /loose/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      canopy({distance: Function.prototype, loose: 8}, []);
    }, /tight/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      canopy({distance: Function.prototype, loose: 4, tight: 7}, []);
    }, /greater/);
  });

  it('should correctly compute clusters.', function() {
    const clusters = canopy({
      distance: levenshtein,
      loose: 2,
      tight: 1
    }, DATA);

    assert.deepEqual(clusters, [
      ['abc', 'ab', 'bd', 'abcde'],
      ['bd', 'bde', 'bcde'],
      ['bcde', 'abcde', 'abcdef'],
      ['abcdef', 'abcdefg']
    ]);
  });
});
