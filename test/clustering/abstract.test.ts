/**
 * Talisman clustering/record-linkage/abstract tests
 * ==================================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import RecordLinkageClusterer from '../../src/clustering/abstract.js';

describe('abstract', function() {

  it('should throw on invalid arguments.', function() {

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      new RecordLinkageClusterer(null);
    }, /params/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      new RecordLinkageClusterer({}, null);
    }, /items/);
  });
});
