/**
 * Talisman clustering/naive
 * ==========================
 *
 * Naive clustering working by performing the n(n-1)/2 distance calculations
 * between all relevant pairs. Time complexity of such a clustering is therefore
 * O(n^2), which is quite bad.
 *
 * Note that the produced clusters are fuzzy.
 */
import RecordLinkageClusterer from './abstract.js';
import type {ClustererParameters, SimilarityPredicate} from './abstract.js';
import {
  handleSimilarityPolymorphisms,
  clustersFromArrayGraph
} from './helpers.js';

/**
 * Naive Clusterer class.
 *
 * @constructor
 */
export class NaiveClusterer<T = unknown> extends RecordLinkageClusterer<T> {
  /** Predicate deciding whether two items belong to the same cluster. */
  declare similarity: SimilarityPredicate<T>;

  /** Radius under which two items are deemed similar, when relevant. */
  declare radius?: number;

  constructor(params: ClustererParameters<T>, items: T[]) {
    super(params, items);
    handleSimilarityPolymorphisms(this, params);
  }

  run(): T[][] {
    const graph: Record<number, number[]> = {};

    // Iterating over the needed pairs
    for (let i = 0, l = this.items.length; i < l; i++) {
      const a = this.items[i];

      for (let j = i + 1; j < l; j++) {
        const b = this.items[j];

        if (this.similarity(a, b)) {
          graph[i] = graph[i] || [];
          graph[i].push(j);

          // NOTE: undirected link seems to be mandatory for it to work
          graph[j] = graph[j] || [];
          graph[j].push(i);
        }
      }
    }

    // Computing clusters
    return clustersFromArrayGraph(
      this.items,
      graph,
      this.params.minClusterSize
    );
  }
}

/**
 * Shortcut function for the naive clusterer.
 *
 * @param params - Clusterer parameters.
 * @param items - Items to cluster.
 */
export default function naive<T>(params: ClustererParameters<T>, items: T[]): T[][] {
  const clusterer = new NaiveClusterer(params, items);

  return clusterer.run();
}
