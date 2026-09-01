/**
 * Talisman keyers/fingerprint
 * ============================
 *
 * Keyer based on the fingerprint tokenizer.
 */
import {createTokenizer} from '../tokenizers/fingerprint/index.js';
import nameFingerprintTokenizer from '../tokenizers/fingerprint/name.js';
import type {FingerprintTokenizerOptions} from '../tokenizers/fingerprint/index.js';

/**
 * A fingerprint keyer. In ngrams mode it takes the size of the grams before
 * the string to key, else only the string itself.
 */
export interface FingerprintKeyer {
  (string: string): string;
  (n: number, string: string): string;
}

export function createKeyer(options?: FingerprintTokenizerOptions | null): FingerprintKeyer {
  const settings = options || {};

  const tokenizer = createTokenizer(settings);

  if (settings.ngrams)
    return ((n: number, string: string) => tokenizer(n, string).join('')) as FingerprintKeyer;

  return ((string: string) => tokenizer(string).join(' ')) as FingerprintKeyer;
}

export default createKeyer();

const ngramsFingerprint = createKeyer({ngrams: true});

const nameFingerprint = (name: string): string => nameFingerprintTokenizer(name).join(' ');

export {ngramsFingerprint, nameFingerprint};
