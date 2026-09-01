/**
 * Talisman clustering/abstract
 * =============================
 *
 * Abstract class used by every record-linkage clusterer to expose a same
 * interface.
 */
import type {DistanceFunction} from '../types.js';

export type {DistanceFunction};

/**
 * Defaults.
 */
const DEFAULTS = {
  minClusterSize: 2
};

/**
 * A predicate telling whether two items should be clustered together.
 */
export type SimilarityPredicate<T> = (a: T, b: T) => boolean;

/**
 * Parameters common to every record linkage clusterer.
 */
export interface ClustererParameters<T = unknown> {
  /** Minimum number of items required for a cluster to be kept. */
  readonly minClusterSize?: number;
  /** Distance function: two items match when their distance is small enough. */
  readonly distance?: DistanceFunction<T>;
  /**
   * Similarity: either a function scoring how similar two items are, to be
   * compared to `radius`, or a predicate telling whether they match.
   */
  readonly similarity?: DistanceFunction<T> | SimilarityPredicate<T>;
  /** Radius under (or above) which two items are deemed similar. */
  readonly radius?: number;
}

/**
 * The settings a clusterer resolved from its parameters.
 */
export interface ClustererSettings {
  /** Minimum number of items required for a cluster to be kept. */
  minClusterSize: number;
  /** Distance under which an item joins the closest cluster. */
  threshold?: number;
  /** Distance under which an item is added to the current canopy. */
  loose?: number;
  /** Distance under which an item is removed from the pool. */
  tight?: number;
}

/**
 * Record Linkage Clusterer class.
 *
 * @constructor
 * @param params - Clusterer parameters.
 * @param items - Items to cluster.
 */
export default class RecordLinkageClusterer<T = unknown> {
  /** The items to cluster. */
  readonly items: T[];

  /** The settings resolved from the given parameters. */
  readonly params: ClustererSettings;

  constructor(params: ClustererParameters<T>, items: T[]) {
    if (!params || typeof params !== 'object')
      throw new Error('talisman/clustering/record-linkage: the given params should be an object.');

    if (!Array.isArray(items))
      throw new Error('talisman/clustering/record-linkage: the given items should be an array.');

    // Properties
    this.items = items;
    this.params = {
      minClusterSize: params.minClusterSize || DEFAULTS.minClusterSize
    };
  }
}
