/**
 * Talisman stemmers/french/carry tests
 * =====================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import carry from '../../../src/stemmers/french/carry.js';

describe('carry', function() {

  it('should correctly stem the given words.', function() {
    const tests = [
      ['Chiennes', 'chien'],
      ['Tissaient', 'tis'],
      ['Tisser', 'tis'],
      ['Tisserand', 'tisserand'],
      ['enflammer', 'enflam'],
      ['groseilles', 'groseil'],
      ['tentateur', 'ten'],
      ['tentateurs', 'ten'],
      ['tentatrice', 'ten'],
      ['tenter', 'ten'],
      ['tenteras', 'ten'],
      ['formateur', 'form'],
      ['formatrice', 'form'],
      ['former', 'form'],
      ['formes', 'form']
    ];

    tests.forEach(function([word, stem]) {
      assert.strictEqual(carry(word), stem, `${word} => ${stem}`);
    });
  });
});
