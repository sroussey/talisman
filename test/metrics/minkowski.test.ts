/**
 * Talisman metrics/distance/minkowski tests
 * ==========================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import minkowski from '../../src/metrics/minkowski.js';
import euclidean from '../../src/metrics/euclidean.js';
import manhattan from '../../src/metrics/manhattan.js';

describe('minkowski', function() {

  it('should correctly compute the Minkowski distance.', function() {
    const vectors: [number[], number[]] = [[1, 3], [4, 5]];

    assert.strictEqual(minkowski(1, ...vectors), manhattan(...vectors));
    assert.strictEqual(minkowski(2, ...vectors), euclidean(...vectors));
  });
});
