/**
 * Minimal typings for `citation-js`, which is not a dependency of the project:
 * `bun run bib` regenerates a committed file and is run by hand, so the
 * package is installed on demand rather than by every contributor.
 *
 *   bun add -d citation-js && bun run bib
 */
declare module 'citation-js' {
  export default class Cite {
    constructor(input: string);
    format(
      type: string,
      options?: {format?: string; template?: string; lang?: string}
    ): string;
  }
}
