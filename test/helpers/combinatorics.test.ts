/**
 * Talisman helpers/combinatorics tests
 * =====================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import {combinations, powerSet} from '../../src/helpers/combinatorics.js';

describe('combinatorics', function() {

  describe('#.combinations', function() {

    it('should throw if the size exceeds the array.', function() {
      assert.throws(function() {
        [...combinations(['a', 'b'], 3)];
      }, /exceed/);
    });

    it('should produce the combinations in lexicographic order.', function() {
      assert.deepEqual([...combinations(['a', 'b', 'c'], 2)], [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'c']
      ]);

      assert.deepEqual([...combinations(['a', 'b', 'c', 'd'], 3)], [
        ['a', 'b', 'c'],
        ['a', 'b', 'd'],
        ['a', 'c', 'd'],
        ['b', 'c', 'd']
      ]);
    });

    it('should handle the degenerate sizes.', function() {
      assert.deepEqual([...combinations([], 0)], [[]]);
      assert.deepEqual([...combinations(['a', 'b'], 0)], [[]]);
      assert.deepEqual([...combinations(['a', 'b'], 2)], [['a', 'b']]);
    });

    it('should produce as many combinations as the binomial coefficient.', function() {
      // C(6, 3) = 20
      assert.strictEqual([...combinations([1, 2, 3, 4, 5, 6], 3)].length, 20);
    });

    it('should yield independent arrays.', function() {
      const [first, second] = [...combinations(['a', 'b', 'c'], 2)];

      assert.notStrictEqual(first, second);
      assert.deepEqual(first, ['a', 'b']);
    });
  });

  describe('#.powerSet', function() {

    it('should produce the power set, from the empty set up.', function() {
      assert.deepEqual([...powerSet(['a', 'b'])], [
        [],
        ['a'],
        ['b'],
        ['a', 'b']
      ]);
    });

    it('should produce 2^n subsets.', function() {
      assert.deepEqual([...powerSet([])], [[]]);
      assert.strictEqual([...powerSet([1, 2, 3, 4, 5])].length, 32);
    });
  });
});
