/**
 * Talisman structures/suffix-array tests
 * =======================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import {GeneralizedSuffixArray} from '../../src/structures/suffix-array.js';

describe('suffix-array', function() {

  it('should compute the longest common subsequence of two strings.', function() {
    const tests: [string, string, string][] = [
      ['test', 'test', 'test'],
      ['cat', 'hat', 'at'],
      ['chat', 'cat', 'at'],
      ['aluminum', 'Catalan', 'al'],
      ['Niall', 'Neil', 'N'],
      ['test', '', ''],
      ['', 'test', '']
    ];

    tests.forEach(function([a, b, expected]) {
      const array = new GeneralizedSuffixArray([a, b]);

      assert.strictEqual(array.longestCommonSubsequence(), expected, `${a} / ${b}`);
    });
  });

  it('should work on arbitrary sequences.', function() {
    const array = new GeneralizedSuffixArray([
      ['the', 'cat', 'eats', 'the', 'mouse'],
      ['the', 'mouse', 'eats', 'the', 'cheese']
    ]);

    assert.deepEqual(array.longestCommonSubsequence(), ['eats', 'the']);
  });

  it('should expose the indexed text & its suffix array.', function() {
    const array = new GeneralizedSuffixArray(['abc', 'bcd']);

    assert.strictEqual(array.size, 2);
    assert.strictEqual(array.length, 7);
    assert.strictEqual(array.array.length, 7);
    assert.strictEqual(array.toJSON(), array.array);
    assert.strictEqual(array.toString(), array.array.join(','));
  });
});
