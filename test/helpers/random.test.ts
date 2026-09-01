/**
 * Talisman helpers/random tests
 * ==============================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import {
  createRandom,
  createChoice,
  createGeometricReservoirSample
} from '../../src/helpers/random.js';

/**
 * Deterministic generator so the assertions can be exact.
 */
function createTestRng(seed: number): () => number {
  let state = seed >>> 0;

  return function rng() {
    state = (state * 1664525 + 1013904223) >>> 0;

    return state / 4294967296;
  };
}

describe('random', function() {

  describe('#.createRandom', function() {

    it('should return integers within the given bounds.', function() {
      const random = createRandom(createTestRng(42));

      for (let i = 0; i < 1000; i++) {
        const value = random(3, 7);

        assert.strictEqual(value, Math.floor(value));
        assert(value >= 3 && value <= 7, `${value} out of bounds`);
      }
    });

    it('should be driven by the given generator only.', function() {
      const a = createRandom(createTestRng(1)),
            b = createRandom(createTestRng(1));

      for (let i = 0; i < 100; i++)
        assert.strictEqual(a(0, 1000), b(0, 1000));
    });

    it('should reach both bounds.', function() {
      const random = createRandom(createTestRng(7)),
            seen = new Set<number>();

      for (let i = 0; i < 1000; i++)
        seen.add(random(0, 2));

      assert.deepEqual(Array.from(seen).sort(), [0, 1, 2]);
    });
  });

  describe('#.createChoice', function() {

    it('should return an item of the array.', function() {
      const choice = createChoice(createTestRng(42)),
            array = ['a', 'b', 'c', 'd'];

      for (let i = 0; i < 100; i++)
        assert(array.includes(choice(array)));
    });

    it('should be reproducible.', function() {
      const array = ['a', 'b', 'c', 'd'],
            a = createChoice(createTestRng(3)),
            b = createChoice(createTestRng(3));

      for (let i = 0; i < 100; i++)
        assert.strictEqual(a(array), b(array));
    });
  });

  describe('#.createGeometricReservoirSample', function() {
    const array = 'abcdefghijklmnopqrstuvwxyz'.split('');

    it('should return the whole sequence when the sample is large enough.', function() {
      const sample = createGeometricReservoirSample(createTestRng(42));

      assert.deepEqual(sample(array.length, array), array);
      assert.deepEqual(sample(array.length + 10, array), array);
    });

    it('should return a copy rather than the sequence itself.', function() {
      const sample = createGeometricReservoirSample(createTestRng(42)),
            result = sample(array.length, array);

      assert.notStrictEqual(result, array);
    });

    it('should return a sample of the requested size, drawn from the sequence.', function() {
      const sample = createGeometricReservoirSample(createTestRng(42));

      for (let k = 1; k < array.length; k++) {
        const result = sample(k, array);

        assert.strictEqual(result.length, k);
        result.forEach(item => assert(array.includes(item), item));
      }
    });

    it('should be reproducible.', function() {
      const a = createGeometricReservoirSample(createTestRng(11)),
            b = createGeometricReservoirSample(createTestRng(11));

      for (let k = 1; k < 10; k++)
        assert.deepEqual(a(k, array), b(k, array));
    });
  });
});
