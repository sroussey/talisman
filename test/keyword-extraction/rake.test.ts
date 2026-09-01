/**
 * Talisman keyword-extraction/rake tests
 * =======================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import sentences from '../../src/tokenizers/sentences/index.js';
import words from '../../src/tokenizers/words/treebank.js';
import createExtractor from '../../src/keyword-extraction/rake.js';
import {loadResource} from '../utils.js';

const FOX = loadResource('stopwords/fox.txt'),
      STOPWORDS = FOX.split('\n').slice(0, -1);

const DOCUMENT = `
  Compatibility of systems of linear constraints over the set of natural numbers.

  Criteria of compatibility of a system of linear Diophantine equations, strict inequations, and nonstrict inequations are considered. Upper bounds for components of a minimal set of solutions and algorithms of construction of minimal generating sets of solutions for all types of systems are given. These criteria and the corresponding algorithms for constructing a minimal supporting set of solutions can be used in solving all the considered types of systems and systems of mixed types.
`.replace(/\n+/g, ' ').replace(/\s+/, ' ');

const TOKENIZED_DOCUMENT = sentences(DOCUMENT.replace(/\n+/g, ' ')).map(sentence => words(sentence.toLowerCase()));

describe('rake', function() {

  it('should throw if given an invalid list of stopwords.', function() {

    assert.throws(function() {
      createExtractor(null);
    }, /stopwords/);

    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      createExtractor({stopwords: 34});
    }, /stopwords/);
  });

  it('should properly extract keywords.', function() {
    const rake = createExtractor({stopwords: STOPWORDS});

    const keywords = rake(TOKENIZED_DOCUMENT);

    assert.deepEqual(keywords, [
      ['minimal', 'generating', 'sets'],
      ['linear', 'diophantine', 'equations'],
      ['minimal', 'supporting', 'set'],
      ['minimal', 'set'],
      ['linear', 'constraints'],
      ['upper', 'bounds'],
      ['strict', 'inequations'],
      ['nonstrict', 'inequations']
    ]);
  });
});
