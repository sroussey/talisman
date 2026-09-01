/**
 * Talisman inflectors/spanish/noun
 * =================================
 *
 * A noun inflector for the Spanish language.
 *
 * [Reference]:
 * https://github.com/bermi/Python-Inflector
 *
 * [Auhors]:
 * Bermi Ferrer Martinez
 * Carles Sadurní Anguita
 */
import {translation} from '../../helpers/index.js';

/**
 * Constants.
 */
const ACCENT_MAP = translation(
  'AEIOUaeiou',
  'ÁÉÍÓÚáéíóú'
);

/**
 * A singularization rule: the pattern to match, its replacement & whether
 * accents should be restored.
 */
type SingularRule = [RegExp, string, boolean?];

const SINGULAR_RULES: SingularRule[] = [
  [/^([bcdfghjklmnñpqrstvwxyz]*)([aeiou])([ns])es$/i, '$1$2$3'],
  [/([aeiou])([ns])es$/i, '$1$2', true],
  [/shes$/i, 'sh'],
  [/oides$/i, 'oide'],
  [/(sis|tis|xis)$/i, '$1'],
  [/(é)s$/i, '$1'],
  [/(ces)$/i, 'z'],
  [/([^e])s$/i, '$1'],
  [/([bcdfghjklmnñprstvwxyz]{2,}e)s$/i, '$1'],
  [/([ghñptv]e)s$/i, '$1'],
  [/jes$/i, 'je'],
  [/ques$/i, 'que'],
  [/es$/i, '']
];

const IMMUTABLE_WORDS = new Set([
  'lunes', 'martes', 'miércoles', 'jueves', 'viernes',
  'paraguas', 'tijeras', 'gafas', 'vacaciones', 'víveres',
  'cumpleaños', 'virus', 'atlas', 'sms', 'hummus'
]);

const IRREGULAR_SINGULAR_TO_PLURAL: Record<string, string> = {
  base: 'bases',
  carácter: 'caracteres',
  champú: 'champús',
  curriculum: 'currículos',
  espécimen: 'especímenes',
  jersey: 'jerséis',
  memorándum: 'memorandos',
  menú: 'menús',
  no: 'noes',
  país: 'países',
  referéndum: 'referendos',
  régimen: 'regímenes',
  sándwich: 'sándwiches',
  si: 'sis',
  taxi: 'taxis',
  ultimátum: 'ultimatos'
};

const IRREGULAR_PLURAL_TO_SINGULAR: Record<string, string> = {};

for (const singular in IRREGULAR_SINGULAR_TO_PLURAL)
  IRREGULAR_PLURAL_TO_SINGULAR[IRREGULAR_SINGULAR_TO_PLURAL[singular]] = singular;

/**
 * Function used to apply source word's case to target word.
 *
 * @param source - Source word.
 * @param target - Target word.
 */
function transferCase(source: string, target: string): string {
  let cased = '';

  for (let i = 0, l = target.length; i < l; i++) {
    const c = source[i].toLowerCase() === source[i] ?
      'toLowerCase' :
      'toUpperCase';

    cased += target[i][c]();
  }

  return cased;
}

/**
 * Function used to inflect nouns to their singular form.
 *
 * @param noun - Noun to inflect.
 * @return The singular version.
 */
export function singularize(noun: string): string {
  const lowerCaseNoun = noun.toLowerCase();

  // Checking immutable words
  if (IMMUTABLE_WORDS.has(lowerCaseNoun))
    return noun;

  // Checking irregulars
  const irregular = IRREGULAR_PLURAL_TO_SINGULAR[noun];

  if (irregular)
    return transferCase(noun, irregular);

  // Applying rules
  for (let i = 0, l = SINGULAR_RULES.length; i < l; i++) {
    const [pattern, replacement, accent] = SINGULAR_RULES[i];

    const match = pattern.test(noun);

    if (match) {

      let singular: string;

      // Watching out for accents
      if (accent)
        singular = noun.replace(pattern, (_: string, m1: string, m2: string) => {
          return ACCENT_MAP[m1] + m2;
        });
      else
        singular = noun.replace(pattern, replacement);

      return singular;
    }
  }

  return noun;
}
