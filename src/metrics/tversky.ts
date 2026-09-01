/**
 * Talisman metrics/tversky
 * =========================
 *
 * Functions computing the Tversky index.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Tversky_index
 *
 * [Article]:
 * Tversky, Amos (1977). "Features of Similarity".
 * Psychological Reviews 84 (4): 327–352.
 *
 * [Tags]: metric, asymmetric, string metric.
 */

/**
 * Helpers
 */
function I(X: Set<unknown>, Y: Set<unknown>): number {
  const intersection = new Set<unknown>();

  X.forEach(item => {
    if (Y.has(item))
      intersection.add(item);
  });

  return intersection.size;
}

function R(X: Set<unknown>, Y: Set<unknown>): number {
  const difference = new Set<unknown>();

  X.forEach(item => {
    if (!Y.has(item))
      difference.add(item);
  });

  return difference.size;
}


/**
 * Function returning the asymmetric Tversky index between both sequences.
 *
 * @param x - The first sequence to process.
 * @param y - The second sequence to process.
 * @param alpha - The alpha parameter.
 * @param beta - The beta parameter.
 * @return The asymmetric Tversky index.
 */
function asymmetricTversky(x: Set<unknown>, y: Set<unknown>, alpha: number, beta: number): number {
  const XIY = I(x, y);

  return XIY / (XIY + (alpha * R(x, y)) + (beta * R(y, x)));
}

/**
 * Function returning the symmetric Tversky index between both sequences.
 *
 * @param x - The first sequence to process.
 * @param y - The second sequence to process.
 * @param alpha - The alpha parameter.
 * @param beta - The beta parameter.
 * @return The symmetric Tversky index.
 */
function symmetricTversky(x: Set<unknown>, y: Set<unknown>, alpha: number, beta: number): number {
  const XIY = I(x, y),
        XminusY = R(x, y),
        YminusX = R(y, x),
        a = Math.min(XminusY, YminusX),
        b = Math.max(XminusY, YminusX);

  return XIY / (XIY + (beta * (alpha * a + Math.pow(alpha - 1, b))));
}

/**
 * Function returning the Tversky index according to given parameters between
 * both sequences.
 *
 * @param params - The index's parameters.
 * @param x - The first sequence to process.
 * @param y - The second sequence to process.
 * @return The resulting Tversky index.
 *
 * @throws {Error} The function expects both alpha & beta to be >= 0.
 */
/**
 * Parameters of the Tversky index.
 */
export interface TverskyParameters {
  /** Weight of the first sequence's relative complement. */
  readonly alpha?: number;
  /** Weight of the second sequence's relative complement. */
  readonly beta?: number;
  /** Whether to use the symmetric variant of the index. */
  readonly symmetric?: boolean;
}

export default function tversky<T>(
  params: TverskyParameters | undefined | null,
  x: Iterable<T>,
  y: Iterable<T>
): number {
  const {
    alpha = 1,
    beta = 1,
    symmetric = false
  } = params || {};

  if (alpha < 0 || beta < 0)
    throw Error('talisman/metrics/distance/tversky: alpha & beta parameters should be >= 0.');

  // Casting to sets
  const setX = new Set<T>(x),
        setY = new Set<T>(y);

  return symmetric ?
    symmetricTversky(setX, setY, alpha, beta) :
    asymmetricTversky(setX, setY, alpha, beta);
}
