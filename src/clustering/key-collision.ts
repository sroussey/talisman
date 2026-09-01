/**
 * Talisman clustering/key-collision
 * ==================================
 *
 * Simple clustering algorithm running in linear time just applying a
 * keying function to each data point and grouping them when the resulting
 * keys collide.
 */
import RecordLinkageClusterer from './abstract.js';
import type {ClustererParameters} from './abstract.js';
import {
  clustersFromSetGraph
} from './helpers.js';

/**
 * A keyer: returns the key(s) under which an item should be filed.
 */
export type Keyer<T> = (item: T, index: number) => string | string[] | undefined;

/**
 * Parameters of the key collision clusterer.
 */
export interface KeyCollisionClustererParameters<T> extends ClustererParameters<T> {
  /** The keyer to use. */
  readonly keys?: Keyer<T>;
  /** Alias of {@link KeyCollisionClustererParameters.keys}. */
  readonly key?: Keyer<T>;
  /** Whether items sharing a key should be merged into a single cluster. */
  readonly merge?: boolean;
}

/**
 * Key Collision Clusterer class.
 *
 * @constructor
 */
export class KeyCollisionClusterer<T = unknown> extends RecordLinkageClusterer<T> {
  /** The keyer used to file the items. */
  private readonly keyer: Keyer<T>;

  /** Whether items sharing a key should be merged into a single cluster. */
  private readonly merge: boolean;

  constructor(params: KeyCollisionClustererParameters<T>, items: T[]) {
    super(params, items);

    // Validating keyer
    this.keyer = (params.keys || params.key) as Keyer<T>;
    this.merge = params.merge || false;

    if (typeof this.keyer !== 'function')
      throw new Error('talisman/clustering/record-linkage/key-collision: the given keyer is not a function.');
  }

  runWithMerge(): T[][] {
    const map: Record<string, Set<number>> = Object.create(null);

    // Computing buckets map
    for (let i = 0, l = this.items.length; i < l; i++) {
      const item = this.items[i],
            keys = ([] as (string | undefined)[]).concat(this.keyer(item, i));

      for (let j = 0, m = keys.length; j < m; j++) {
        const key = keys[j];

        // If the key is falsy, we continue
        if (!key)
          continue;

        if (!map[key])
          map[key] = new Set();
        map[key].add(i);
      }
    }

    // Computing graph
    // TODO: I sense that we can do better & faster
    const graph: Record<number, Set<number>> = Object.create(null);

    for (const key in map) {
      const bucket = Array.from(map[key]);

      for (let i = 0, l = bucket.length; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
          graph[bucket[i]] = graph[bucket[i]] || new Set();
          graph[bucket[i]].add(bucket[j]);

          graph[bucket[j]] = graph[bucket[j]] || new Set();
          graph[bucket[j]].add(bucket[i]);
        }
      }
    }

    return clustersFromSetGraph(
      this.items,
      graph,
      this.params.minClusterSize
    );
  }

  runWithoutMerge(): T[][] {
    const map: Record<string, Set<T>> = Object.create(null);

    // Computing buckets map
    for (let i = 0, l = this.items.length; i < l; i++) {
      const item = this.items[i],
            keys = ([] as (string | undefined)[]).concat(this.keyer(item, i));

      for (let j = 0, m = keys.length; j < m; j++) {
        const key = keys[j];

        // If the key is falsy, we continue
        if (!key)
          continue;

        if (!map[key])
          map[key] = new Set();
        map[key].add(item);
      }
    }

    // Retrieving clusters
    const clusters: T[][] = [];

    for (const key in map) {
      if (map[key].size >= this.params.minClusterSize)
        clusters.push(Array.from(map[key]));
    }

    return clusters;
  }

  run(): T[][] {
    if (this.merge)
      return this.runWithMerge();
    else
      return this.runWithoutMerge();
  }
}

/**
 * Shortcut function for the key collision clusterer.
 *
 * @param params - Clusterer parameters.
 * @param items - Items to cluster.
 */
export default function keyCollision<T>(
  params: KeyCollisionClustererParameters<T>,
  items: T[]
): T[][] {
  const clusterer = new KeyCollisionClusterer(params, items);

  return clusterer.run();
}
