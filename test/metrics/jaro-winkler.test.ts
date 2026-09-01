/**
 * Talisman metrics/distance/jaro-winkler tests
 * =============================================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import {approximately} from '../utils.js';
import jaro, {distance, similarity} from '../../src/metrics/jaro.js';
import jaroWinkler, {
  distance as jaroWinklerDistance,
  similarity as jaroWinklerSimilarity,
  custom
} from '../../src/metrics/jaro-winkler.js';

describe('jaro', function() {

  it('should compute the Jaro distance correctly.', function() {
    const tests: [string | string[], string | string[], number][] = [
      ['Duane', 'Duane', 1],
      ['Dwayne', 'Duane', 0.82],
      ['Dwayne'.split(''), 'Duane'.split(''), 0.82],
      ['Martha', 'Marhta', 0.94],
      ['Dixon', 'Dicksonx', 0.77],
      ['Duane', 'Freakishlylongstring', 0.47]
    ];

    tests.forEach(function([a, b, d]) {
      approximately(jaro(a, b), d, 0.01, `${a} / ${b}`);
      approximately(distance(a, b), 1 - d, 0.01, `${a} / ${b}`);
      approximately(similarity(a, b), d, 0.01, `${a} / ${b}`);
    });
  });
});

describe('jaro-winkler', function() {

  it('should compute the Jaro-Winkler distance correctly.', function() {
    const tests: [string | string[], string | string[], number][] = [
      ['Duane', 'Duane', 1],
      ['Dwayne', 'Duane', 0.84],
      ['Dwayne'.split(''), 'Duane'.split(''), 0.84],
      ['Martha', 'Marhta', 0.96],
      ['Dixon', 'Dicksonx', 0.81],
      ['Duane', 'Freakishlylongstring', 0.47],
      ['commonlongprefixword', 'commonlongprefixworm', 0.98]
    ];

    tests.forEach(function([a, b, d]) {
      approximately(jaroWinkler(a, b), d, 0.01, `${a} / ${b}`);
      approximately(jaroWinklerDistance(a, b), 1 - d, 0.01, `${a} / ${b}`);
      approximately(jaroWinklerSimilarity(a, b), d, 0.01, `${a} / ${b}`);
    });
  });

  it('should throw when passing wrong parameters to the algorithm.', function() {
    assert.throws(function() {
      custom({boostThreshold: 2}, 'Duane', 'Dwayne');
    }, /comprised/);

    assert.throws(function() {
      custom({scalingFactor: 0.40}, 'Duane', 'Dwayne');
    }, /scaling/);
  });

  it('should be possible to use a custom version of the algorithm.', function() {
    approximately(custom({boostThreshold: 0.6}, 'Duane', 'Dwayne'), 0.84, 0.01);
    approximately(custom({scalingFactor: 0.15}, 'Duane', 'Dwayne'), 0.84, 0.01);
  });
});
