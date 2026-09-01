/**
 * Talisman bibliography formatter
 * ================================
 *
 * Regenerates BIBLIOGRAPHY.md from the paper's BibTeX file.
 *
 * `citation-js` is not a dependency of the project: this script is run by hand
 * whenever the bibliography changes, so install it on demand:
 *
 *   bun add -d citation-js && bun run bib
 */
import {readFileSync} from 'node:fs';
import Cite from 'citation-js';

const bib = new Cite(readFileSync('./paper/algorithms.bib', 'utf-8'));

const output = bib
  .format('bibliography', {
    format: 'text',
    template: 'mla',
    lang: 'en-US'
  })
  .trim()
  .split('\n')
  .map((line: string) => `> ${line}\n`)
  .join('\n');

console.log('# Talisman Bibliography\n');
console.log('[BibTex file](https://raw.githubusercontent.com/sroussey/talisman/master/paper/algorithms.bib)\n');
console.log(output);
