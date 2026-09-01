/**
 * Talisman metrics/distance/dice tests
 * =====================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import dice, {
  index,
  similarity,
  distance
} from '../../src/metrics/dice.js';
import sorensen, {
  index as sorensenIndex,
  similarity as sorensenSimilarity,
  distance as sorensenDistance
} from '../../src/metrics/sorensen.js';

describe('dice', function() {

 it('should compute the Dice index & aliases correctly.', function() {
  const tests: [string, string, number][] = [
    ['healed', 'healed', 1],
    ['healed', 'sealed', 0.8],
    ['healed', 'healthy', 6 / 11],
    ['healed', 'heard', 4 / 9],
    ['healed', 'herded', 0.4],
    ['healed', 'help', 0.25],
    ['healed', 'sold', 0],
    ['tomato', 'tomato', 1],
    ['h', 'help', 0],
    ['h', 'h', 1],
    ['', '', 1],
    ['h', 'g', 0]
  ];

  tests.forEach(function([x, y, i]) {
    assert.strictEqual(dice(x, y), i, `${x} / ${y}`);
    assert.strictEqual(dice(x, y), index(x, y));
    assert.strictEqual(dice(x, y), similarity(x, y));
    assert.strictEqual(1 - dice(x, y), distance(x, y));
  });
 });

 it('Sorensen index should be the same as Dice.', function() {
  const compared: [string, string] = ['healed', 'sealed'];

  assert.strictEqual(dice(...compared), sorensen(...compared));
  assert.strictEqual(index(...compared), sorensenIndex(...compared));
  assert.strictEqual(similarity(...compared), sorensenSimilarity(...compared));
  assert.strictEqual(distance(...compared), sorensenDistance(...compared));
 });
});
