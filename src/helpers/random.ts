/**
 * Talisman helpers/random
 * ========================
 *
 * Random sampling functions, each taking the random number generator to use so
 * that a run can be made deterministic.
 *
 * Ported from Pandemonium <https://github.com/Yomguithereal/pandemonium>
 * Copyright (c) 2018 Guillaume Plique (Yomguithereal), MIT licensed.
 */

/**
 * A random number generator returning a uniform number in [0, 1[.
 */
export type RandomNumberGenerator = () => number;

/**
 * Function creating a function returning a random integer such as a <= N <= b.
 *
 * @param  rng - The random number generator to use.
 * @return The created function.
 */
export function createRandom(rng: RandomNumberGenerator): (a: number, b: number) => number {
  return function random(a: number, b: number): number {
    return a + Math.floor(rng() * (b - a + 1));
  };
}

/**
 * Function creating a function returning a random index of the given length.
 */
function createRandomIndex(rng: RandomNumberGenerator): (length: number) => number {
  return function randomIndex(length: number): number {
    return Math.floor(rng() * length);
  };
}

/**
 * Function creating a function returning a random item of the given array.
 *
 * @param  rng - The random number generator to use.
 * @return The created function.
 */
export function createChoice(rng: RandomNumberGenerator): <T>(array: readonly T[]) => T {
  const randomIndex = createRandomIndex(rng);

  return function choice<T>(array: readonly T[]): T {
    return array[randomIndex(array.length)];
  };
}

/**
 * Function creating a function returning a sample of the given size, using
 * reservoir sampling ("Algorithm L").
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Reservoir_sampling#An_optimal_algorithm
 *
 * [Article]:
 * Li, Kim-Hung. "Reservoir-sampling algorithms of time complexity
 * O(n (1+ log (N/n)))." ACM Transactions on Mathematical Software (TOMS) 20.4
 * (1994): 481-493.
 *
 * @param  rng - The random number generator to use.
 * @return The created function.
 */
export function createGeometricReservoirSample(
  rng: RandomNumberGenerator
): <T>(k: number, sequence: readonly T[]) => T[] {
  const randomIndex = createRandomIndex(rng);

  return function geometricReservoirSample<T>(k: number, sequence: readonly T[]): T[] {
    const n = sequence.length;

    // Sample size greater than the sequence's length
    if (k >= n)
      return sequence.slice();

    const sample = new Array<T>(k);

    let i = 0;

    for (; i < k; i++)
      sample[i] = sequence[i];

    // NOTE: from this point, formulae consider i to be 1-based
    let w = Math.exp(Math.log(rng()) / k);

    if (i > n)
      return sample;

    for (;;) {
      i += Math.floor(Math.log(rng()) / Math.log(1 - w)) + 1;

      if (i > n)
        break;

      sample[randomIndex(k)] = sequence[i - 1];
      w *= Math.exp(Math.log(rng()) / k);
    }

    return sample;
  };
}
