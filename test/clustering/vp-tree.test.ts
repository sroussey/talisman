/**
 * Talisman clustering/record-linkage/vp-tree tests
 * =================================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import vpTree from '../../src/clustering/vp-tree.js';
import levenshtein from '../../src/metrics/levenshtein.js';

const CHAIN = [
  'abc',
  'bcd',
  'cde',
  'def',
  'efg',
  'fgh',
  'ghi'
];

const COMPLEX = [
  'abc',
  'abc',
  'bde',
  'bd',
  'bde',
  'bcde',
  'abcde',
  'abcdef',
  'abcdefg'
];

function serializeClusters(clusters: string[][]): Set<string> {
  const result = new Set<string>();

  clusters.forEach((cluster: string[]) => {
    result.add(cluster.sort().join('$'));
  });

  return result;
}

describe('vp-tree', function() {

  it('should throw if the arguments are invalid.', function() {
    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      vpTree({distance: null, radius: 2}, []);
    }, /distance/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      vpTree({distance: Function.prototype, radius: null}, []);
    }, /radius/);
  });

  it('should correctly cluster chains.', function() {
    const clusters = vpTree({
      distance: levenshtein,
      radius: 2
    }, CHAIN);

    assert.deepStrictEqual(serializeClusters(clusters), serializeClusters([
      ['bcd', 'abc'],
      ['def', 'cde', 'bcd'],
      ['fgh', 'efg', 'def'],
      ['ghi', 'fgh']
    ]));
  });

  it('should correctly cluster complex data.', function() {
    const clusters = vpTree({
      distance: levenshtein,
      radius: 2
    }, COMPLEX);

    assert.deepStrictEqual(serializeClusters(clusters), serializeClusters([
      ['abcde', 'bd', 'abc', 'abc'],
      ['abcde', 'bcde', 'bde', 'bd', 'bde'],
      ['abcdefg', 'abcdef', 'bcde', 'abcde']
    ]));
  });
});
