/**
 * Talisman structures/vp-tree tests
 * ==================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import {VPTree} from '../../src/structures/vp-tree.js';
import levenshtein from '../../src/metrics/levenshtein.js';

const WORDS = [
  'abc', 'abd', 'dbc', 'zyx', 'zxx', 'xxx', 'abcde', 'abcdef', 'abcdefg'
];

/**
 * Brute-force reference the tree must agree with.
 */
function bruteForce(items: string[], radius: number, query: string): string[] {
  return items.filter(item => levenshtein(item, query) <= radius).sort();
}

describe('vp-tree', function() {

  it('should throw if the arguments are invalid.', function() {
    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      new VPTree(null, WORDS);
    }, /function/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      new VPTree(levenshtein, null);
    }, /items/);
  });

  it('should index every given item.', function() {
    const tree = new VPTree<string>(levenshtein, WORDS);

    assert.strictEqual(tree.size, WORDS.length);
    assert.strictEqual(tree.distance, levenshtein);
  });

  it('should find the same neighbors as a linear scan.', function() {
    for (let size = 1; size <= WORDS.length; size++) {
      const items = WORDS.slice(0, size),
            tree = new VPTree<string>(levenshtein, items);

      items.concat(['zzzz', '']).forEach(function(query) {
        [0, 1, 2, 5, 20].forEach(function(radius) {
          const found = tree.neighbors(radius, query).map(match => match.item).sort();

          assert.deepEqual(found, bruteForce(items, radius, query), `${query} @ ${radius} (size ${size})`);
        });
      });
    }
  });

  it('should report the distance of each match.', function() {
    const tree = new VPTree<string>(levenshtein, WORDS);

    tree.neighbors(2, 'abc').forEach(function(match) {
      assert.strictEqual(match.distance, levenshtein('abc', match.item));
    });
  });

  it('should count the distance computations it performed.', function() {
    const tree = new VPTree<string>(levenshtein, WORDS);

    tree.neighbors(1, 'abc');

    assert(tree.D > 0 && tree.D <= WORDS.length, `${tree.D} computations`);
  });

  it('should accept any iterable.', function() {
    const tree = new VPTree<string>(levenshtein, new Set(WORDS));

    assert.strictEqual(tree.size, WORDS.length);
  });
});
