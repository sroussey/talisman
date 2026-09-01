/**
 * Talisman tokenizers/fingerprint
 * ================================
 *
 * Fingerprint tokenizer aiming at outputing meaningful sorted tokens for the
 * given string which can later be used for similarity measures.
 */

import deburr from '../../helpers/deburr.js';
import ngrams from '../ngrams/index.js';
import {escapeRegexp} from '../../regexp/index.js';

/**
 * Constants.
 */
const WHITESPACE = /\s+/g,
      DIGITS = /\d/g,
      PUNCTUATION_CONTROL = new RegExp('[\\u2000-\\u206F\\u2E00-\\u2E7F\'!"#$%&()*+,\\-.\\/:;<=>?@\\[\\]^_`{|}~\\x00-\\x08\\x0A-\\x1F\\x7F]', 'g');

/**
 * Defaults.
 */
const DEFAULTS = {
  digits: true,
  minTokenSize: 1,
  ngrams: false,
  sort: true,
  split: null,
  stopwords: null
};

/**
 * Tokenizer function factory aiming at building the required function.
 *
 * @param options - Possible options:
 * @param digits - Whether to keep digits.
 * @param minTokenSize - Minimum token size.
 * @param ngrams - Tokenize ngrams rather than words.
 * @param split - List of token-splitting characters.
 * @param stopwords - List of stopwords.
 * @return The tokenizer function.
 */
/**
 * Options of a fingerprint tokenizer.
 */
export interface FingerprintTokenizerOptions {
  /** Whether to keep digits. */
  readonly digits?: boolean;
  /** Minimum token size. */
  readonly minTokenSize?: number;
  /** Tokenize ngrams rather than words. */
  readonly ngrams?: boolean;
  /** Whether to sort the resulting tokens. */
  readonly sort?: boolean;
  /** List of token-splitting characters. */
  readonly split?: string[] | null;
  /** List of stopwords to drop. */
  readonly stopwords?: string[] | null;
}

/**
 * A fingerprint tokenizer. In ngrams mode it takes the size of the grams
 * before the string to tokenize, else only the string itself.
 */
export interface FingerprintTokenizer {
  (string: string): string[];
  (n: number, string: string): string[];
}

export function createTokenizer(options?: FingerprintTokenizerOptions | null): FingerprintTokenizer {
  const settings = options || {};

  const ngramsTokenize = settings.ngrams || DEFAULTS.ngrams,
        stripDigits = settings.digits === false || !DEFAULTS.digits,
        minTokenSize = settings.minTokenSize || DEFAULTS.minTokenSize,
        dontSort = settings.sort === false;

  const stopwordsList = settings.stopwords || DEFAULTS.stopwords;

  // Compiling stopwords
  const stopwords = stopwordsList ?
    new RegExp(
      '(?:' +
      stopwordsList.map(word => `\\b${escapeRegexp(word)}\\b`).join('|') +
      ')',
      'gi'
    ) :
    null;

  const splitList = settings.split || DEFAULTS.split;

  // Compiling split
  const split = splitList ?
    new RegExp(
      `[${escapeRegexp(splitList.join(''))}]`,
      'g'
    ) :
    null;

  const sizeFilter = minTokenSize > 1 ?
    new RegExp(`\\b\\S{1,${minTokenSize}}\\b`, 'g') :
    null;

  // Returning the function
  return function(n: string | number, target?: string): string[] {
    let string = (ngramsTokenize ? target : n) as string;

    //-- Splitting
    if (split)
      string = string.replace(split, ' ');

    //-- Stopwords
    if (stopwords)
      string = string.replace(stopwords, '');

    //-- Digits
    if (stripDigits)
      string = string.replace(DIGITS, '');

    //-- Case normalization
    string = string.toLowerCase();

    //-- Minimum token size
    if (sizeFilter)
      string = string.replace(sizeFilter, '');

    //-- Dropping punctuation & control characters
    string = string.replace(PUNCTUATION_CONTROL, '');

    //-- Deburring
    string = deburr(string);

    //-- Trimming
    string = string.trim();

    //-- Tokenizing
    let tokens: string[];

    if (!ngramsTokenize)
      tokens = string.split(WHITESPACE);
    else
      tokens = ngrams(n as number, string.replace(WHITESPACE, ''));

    //-- Keeping only unique tokens
    tokens = [...new Set(tokens)];

    //-- Sorting tokens
    if (!dontSort)
      tokens.sort();

    return tokens;
  };
}

export default createTokenizer();

export const ngramsFingerprint = createTokenizer({ngrams: true});
