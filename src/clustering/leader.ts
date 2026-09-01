/**
 * Talisman clustering/leader
 * ===========================
 *
 * The Leader clustering algorithm is a quite simple algorithm used to partition
 * arbitrary data and running in O(ln) time complexity, l being the number of
 * clusters.
 *
 * It's also important to note that the resulting partition might change with
 * the order of given items.
 */
import RecordLinkageClusterer from './abstract.js';
import type {ClustererParameters, DistanceFunction} from './abstract.js';

/**
 * Parameters of the leader clusterer.
 */
export interface LeaderClustererParameters<T> extends ClustererParameters<T> {
  /** Distance function used to compare an item to a cluster's leader. */
  readonly distance: DistanceFunction<T>;
  /** Distance under which an item joins the closest cluster. */
  readonly threshold: number;
}

/**
 * Leader Clusterer class.
 *
 * @constructor
 */
export class LeaderClusterer<T = unknown> extends RecordLinkageClusterer<T> {
  /** Distance function used to compare an item to a cluster's leader. */
  private readonly distance: DistanceFunction<T>;

  constructor(params: LeaderClustererParameters<T>, items: T[]) {
    super(params, items);

    // Validating the distance function
    if (typeof params.distance !== 'function')
      throw new Error('talisman/clustering/record-linkage/leader: the given distance is not a function.');

    // Validating the thresholds
    if (typeof params.threshold !== 'number')
      throw new Error('talisman/clustering/record-linkage/leader: the given threshold is not a number.');

    this.distance = params.distance;
    this.params.threshold = params.threshold;
  }

  run(): T[][] {
    const clusters: T[][] = [];

    for (let i = 0, l = this.items.length; i < l; i++) {
      const item = this.items[i];

      let closestClusterIndex = -1,
          closest = Infinity;

      for (let j = 0, m = clusters.length; j < m; j++) {
        const clusterLeader = clusters[j][0],
              distance = this.distance(clusterLeader, item);

        if (distance < closest) {
          closest = distance;
          closestClusterIndex = j;
        }
      }

      if (closest <= (this.params.threshold as number)) {
        clusters[closestClusterIndex].push(item);
      }
      else {
        clusters.push([item]);
      }
    }

    return clusters;
  }
}

/**
 * Shortcut function for the leader clusterer.
 *
 * @param params - Clusterer parameters.
 * @param items - Items to cluster.
 */
export default function leader<T>(params: LeaderClustererParameters<T>, items: T[]): T[][] {
  const clusterer = new LeaderClusterer(params, items);

  return clusterer.run();
}
