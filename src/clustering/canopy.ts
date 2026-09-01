/**
 * Talisman clustering/canopy
 * ===========================
 *
 * Canopy clustering implementation.
 */
import RecordLinkageClusterer from './abstract.js';
import type {ClustererParameters, DistanceFunction} from './abstract.js';

/**
 * Parameters of the canopy clusterer.
 */
export interface CanopyClustererParameters<T> extends ClustererParameters<T> {
  /** Distance function used to compare two items. */
  readonly distance: DistanceFunction<T>;
  /** Distance under which an item is added to the current canopy. */
  readonly loose: number;
  /** Distance under which an item is removed from the pool. */
  readonly tight: number;
}

/**
 * Canopy Clusterer class.
 *
 * @constructor
 */
export class CanopyClusterer<T = unknown> extends RecordLinkageClusterer<T> {
  /** Distance function used to compare two items. */
  private readonly distance: DistanceFunction<T>;

  constructor(params: CanopyClustererParameters<T>, items: T[]) {
    super(params, items);

    // Validating the distance function
    if (typeof params.distance !== 'function')
      throw new Error('talisman/clustering/record-linkage/canopy: the given distance is not a function.');

    // Validating the thresholds
    if (typeof params.loose !== 'number')
      throw new Error('talisman/clustering/record-linkage/canopy: the given loose distance is not a number.');
    if (typeof params.tight !== 'number')
      throw new Error('talisman/clustering/record-linkage/canopy: the given tight distance is not a number.');

    if (params.loose < params.tight)
      throw new Error('talisman/clustering/record-linkage/canopy: loose distance should be greater than tight distance.');

    this.distance = params.distance;
    this.params.loose = params.loose;
    this.params.tight = params.tight;
  }

  run(): T[][] {
    const itemsIndex: Record<number, true> = {},
          clusters: T[][] = [];

    for (let i = 0, l = this.items.length; i < l; i++)
      itemsIndex[i] = true;

    for (const k in itemsIndex) {
      const a = this.items[k as unknown as number];

      // Starting a new canopy
      delete itemsIndex[k];
      const cluster = [a];

      // Comparing to other elements in the set
      for (const k2 in itemsIndex) {
        const b = this.items[k2 as unknown as number],
              d = this.distance(a, b);

        if (d <= (this.params.loose as number))
          cluster.push(b);

        if (d <= (this.params.tight as number))
          delete itemsIndex[k2];
      }

      clusters.push(cluster);
    }

    return clusters;
  }
}

/**
 * Shortcut function for the canopy clusterer.
 *
 * @param params - Clusterer parameters.
 * @param items - Items to cluster.
 */
export default function canopy<T>(params: CanopyClustererParameters<T>, items: T[]): T[][] {
  const clusterer = new CanopyClusterer(params, items);

  return clusterer.run();
}
