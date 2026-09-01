/**
 * Talisman keyers/omission tests
 * ===============================
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import omission from '../../src/keyers/omission.js';

describe('omission', function() {

  it('should return proper omission keys.', function() {
    const tests = [
      ['', ''],
      ['hello', 'HLEO'],
      ['The quick brown fox jumped over the lazy dog.', 'JKQXZVWYBFMGPDHCLNTREUIOA'],
      ['Christopher', 'PHCTSRIOE'],
      ['Niall', 'LNIA'],
      ['caramel', 'MCLRAE'],
      ['Carlson', 'CLNSRAO'],
      ['Karlsson', 'KLNSRAO'],
      ['microeletronics', 'MCLNTSRIOE'],
      ['Circumstantial', 'MCLNTSRIUA'],
      ['LUMINESCENT', 'MCLNTSUIE'],
      ['multinucleate', 'MCLNTUIEA'],
      ['multinucleon', 'MCLNTUIEO'],
      ['cumulene', 'MCLNUE'],
      ['luminance', 'MCLNUIAE'],
      ['cœlomic', 'MCLOEI'],
      ['Molecule', 'MCLOEU'],
      ['Cameral', 'MCLRAE'],
      ['Maceral', 'MCLRAE'],
      ['Lacrimal', 'MCLRAI']
    ];

    tests.forEach(function([string, key]) {
      assert.strictEqual(omission(string), key, `${string} => ${key}`);
    });
  });
});
