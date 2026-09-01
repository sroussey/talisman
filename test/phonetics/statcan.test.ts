/**
 * Talisman phonetics/statcan tests
 * =================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import statcan from '../../src/phonetics/statcan.js';

describe('statcan', function() {

  it('should throw if the given word is not a string.', function() {
    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      statcan([]);
    }, /string/);
  });

  it('should compute the statcan code correctly.', function() {
    const tests = [
      ['Guillaume', 'GLM'],
      ['Daves', 'DVS'],
      ['Davies', 'DVS'],
      ['Davis', 'DVS'],
      ['Devese', 'DVS'],
      ['Devies', 'DVS'],
      ['Devos', 'DVS'],
      ['Dove', 'DV'],
      ['Divish', 'DVSH'],
      ['Arlène', 'ARLN'],
      ['Lüdenscheidt', 'LDNS']
    ];

    tests.forEach(function([word, code]) {
      assert.strictEqual(statcan(word), code, `${word} => ${code}`);
    });
  });
});
