/**
 * Talisman helpers/deburr tests
 * ==============================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import deburr from '../../src/helpers/deburr.js';

describe('deburr', function() {

  it('should drop the diacritics of latin letters.', function() {
    const tests: [string, string][] = [
      ['', ''],
      ['hello', 'hello'],
      ['déjà vu', 'deja vu'],
      ['François', 'Francois'],
      ['Müller', 'Muller'],
      ['Ólafsdóttir', 'Olafsdottir'],
      ['Jokūbas', 'Jokubas'],
      ['Peña', 'Pena']
    ];

    tests.forEach(function([string, expected]) {
      assert.strictEqual(deburr(string), expected, string);
    });
  });

  it('should transliterate the letters unicode does not decompose.', function() {
    const tests: [string, string][] = [
      ['Straße', 'Strasse'],
      ['Ægir', 'Aegir'],
      ['Œuvre', 'Oeuvre'],
      ['Þórr', 'Thorr'],
      ['Đorđe', 'Dorde'],
      ['Łukasz', 'Lukasz'],
      ['Ĳsselmeer', 'IJsselmeer'],
      ['ﬂ' /* not a ligature we handle */, 'ﬂ']
    ];

    tests.forEach(function([string, expected]) {
      assert.strictEqual(deburr(string), expected, string);
    });
  });

  it('should handle the letters beyond latin extended-A.', function() {
    const tests: [string, string][] = [
      ['Nguyễn', 'Nguyen'],
      ['Đặng', 'Dang'],
      ['Hoàng', 'Hoang'],
      ['Ǎnhuī', 'Anhui'],
      ['ẞ', 'SS']
    ];

    tests.forEach(function([string, expected]) {
      assert.strictEqual(deburr(string), expected, string);
    });
  });
});
