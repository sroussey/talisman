/**
 * Talisman tokenizers/syllables/sonoripy
 * =======================================
 *
 * Language-independent syllabification algorithm following the sonority
 * sequencing principle. As opposed to LegaliPy, this algorithm doesn't need
 * to be trained on word tokens but must be provided with the target
 * language's sonority hierarchy.
 *
 * [Reference]:
 * https://github.com/henchc/SonoriPy
 *
 * [Authors]:
 * Christopher Hench (UC Berkeley)
 * Alex Estes
 */

/**
 * Constants.
 */
const DEFAULT_HIERARCHY = [
  'aeiouy',     // Vowels      3pts
  'lmnrw',      // Nasals      2pts
  'zvsf',       // Fricatives  1pts
  'bcdgtkpqxhj' // Stops       0pts
];

/**
 * Helpers.
 */

/**
 * Function dropping some useless leading & trailing characters in the given
 * string.
 *
 * @param string - Target string.
 * @return The stripped string.
 */
function strip(string: string): string {
  return string.replace(/(?:^[.:;?!()'"]+)|(?:[.:;?!()'"]+$)/g, '');
}

/**
 * Function used to retokenize syllables tokens by avoiding parts that would
 * not have vowels at all by merging them with the precedent token.
 *
 * @param vowelsRegex - The regex used to test the presence of
 *                                vowels in the syllables.
 * @param syllables - The tokens.
 * @return The merged tokens.
 */
export function merge(vowelsRegex: RegExp, syllables: string[]): string[] {
  let safeSyllables: string[] = [],
      front = '';

  for (let i = 0, l = syllables.length; i < l; i++) {
    const syllable = syllables[i];

    if (!vowelsRegex.test(syllable)) {
      if (!safeSyllables.length)
        front += syllable;
      else
        safeSyllables = safeSyllables
          .slice(0, -1)
          .concat(safeSyllables.slice(-1) + syllable);
    }
    else {
      if (!safeSyllables.length)
        safeSyllables.push(front + syllable);
      else
        safeSyllables.push(syllable);
    }
  }

  return safeSyllables;
}

/**
 * Tokenizer function factory aiming at building the required function.
 *
 * @param options - Possible options:
 * @param [options.hierarchy] - Target language's hierarchy.
 * @return The tokenizer function.
 */
/**
 * Options of a sonoripy tokenizer.
 */
export interface SonoripyOptions {
  /**
   * The sonority hierarchy to use: a list of letter classes, from the most
   * sonorous to the least.
   */
  readonly hierarchy?: string[];
}

/**
 * A syllable tokenizer.
 */
export type SyllableTokenizer = (word: string) => string[];

export function createTokenizer(options?: SonoripyOptions | null): SyllableTokenizer {
  const hierarchy = options && options.hierarchy;

  if (!hierarchy)
    throw new Error('talisman/tokenizers/syllables/sonoripy: a hierachy must be provided.');

  const vowels = hierarchy[0],
        vowelsSet = new Set(vowels);

  // Creating the map of values
  const map: Record<string, number> = {};

  hierarchy.forEach((level: string, i: number) => {
    const letters = level.split(''),
          value = hierarchy.length - i - 1;

    letters.forEach(letter => map[letter] = value);
  });

  // Creating a vowel regex
  const vowelsRegex = new RegExp(`[${vowels}]`);

  /**
   * Created tokenizer function.
   *
   * @param word - The word to tokenize.
   * @return The syllables as tokens.
   */
  return function(word: string): string[] {

    // Normalizing the word
    const normalizedWord = strip(word);

    //-- 1) Tagging letters & counting vowels
    let vowelCount = 0;
    const taggedLetters: [string, number][] = [];

    for (let i = 0, l = normalizedWord.length; i < l; i++) {
      const letter = normalizedWord[i],
            lowerLetter = letter.toLowerCase();

      if (vowelsSet.has(lowerLetter))
        vowelCount++;

      taggedLetters.push([letter, map[letter] || 0]);
    }

    //-- 2) Dividing the syllables
    const syllables: string[] = [];

    // If the word is monosyllabic, we can stop right there
    if (vowelCount <= 1)
      return [word];

    let syllable = taggedLetters[0][0];

    for (let i = 1, l = taggedLetters.length; i < l; i++) {
      const [letter, value] = taggedLetters[i],
            valueBefore = (taggedLetters[i - 1] || [])[1],
            valueAfter = (taggedLetters[i + 1] || [])[1];

      // If we reached the end of the word
      if (i === l - 1) {
        syllable += letter;
        syllables.push(syllable);
      }

      // Cases triggering syllable break
      else if (
        (value === valueAfter && value === valueBefore) ||
        (value === valueAfter && value < valueBefore)
      ) {
        syllable += letter;
        syllables.push(syllable);
        syllable = '';
      }

      else if (value < valueAfter && value < valueBefore) {
        syllables.push(syllable);
        syllable = letter;
      }

      // Cases that do not trigger syllable break
      // (I dropped the condition & placed it as else because it hurts
      // performance otherwise)
      else /* if (
        (value < valueAfter && value > valueBefore) ||
        (value > valueAfter && value < valueBefore) ||
        (value > valueAfter && value > valueBefore) ||
        (value > valueAfter && value === valueBefore) ||
        (value === valueAfter && value > valueBefore) ||
        (value < valueAfter && value === valueBefore)
      ) */ {
        syllable += letter;
      }
    }

    //-- 3) Ensuring we don't have a syllable without vowel
    const safeSyllables = merge(vowelsRegex, syllables);

    return safeSyllables;
  };
}

/**
 * Exporting a default version of the tokenizer.
 */
const defaultTokenizer = createTokenizer({hierarchy: DEFAULT_HIERARCHY});
export default defaultTokenizer;
