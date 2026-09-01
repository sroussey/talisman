/**
 * Talisman phonetics/eudex tests
 * ===============================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import eudex from '../../src/phonetics/eudex.js';

describe('eudex', function() {

  it('should produce correct hashes.', function() {

    const identicalHashes = [
      ['JAva', 'jAva'],
      ['co!mputer', 'computer'],
      ['comp-uter', 'computer'],
      ['comp@u#te?r', 'computer'],
      ['java', 'jiva'],
      ['lal', 'lel'],
      ['rindom', 'ryndom'],
      ['riiiindom', 'ryyyyyndom'],
      ['riyiyiiindom', 'ryyyyyndom'],
      ['triggered', 'TRIGGERED'],
      ['repert', 'ropert']
    ];

    identicalHashes.forEach(function([one, two]) {
      assert.strictEqual(eudex(one), eudex(two), `${one} = ${two}`);
    });

    const differentHashes = [
      ['reddit', 'eddit'],
      ['lol', 'lulz'],
      ['ijava', 'java'],
      ['jesus', 'iesus'],
      ['aesus', 'iesus'],
      ['iesus', 'yesus'],
      ['rupirt', 'ropert'],
      ['ripert', 'ropyrt'],
      ['rrr', 'rraaaa'],
      ['randomal', 'randomai']
    ];

    differentHashes.forEach(function([one, two]) {
      assert.notStrictEqual(eudex(one), eudex(two), `${one} != ${two}`);
    });
  });

  it('should terminate on characters it has no phone for.', function() {

    // NOTE: these used to spin the encoding loop forever
    const tricky = ['a{', 'a|b', 'comp}uter', 'a~b', 'a\u00a0b', 'pri\u00a3ce', '10\u00b0C'];

    tricky.forEach(function(word) {
      assert.strictEqual(typeof eudex(word), 'bigint', word);
    });
  });
});
