/**
 * Talisman keyers/name-power-set
 * ===============================
 *
 * Keyer returning an opinionated power set of what might be the ways to
 * write the given name so that one can try to perform fuzzy matching on
 * partial names such as "P. Henry" & "Philip Henry", for instance.
 */
import {powerSet} from 'obliterator';
import words from '../tokenizers/words/index.js';

// TODO: option for full initials? (else if solution involves only abbrev, we skip)
// TODO: disallow single token (on option)
// TODO: option to skip or not
// TODO: possibility to pass tokens rather than a string
// TODO: tweak power set token number threshold (heuristic function genre n or n - 1 etc.)
// TODO: option to convert to acronym or not
// TODO: predicate to know if we acronym or not (like do it only on firstName for instance)
// TODO: return sets as strings, not tokens

/**
 * Function expanding token by multiplexing tokens that are not initials.
 *
 * @param tokens - List of tokens.
 */
function expand(tokens: string[]): (string | string[])[] {
  const expanded: (string | string[])[] = new Array(tokens.length);

  for (let i = 0, l = tokens.length; i < l; i++)
    expanded[i] = tokens[i].length > 1 ? [tokens[i], tokens[i][0]] : tokens[i];

  return expanded;
}

/**
 * Permutation helper that will expand token possibilities.
 *
 * @param code - List of possibly expanded tokens.
 */
function permutations(code: (string | string[])[]): string[][] {
  const codes: string[][] = [[]];

  for (let i = 0, l = code.length; i < l; i++) {
    const current = code[i];

    if (typeof current === 'object') {

      // Doubling the codes
      for (let j = 0, m = codes.length * (current.length - 1); j < m; j++)
        codes.push(codes[j].slice());

      // Filling the codes
      const offset = codes.length / current.length;

      for (let j = 0, k = 0, m = current.length; j < m; j++) {
        const encoding = current[j];

        while (k < offset) {
          codes[k + j * offset].push(encoding);
          k++;
        }

        k = 0;
      }
    }
    else {

      for (let j = 0, m = codes.length; j < m; j++)
        codes[j].push(current);
    }
  }

  return codes;
}

/**
 * Function returning the name power set.
 *
 * @param name - Target name.
 */
export default function namePowerSet(name: string | string[]): string[][] {

  // If the name is not yet tokenized, we do so
  const tokenized = typeof name === 'string' ? words(name) : name;

  // Gathering items which are the sorted unique tokens of the name
  const tokens = [...new Set(tokenized)].sort();

  if (tokens.length < 2)
    return [tokens];

  const subsets: string[][] = [];

  let step: IteratorResult<string[]>;

  const iterator = powerSet(tokens);

  while ((step = iterator.next(), !step.done))
    subsets.push(step.value.slice());

  const pset = subsets
    .filter(set => set.length > 1)
    .map(expand)
    .map(permutations);

  const possibilities: string[][] = [];

  for (let i = 0, l = pset.length; i < l; i++) {
    const set = pset[i];

    for (let j = 0, m = set.length; j < m; j++) {
      if (!set[j].every(token => token.length < 2))
        possibilities.push(set[j]);
    }
  }

  return possibilities;
}
