/**
 * Talisman phonetics/french/soundex tests
 * ========================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import soundex from '../../../src/phonetics/french/soundex.js';

describe('soundex', function() {
  it('should throw if the given word is not a string.', function() {
    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      soundex([]);
    }, /string/);
  });

  it('should compute the Soundex code correctly.', function() {
    const tests = [
      ['Florentin', 'F465'],
      ['Michael', 'M240'],
      ['Schœlcher', 'S242'],
      ['François', 'F658'],
      ['Christophe', 'C683'],
      ['Leffe', 'L900'],
      ['Elizabeth', 'E481'],
      ['Dupont', 'D153'],
      ['Dupond', 'D153']
    ];

    tests.forEach(function([word, code]) {
      assert.strictEqual(soundex(word), code, `${word} => ${code}`);
    });

    const faure = soundex('Faure');
    assert.strictEqual(soundex('Ferey'), faure);
    assert.strictEqual(soundex('Fery'), faure);
    assert.strictEqual(soundex('Frey'), faure);
    assert.strictEqual(soundex('Fueri'), faure);
    assert(soundex('Fort') !== faure);
  });
});
