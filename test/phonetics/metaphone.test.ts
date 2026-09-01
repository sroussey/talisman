/**
 * Talisman phonetics/metaphone tests
 * ===================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import metaphone from '../../src/phonetics/metaphone.js';

describe('metaphone', function() {

  it('should throw if the given word is not a string.', function() {
    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      metaphone([]);
    }, /string/);
  });

  it('should compute the metaphone code correctly.', function() {
    const tests = [
      ['TSKRMNXN', 'discrimination'],
      ['HL', 'hello'],
      ['TRT', 'droid'],
      ['HPKRT', 'hypocrite'],
      ['WL', 'well'],
      ['AM', 'am'],
      ['S', 'say'],
      ['FSNT', 'pheasant'],
      ['KT', 'god']
    ];

    tests.forEach(function([code, word]) {
      assert.strictEqual(metaphone(word), code);
    });
  });
});
