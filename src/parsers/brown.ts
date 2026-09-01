/**
 * Talisman parsers/brown
 * =======================
 *
 * A parser for Brown corpus files.
 */
const TOKEN_REGEX = /([^/\n\t\r\s]+)\/([^\s\n]+)/g;

/**
 * Function taking text from the Brown corpus and outputting an array of
 * (word, tag) tuples.
 *
 * @param text - The text to parse.
 * @return The tokens.
 */
export default function brown(text: string): [string, string][] {
  const tokens: [string, string][] = [];
  let match: RegExpExecArray | null;

  while ((match = TOKEN_REGEX.exec(text))) {
    tokens.push([match[1], match[2]]);
  }

  TOKEN_REGEX.lastIndex = 0;

  return tokens;
}
