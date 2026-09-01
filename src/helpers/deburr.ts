/**
 * Talisman helpers/deburr
 * ========================
 *
 * Function converting the given string to its basic latin form, by dropping
 * the diacritics of its letters.
 *
 * It relies on Unicode's canonical decomposition to split accented letters
 * into a base letter followed by combining marks, which are then dropped. The
 * letters that have no such decomposition - ligatures & barred letters, mostly
 * - are transliterated through the map below.
 */

/**
 * Letters Unicode's canonical decomposition leaves alone, along with their
 * basic latin transliteration.
 */
const LIGATURES: Record<string, string> = {
  'Æ': 'Ae', 'æ': 'ae',
  'Œ': 'Oe', 'œ': 'oe',
  'Þ': 'Th', 'þ': 'th',
  'ß': 'ss', 'ẞ': 'SS',
  'Ø': 'O', 'ø': 'o',
  'Đ': 'D', 'đ': 'd',
  'Ð': 'D', 'ð': 'd',
  'Ħ': 'H', 'ħ': 'h',
  'Ł': 'L', 'ł': 'l',
  'Ŀ': 'L', 'ŀ': 'l',
  'Ŋ': 'N', 'ŋ': 'n',
  'Ŧ': 'T', 'ŧ': 't',
  'Ĳ': 'IJ', 'ĳ': 'ij',
  'ŉ': '\'n',
  'ı': 'i',
  'ĸ': 'k',
  'ſ': 's'
};

const LIGATURES_REGEX = new RegExp(`[${Object.keys(LIGATURES).join('')}]`, 'g');

/**
 * Combining marks: diacritical marks, half marks & symbols.
 */
const COMBINING_MARKS = /[̀-ͯ⃐-⃿︠-︯]/g;

/**
 * Function deburring the given string.
 *
 * The result is recomposed to NFC: the decomposition above is a means of
 * reaching the diacritics, not something the caller asked for, and leaving a
 * script the function has nothing to drop from - Hangul, Arabic, Devanagari -
 * in NFD would return a visually identical string that no longer compares
 * equal to its input. NFC is not the input's own form, though: a character
 * Unicode excludes from composition, such as the Devanagari nukta letters
 * U+0958-U+095F, still comes back decomposed.
 *
 * @param  string - The string to deburr.
 * @return The deburred string.
 *
 * @example
 *   // deburr('déjà vu') => 'deja vu'
 *   // deburr('Straße')  => 'Strasse'
 */
export default function deburr(string: string): string {
  return string
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(LIGATURES_REGEX, character => LIGATURES[character])
    .normalize('NFC');
}
