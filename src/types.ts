/**
 * Talisman types
 * ===============
 *
 * Types shared across the whole library.
 */

/**
 * A generic sequence. Most of the library's functions are polymorphic and
 * accept both strings and arrays of arbitrary items.
 */
export type Sequence<T = string> = string | readonly T[];

/**
 * A numerical vector.
 */
export type Vector = ArrayLike<number>;

/**
 * A function returning a distance or a similarity between two items.
 */
export type Comparator<T = string> = (a: T, b: T) => number;

/**
 * A dictionary of frequencies, keyed by the string representation of the
 * sequence's items.
 */
export type Frequencies = Record<string, number>;
