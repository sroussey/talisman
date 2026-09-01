/**
 * Talisman clustering/helpers
 * ============================
 *
 * Common function used throughout the clustering namespace.
 */
import type {
  ClustererParameters,
  DistanceFunction,
  SimilarityPredicate
} from './abstract.js';

/**
 * Function handling distance/similarity & radius parameter polymorphisms.
 *
 * @param target - Target instance.
 * @param params - Parameters.
 */

/**
 * What {@link handleSimilarityPolymorphisms} needs to install its predicate on.
 */
interface SimilarityTarget<T> {
  similarity: SimilarityPredicate<T>;
  radius?: number;
}

export function handleSimilarityPolymorphisms<T>(
  target: SimilarityTarget<T>,
  params: ClustererParameters<T>
): void {
  if ('radius' in params && typeof params.radius !== 'number')
    throw new Error('talisman/clustering/record-linkage: the given radius should be a number.');

  if (typeof params.distance !== 'function' && typeof params.similarity !== 'function')
    throw new Error('talisman/clustering/record-linkage: the clusterer should be given a distance or a similarity function.');

  const distance = params.distance,
        similarity = params.similarity as DistanceFunction<T>;

  if ('radius' in params) {
    const radius = params.radius as number;

    target.radius = radius;

    if (distance)
      target.similarity = (a, b) => {
        return distance(a, b) <= radius;
      };
    else
      target.similarity = (a, b) => {
        return similarity(a, b) >= radius;
      };
  }
  else {

    if (distance)
      target.similarity = (a, b) => !distance(a, b);
    else
      target.similarity = similarity as unknown as SimilarityPredicate<T>;
  }
}

// NOTE: it is possible to sort the clusters by size beforehand to make
// the largest clusters possible, or even to order in reverse

// NOTE: since we'd want to sort by lenghts here, it's possible to use
// a linear time algorithm such as radix sort

// NOTE: should iterate on graph rather than on items & delete keys from the
// graph rather than having a set register

/**
 * Function returning a list of clusters from the given items & similarity
 * graph represented as an index of items to the array of neighbors.
 *
 * @param items - List of items.
 * @param graph - Similarity graph.
 * @param minClusterSize - Minimum number of items in a cluster.
 */
export function clustersFromArrayGraph<T>(
  items: T[],
  graph: Record<number, number[]>,
  minClusterSize: number
): T[][] {
  const clusters: T[][] = [],
        visited = new Set<number>();

  let cluster: T[];

  for (let i = 0, l = items.length; i < l; i++) {
    const item = items[i];

    if (visited.has(i))
      continue;

    if (!graph[i])
      continue;

    if (graph[i].length + 1 < minClusterSize)
      continue;

    cluster = new Array(graph[i].length + 1);
    cluster[0] = item;
    visited.add(i);

    // Adding neighbors to the cluster
    for (let j = 0, m = graph[i].length; j < m; j++) {
      const neighborIndex = graph[i][j],
            neighbor = items[neighborIndex];

      cluster[j + 1] = neighbor;
      visited.add(neighborIndex);
    }

    clusters.push(cluster);
  }

  return clusters;
}

/**
 * Function returning a list of clusters from the given items & similarity
 * graph represented as an index of items to the set of neighbors.
 *
 * @param items - List of items.
 * @param graph - Similarity graph.
 * @param minClusterSize - Minimum number of items in a cluster.
 */
export function clustersFromSetGraph<T>(
  items: T[],
  graph: Record<number, Set<number>>,
  minClusterSize: number
): T[][] {
  const clusters: T[][] = [],
        visited = new Set<number>();

  let cluster: T[];

  for (let i = 0, l = items.length; i < l; i++) {
    const item = items[i];

    if (visited.has(i))
      continue;

    if (!graph[i])
      continue;

    if (graph[i].size + 1 < minClusterSize)
      continue;

    cluster = new Array(graph[i].size + 1);
    cluster[0] = item;
    visited.add(i);

    // Adding neighbors to the cluster
    const iterator = graph[i].values();

    let step: IteratorResult<number>,
        j = 1;

    while ((step = iterator.next()) && !step.done) {
      const neighborIndex = step.value,
            neighbor = items[neighborIndex];

      cluster[j] = neighbor;
      visited.add(neighborIndex);
      j++;
    }

    clusters.push(cluster);
  }

  return clusters;
}
