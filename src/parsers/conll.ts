/**
 * Talisman parsers/conll
 * =======================
 *
 * A parser for the CONLL corpus files.
 */

/**
 * Function taking a CONLL corpus' text and returning an array of sentences
 * being arrays of (word, brill_tag, wsj_tag).
 *
 * @param text - The text to parse.
 * @return The tokens.
 */
export default function conll(text: string): string[][][] {
  const sentences: string[][][] = [],
        lines = text.split('\n');

  let sentence: string[][] = [];
  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i];

    if (!line) {
      if (sentence.length) {
        sentences.push(sentence);
        sentence = [];
      }
    }
    else {
      sentence.push(line.split(' '));
    }
  }

  if (sentence.length)
    sentences.push(sentence);

  return sentences;
}
