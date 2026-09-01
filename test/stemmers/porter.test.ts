/**
 * Talisman stemmers/porter tests
 * ===============================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import porter from '../../src/stemmers/porter.js';

describe('porter', function() {
  it('should correctly stem the given words.', function() {
    const tests = [
      ['you', 'you'],
      ['catastrophe', 'catastroph'],
      ['anathema', 'anathema'],
      ['mathematics', 'mathemat'],
      ['adjective', 'adject'],
      ['mushroom', 'mushroom'],
      ['building', 'build'],
      ['spiteful', 'spite'],
      ['external', 'extern'],
      ['exterior', 'exterior'],
      ['coffee', 'coffe']
    ];

    tests.forEach(function([word, stem]) {
      assert.strictEqual(porter(word), stem);
    });
  });
});
