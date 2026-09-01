/**
 * Talisman tokenizers/lines/naive
 * ================================
 *
 * A very simple line splitter.
 *
 * [Author]: Guillaume PLIQUE
 */

/**
 * Regex.
 */
const LINES = /(?:\r\n|\n\r|\n|\r)/;

/**
 * Function tokenizing raw text into a sequence of lines.
 *
 * @param text - The text to tokenize.
 * @return The tokens.
 */
export default function lines(text: string): string[] {
  return text.split(LINES);
}
