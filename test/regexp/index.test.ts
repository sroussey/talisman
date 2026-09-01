/**
 * Talisman regexp tests
 * ======================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import {
  createFuzzyPattern,
  escapeRegexp
} from '../../src/regexp/index.js';

describe('regexp', function() {

  describe('#.escapeRegexp', function() {

    it('should correctly escape strings.', function() {
      assert.strictEqual(escapeRegexp('[]'), '\\[\\]');
    });
  });

  describe('#.createFuzzyPattern', function() {

    it('should create the expected pattern.', function() {
      assert.strictEqual(createFuzzyPattern('ajs'), '(a).*?(j).*?(s)');
    });
  });
});
