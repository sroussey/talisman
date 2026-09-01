/**
 * Talisman metrics/distance/cosine tests
 * =======================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import {approximately} from '../utils.js';
import cosine, {distance} from '../../src/metrics/cosine.js';

describe('cosine', function() {

  const tests = [
    {
      a: [2],
      b: [4],
      similarity: 1
    },
    {
      a: [1, 3],
      b: [4, 5],
      similarity: 0.94
    },
    {
      a: [1, 3, 5],
      b: [2, 1, 4],
      similarity: 0.92
    }
  ];

  it('should throw if the given vectors are not of the same dimension.', function() {
    assert.throws(function() {
      cosine([1, 2], [1, 2, 3]);
    }, /dimension/);
  });

  it('should correctly compute the cosine similarity of n-dimensions vectors.', function() {
    tests.forEach(function({a, b, similarity}) {
      approximately(cosine(a, b), similarity, 0.01);
    });
  });

  it('should correctly compute the cosine distance of n-dimensions vectors.', function() {
    tests.forEach(function({a, b, similarity}) {
      approximately(distance(a, b), 1 - similarity, 0.01);
    });
  });
});
