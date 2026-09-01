/**
 * Talisman keyers/normalize
 * ==========================
 *
 * Generic function used to normalize strings to make them a good basis for
 * fuzzy comparisons.
 */

import deburr from 'lodash/deburr.js';
import {
  SINGLE_QUOTES as SINGLE_QUOTES_CLASS,
  DOUBLE_QUOTES as DOUBLE_QUOTES_CLASS,
  HYPHENS as HYPHENS_CLASS,
  COMMAS as COMMAS_CLASS
} from '../regexp/classes.js';

/**
 * Regular expressions.
 */
const CONTROL_CHARACTERS = new RegExp('[\\x00-\\x08\\x0A-\\x1F\\x7F]', 'g'),
      SINGLE_QUOTES = new RegExp(`[${SINGLE_QUOTES_CLASS}]`, 'g'),
      DOUBLE_QUOTES = new RegExp(`[${DOUBLE_QUOTES_CLASS}]`, 'g'),
      HYPHENS = new RegExp(`[${HYPHENS_CLASS}]`, 'g'),
      COMMAS = new RegExp(`[${COMMAS_CLASS}]`, 'g'),
      WHITESPACE_COMPRESSION = /\s+/g;

const CONVERSIONS: [RegExp, string][] = [
  [/…/g, '...'],
  [/æ/g, 'ae'],
  [/œ/g, 'oe'],
  [/ß/g, 'ss']
];

/**
 * Function creating a normalizer function.
 *
 * @param params - Options:
 * @param keepAccents - Whether to keep accents.
 * @param keepCase - Whether to keep the case.
 */
/**
 * Parameters of a normalizer.
 */
export interface NormalizerParameters {
  /** Whether accents should be kept. */
  readonly keepAccents?: boolean;
  /** Whether the original case should be kept. */
  readonly keepCase?: boolean;
}

export function createNormalizer(
  params?: NormalizerParameters | null
): (string: string) => string {
  const settings = params || {};

  const keepAccents = settings.keepAccents === true,
        keepCase = settings.keepCase === true;

  /**
   * Function returning a normalized string.
   *
   * @param string - String to normalize.
   */
  return function normalizer(string: string): string {
    if (!keepCase)
      string = string.toLowerCase();

    string = string
      .trim()
      .replace(WHITESPACE_COMPRESSION, ' ')
      .replace(CONTROL_CHARACTERS, '')
      .replace(SINGLE_QUOTES, '\'')
      .replace(DOUBLE_QUOTES, '"')
      .replace(HYPHENS, '-')
      .replace(COMMAS, ',');

    for (let i = 0, l = CONVERSIONS.length; i < l; i++) {
      const pattern = CONVERSIONS[i][0],
            replacement = CONVERSIONS[i][1];

      string = string.replace(pattern, replacement);
    }

    if (!keepAccents)
      string = deburr(string);

    return string;
  };
}

export default createNormalizer();
