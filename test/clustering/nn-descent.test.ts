/**
 * Talisman clustering/record-linkage/nn-descent tests
 * ====================================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import nnDescent from '../../src/clustering/nn-descent.js';

describe('nn-descent', function() {

  it('should throw if the arguments are invalid.', function() {
    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      nnDescent({similarity: null}, []);
    }, /similarity/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      nnDescent({similarity: Function.prototype, rng: 'test'}, []);
    }, /rng/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      nnDescent({rho: -25}, []);
    }, /rho/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      nnDescent({delta: -45}, []);
    }, /delta/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      nnDescent({maxIterations: -65}, []);
    }, /maxIterations/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      nnDescent({k: 0}, []);
    }, /k/);
  });

  it('should correctly compute clusters.', function() {

  });
});
