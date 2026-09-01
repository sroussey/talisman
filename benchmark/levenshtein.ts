/**
 * Talisman levenshtein benchmark
 * ===============================
 *
 * Comparing the library's Levenshtein implementations to the `leven` package.
 *
 * Run it with `bun run bench`.
 */
import leven from 'leven';
import levenshtein, {limited} from '../src/metrics/levenshtein.js';

const PAIRS: [string, string][] = [
  ['a', 'b'],
  ['ab', 'ac'],
  ['ac', 'bc'],
  ['abc', 'axc'],
  ['kitten', 'sitting'],
  ['xabxcdxxefxgx', '1ab2cd34ef5g6'],
  ['cat', 'cow'],
  ['xabxcdxxefxgx', 'abcdefg'],
  ['javawasneat', 'scalaisgreat'],
  ['example', 'samples'],
  ['sturgeon', 'urgently'],
  ['levenshtein', 'frankenstein'],
  ['distance', 'difference'],
  ['abcde', 'tes'],
  ['因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文']
];

const ITERATIONS = 50000;

/**
 * Function running the given implementation over every pair of the sample.
 */
function run(fn: (a: string, b: string) => number): void {
  for (let i = 0, l = PAIRS.length; i < l; i++)
    fn(PAIRS[i][0], PAIRS[i][1]);
}

/**
 * Function timing the given implementation.
 */
function bench(name: string, fn: (a: string, b: string) => number): void {
  // Warming the JIT up
  for (let i = 0; i < 1000; i++)
    run(fn);

  const before = performance.now();

  for (let i = 0; i < ITERATIONS; i++)
    run(fn);

  const elapsed = performance.now() - before;

  console.log(
    `${name.padEnd(12)} ${elapsed.toFixed(2)}ms ` +
    `(${((ITERATIONS * PAIRS.length) / elapsed).toFixed(0)} ops/ms)`
  );
}

console.log(`Levenshtein — ${ITERATIONS} iterations over ${PAIRS.length} pairs\n`);

bench('talisman', levenshtein);
bench('leven', leven);
bench('limited(2)', (a, b) => limited(2, a, b));
