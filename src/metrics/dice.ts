/**
 * Talisman metrics/dice
 * ======================
 *
 * Functions computing the Dice coefficient.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
 *
 * [Article]:
 * Dice, Lee R. (1945). "Measures of the Amount of Ecologic Association
 * Between Species". Ecology 26 (3): 297–302.
 *
 * [Tags]: semimetric, string metric.
 */
import tversky from './tversky.js';
import {bigrams} from '../tokenizers/ngrams/index.js';
import type {Sequence} from '../types.js';

/**
 * Dice coefficient is just Tversky index with alpha = beta = 1 over the
 * sequences' bigrams.
 */
const dice = function<T>(x: Sequence<T>, y: Sequence<T>): number {

  // Shortcuts
  if (x === y)
    return 1;

  if (x.length === 1 && y.length === 1 && x !== y)
    return 0;

  // Computing the sequences' bigrams
  return tversky({alpha: 0.5, beta: 0.5}, bigrams(x), bigrams(y));
};

/**
 * Dice distance is 1 - the Dice index.
 */
const distance = <T>(x: Sequence<T>, y: Sequence<T>): number => 1 - dice(x, y);

/**
 * Exporting.
 */
export default dice;
export {
  dice as index,
  dice as coefficient,
  dice as similarity,
  distance
};
