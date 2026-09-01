/**
 * Talisman phonetics/statcan
 * ===========================
 *
 * The statistics Canada name coding technique.
 *
 * [Reference]:
 * http://naldc.nal.usda.gov/download/27833/PDF
 */
import deburr from '../helpers/deburr.js';
import {squeeze} from '../helpers/index.js';

/**
 * Constants.
 */
const DROPPED = /[AEIOUY]/g;

/**
 * Function taking a single name and computing its statcan code.
 *
 * @param name - The name to process.
 * @return The statcan code.
 *
 * @throws {Error} The function expects the name to be a string.
 */
export default function statcan(name: string): string {

  if (typeof name !== 'string')
    throw Error('talisman/phonetics/statcan: the given name is not a string.');

  let code = deburr(name)
    .toUpperCase()
    .replace(/[^A-Z\s]/g, '');

  // 1-- Keeping the first letter
  const first = code[0];
  code = code.slice(1);

  // 2-- Dropping vowels and Y
  code = code.replace(DROPPED, '');

  // 3-- Dropping consecutive duplicates
  code = squeeze(code);

  // 4-- Dropping blanks
  code = code.replace(/\s/g, '');

  // 5-- Limiting code size to 4
  return (first + code).slice(0, 4);
}
