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

  // The decomposition is a means of reaching the diacritics. Every assertion
  // above passes on a NFD result too, so only a script with nothing to drop
  // can catch the recomposition going missing.
  it('should return a script it has nothing to drop from composed.', function() {
    const tests = ['\ud55c\uad6d\uc5b4', '\u0622\u062f\u0645', '\u05e9\u05b8\u05dc\u05d5\u05b9\u05dd'];

    tests.forEach(function(string) {
      assert.strictEqual(deburr(string), string, string);
      assert.strictEqual(deburr(string.normalize('NFD')), string, string);
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
