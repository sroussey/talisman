/**
 * Talisman clustering/vp-tree
 * ============================
 *
 * Clustering method using a Vantage Point Tree (VPTree) to find the clusters
 * more efficiently.
 */
import {VPTree} from '../structures/vp-tree.js';
import RecordLinkageClusterer from './abstract.js';
import type {ClustererParameters, DistanceFunction} from './abstract.js';

/**
 * Parameters of the vp-tree clusterer.
 */
export interface VPTreeClustererParameters<T> extends ClustererParameters<T> {
  /** Distance function used to compare two items. */
  readonly distance: DistanceFunction<T>;
  /** Radius under which two items are deemed similar. */
  readonly radius: number;
}

/**
 * Vantage Point Tree Clusterer class.
 *
 * @constructor
 */
export class VPTreeClusterer<T = unknown> extends RecordLinkageClusterer<T> {
  /** Radius under which two items are deemed similar. */
  private readonly radius: number;

  /** Distance function used to compare two items. */
  private readonly distance: DistanceFunction<T>;

  constructor(params: VPTreeClustererParameters<T>, items: T[]) {
    super(params, items);

    // Validating radius
    if (typeof params.radius !== 'number')
      throw new Error('talisman/clustering/record-linkage/vp-tree: the given radius is not a number.');

    // Validating the distance function
    if (typeof params.distance !== 'function')
      throw new Error('talisman/clustering/record-linkage/vp-tree: the given distance is not a function.');

    // Properties
    this.radius = params.radius;
    this.distance = params.distance;
  }

  run(): T[][] {

    // Building the tree
    const tree = new VPTree(this.distance, this.items);

    // Retrieving the clusters
    const clusters: T[][] = [],
          visited = new Set<T>();

    for (let i = 0, l = this.items.length; i < l; i++) {
      const item = this.items[i];

      if (visited.has(item))
        continue;

      const neighbors = tree.neighbors(this.radius, item);

      const cluster: T[] = new Array(neighbors.length);

      for (let j = 0, m = neighbors.length; j < m; j++) {
        visited.add(neighbors[j].item);
        cluster[j] = neighbors[j].item;
      }

      if (cluster.length >= this.params.minClusterSize)
        clusters.push(cluster);
    }

    return clusters;
  }
}

/**
 * Shortcut function for the vantage point tree clusterer.
 *
 * @param params - Clusterer parameters.
 * @param items - Items to cluster.
 */
export default function vpTree<T>(params: VPTreeClustererParameters<T>, items: T[]): T[][] {
  const clusterer = new VPTreeClusterer(params, items);

  return clusterer.run();
}
