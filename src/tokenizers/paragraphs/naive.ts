/**
 * Talisman tokenizers/paragraphs/naive
 * =====================================
 *
 * A very simple paragraph tokenizer.
 *
 * [Author]: Guillaume PLIQUE
 */

/**
 * Regex.
 */
const PARAGRAPHS = /(?:\n\r|\r\n|\r|\n)[\t\s]*(?:\n\r|\r\n|\r|\n)+/;

/**
 * Function tokenizing raw text into a sequence of paragraphs.
 *
 * @param text - The text to tokenize.
 * @return The tokens.
 */
export default function paragraphs(text: string): string[] {
  return text.split(PARAGRAPHS);
}
