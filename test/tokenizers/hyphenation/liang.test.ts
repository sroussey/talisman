/**
 * Talisman tokenizers/hyphenation/liang tests
 * ============================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import liang from '../../../src/tokenizers/hyphenation/liang.js';

describe('liang', function() {
  it('should correctly tokenize liang.', function() {
    const tests: [string, string[]][] = [
      ['project', ['project']],
      ['hyphenation', ['hy', 'phen', 'ation']],
      ['supercalifragilisticexpialidocious', ['su', 'per', 'cal', 'ifrag', 'ilis', 'tic', 'ex', 'pi', 'ali', 'do', 'cious']],
      ['computer', ['com', 'put', 'er']],
      ['subdivision', ['sub', 'di', 'vi', 'sion']],
      ['creative', ['cre', 'ative']],
      ['disciplines', ['dis', 'ci', 'plines']],
      ['philanthropic', ['phil', 'an', 'thropic']]
    ];

    tests.forEach(function([word, tokens]) {
      assert.deepEqual(liang(word), tokens);
    });
  });
});
