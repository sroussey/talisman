/**
 * Talisman stemmers/s-stemmer tests
 * ==================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import sStemmer from '../../src/stemmers/s-stemmer.js';

describe('s-stemmer', function() {
  it('should correctly stem the given words.', function() {
    const tests = [
      ['', ''],
      ['one', 'one'],
      ['is', 'is'],
      ['reciprocity', 'reciprocity'],
      ['queries', 'query'],
      ['phrases', 'phrase'],
      ['corpus', 'corpus'],
      ['stress', 'stress'],
      ['kings', 'king'],
      ['panels', 'panel'],
      ['aerodynamics', 'aerodynamic'],
      ['congress', 'congress'],
      ['serious', 'serious']
    ];

    tests.forEach(function([word, stem]) {
      assert.strictEqual(sStemmer(word), stem, `${word} => ${stem}`);
    });
  });
});
