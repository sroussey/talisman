/**
 * Talisman clustering/sorted-neighborhood
 * ========================================
 *
 * Clustering method first sorting the dataset before applying pairwise
 * comparisons only within the given window. Time complexity is quite
 * better than the naive approach: O(n(w+log n)).
 */
import RecordLinkageClusterer from './abstract.js';
import type {
  ClustererParameters,
  DistanceFunction,
  SimilarityPredicate
} from './abstract.js';
import {
  handleSimilarityPolymorphisms,
  clustersFromSetGraph
} from './helpers.js';

/**
 * Parameters of the sorted neighborhood clusterer.
 */
export interface SortedNeighborhoodClustererParameters<T> extends ClustererParameters<T> {
  /** Size of the sliding window. */
  readonly window: number;
  /** Comparator used to sort the items. */
  readonly comparator?: DistanceFunction<T> | DistanceFunction<T>[];
  /** Alias of {@link SortedNeighborhoodClustererParameters.comparator}. */
  readonly comparators?: DistanceFunction<T> | DistanceFunction<T>[];
}

/**
 * Sorted Neighborhood Clusterer class.
 *
 * @constructor
 */
export class SortedNeighborhoodClusterer<T = unknown> extends RecordLinkageClusterer<T> {
  /** Predicate deciding whether two items belong to the same cluster. */
  declare similarity: SimilarityPredicate<T>;

  /** Radius under which two items are deemed similar, when relevant. */
  declare radius?: number;

  /** Size of the sliding window. */
  private readonly window: number;

  /** Comparators used to sort the items, one pass each. */
  private readonly comparators: DistanceFunction<T>[];

  /** Indices of the items, sorted anew by each comparator. */
  private readonly sorted: number[];

  constructor(params: SortedNeighborhoodClustererParameters<T>, items: T[]) {
    super(params, items);
    handleSimilarityPolymorphisms(this, params);

    if (typeof params.window !== 'number' || params.window < 1)
      throw new Error('talisman/clustering/record-linkage/sorted-neighborhood: the given window should be a number > 0.');

    this.window = params.window;

    const comparators = ([] as DistanceFunction<T>[]).concat(
      (params.comparator || params.comparators) as DistanceFunction<T> | DistanceFunction<T>[]
    );

    if (comparators.some(comparator => typeof comparator !== 'function'))
      throw new Error('talisman/clustering/record-linkage/sorted-neighborhood: the given comparators should all be functions.');

    this.comparators = comparators;

    // Cloning items because we are going to mutate the array
    this.sorted = new Array(this.items.length);

    for (let i = 0, l = this.items.length; i < l; i++) {
      this.sorted[i] = i;
    }
  }

  run(): T[][] {
    const graph: Record<number, Set<number>> = {},
          w = this.window;

    // Applying comparators
    for (let c = 0, d = this.comparators.length; c < d; c++) {
      const comparator = this.comparators[c];

      // Sorting items
      this.sorted.sort((a, b) => comparator(this.items[a], this.items[b]));

      // Performing pairwise comparisons within allowed window
      for (let i = 0, l = this.sorted.length; i < l; i++) {
        const aIndex = this.sorted[i],
              a = this.items[aIndex];

        for (let j = i + 1, m = Math.min(l, 1 + i + w); j < m; j++) {
          const bIndex = this.sorted[j],
                b = this.items[bIndex];

          if (this.similarity(a, b)) {
            graph[aIndex] = graph[aIndex] || new Set();
            graph[aIndex].add(bIndex);

            // NOTE: undirected link seems to be mandatory for it to work
            graph[bIndex] = graph[bIndex] || new Set();
            graph[bIndex].add(aIndex);
          }
        }
      }
    }

    return clustersFromSetGraph(
      this.items,
      graph,
      this.params.minClusterSize
    );
  }
}

/**
 * Shortcut function for the sorted neighborhood clusterer.
 *
 * @param params - Clusterer parameters.
 * @param items - Items to cluster.
 */
export default function sortedNeighborhood<T>(
  params: SortedNeighborhoodClustererParameters<T>,
  items: T[]
): T[][] {
  const clusterer = new SortedNeighborhoodClusterer(params, items);

  return clusterer.run();
}
