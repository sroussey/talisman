/**
 * Talisman phonetics/onca
 * ========================
 *
 * The Oxford Name Compression Algorithm. This is basically a glorified
 * NYSIIS + Soundex combination.
 */
import soundex from './soundex.js';
import nysiis from './nysiis.js';

/**
 * Function taking a single name and computing its ONCA code.
 *
 * @param name - The name to process.
 * @return The ONCA code.
 */
export default function onca(name: string): string {
  return soundex(nysiis(name));
}
