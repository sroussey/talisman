/**
 * Talisman structures/vp-tree
 * ============================
 *
 * Vantage point tree, storing its binary tree as flat typed arrays. Only the
 * radius query the library needs is implemented.
 *
 * Note that a VPTree has worst cases and is likely not to be perfectly
 * balanced because of median ambiguity. It is therefore not suitable for
 * hairballs and tiny datasets.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Vantage-point_tree
 *
 * Ported from Mnemonist <https://github.com/Yomguithereal/mnemonist>
 * Copyright (c) 2016 Guillaume Plique (Yomguithereal), MIT licensed.
 */
import type {DistanceFunction} from '../types.js';

/**
 * An item found by a query, along with its distance to it.
 */
export interface QueryMatch<T> {
  /** Distance between the item & the query. */
  readonly distance: number;
  /** The matching item. */
  readonly item: T;
}

/**
 * The typed arrays the tree is stored in.
 */
type PointerArray = Uint8Array | Uint16Array | Uint32Array;

type PointerArrayConstructor =
  | Uint8ArrayConstructor
  | Uint16ArrayConstructor
  | Uint32ArrayConstructor;

/**
 * Function returning the smallest typed array able to store the indices of a
 * collection of the given size.
 */
function getPointerArray(size: number): PointerArrayConstructor {
  const maxIndex = size - 1;

  if (maxIndex <= 255)
    return Uint8Array;

  if (maxIndex <= 65535)
    return Uint16Array;

  if (maxIndex <= 4294967295)
    return Uint32Array;

  throw new Error('talisman/structures/vp-tree: pointer array of size > 4294967295 is not supported.');
}

/**
 * Scratch stacks used by the in-place quicksort below.
 */
const LOS = new Float64Array(64),
      HIS = new Float64Array(64);

/**
 * Function sorting a slice of the indices by the values they point at.
 */
function inplaceQuickSortIndices(
  array: Float64Array,
  indices: PointerArray,
  lo: number,
  hi: number
): void {
  LOS[0] = lo;
  HIS[0] = hi;

  let i = 0;

  while (i >= 0) {
    let l = LOS[i],
        r = HIS[i] - 1;

    if (l < r) {
      const t = indices[l],
            p = array[t];

      while (l < r) {
        while (array[indices[r]] >= p && l < r)
          r--;

        if (l < r)
          indices[l++] = indices[r];

        while (array[indices[l]] <= p && l < r)
          l++;

        if (l < r)
          indices[r--] = indices[l];
      }

      indices[l] = t;
      LOS[i + 1] = l + 1;
      HIS[i + 1] = HIS[i];
      HIS[i++] = l;

      if (HIS[i] - LOS[i] > HIS[i - 1] - LOS[i - 1]) {
        let swap = LOS[i];
        LOS[i] = LOS[i - 1];
        LOS[i - 1] = swap;

        swap = HIS[i];
        HIS[i] = HIS[i - 1];
        HIS[i - 1] = swap;
      }
    }
    else {
      i--;
    }
  }
}

/**
 * Function returning the lower bound of the given value in the sorted slice.
 */
function lowerBoundIndices(
  array: Float64Array,
  indices: PointerArray,
  value: number,
  lo: number,
  hi: number
): number {
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;

    if (value <= array[indices[mid]])
      hi = mid;
    else
      lo = -~mid;
  }

  return lo;
}

/**
 * The flat binary tree built from the items.
 */
interface BinaryTree {
  readonly nodes: PointerArray;
  readonly lefts: PointerArray;
  readonly rights: PointerArray;
  readonly mus: Float64Array;
}

/**
 * Function building the binary tree.
 *
 * @param  distance - The distance function to use.
 * @param  items    - The items to index.
 * @param  indices  - Indices of the items, mutated along the way.
 * @return The flat binary tree.
 */
function createBinaryTree<T>(
  distance: DistanceFunction<T>,
  items: T[],
  indices: PointerArray
): BinaryTree {
  const N = indices.length;

  const PointerArrayConstructor = getPointerArray(N);

  const nodes = new PointerArrayConstructor(N),
        lefts = new PointerArrayConstructor(N),
        rights = new PointerArrayConstructor(N),
        mus = new Float64Array(N),
        distances = new Float64Array(N),
        stack = [0, 0, N];

  let C = 0;

  while (stack.length) {
    const hi = stack.pop() as number,
          lo = stack.pop() as number,
          nodeIndex = stack.pop() as number;

    // Getting our vantage point
    const vantagePoint = indices[hi - 1],
          end = hi - 1;

    const l = end - lo;

    // Storing the vantage point
    nodes[nodeIndex] = vantagePoint;

    // We are in a leaf
    if (l === 0)
      continue;

    // We only have two elements, the second one has to go right
    if (l === 1) {
      mus[nodeIndex] = distance(items[vantagePoint], items[indices[lo]]);

      C++;
      rights[nodeIndex] = C;
      nodes[C] = indices[lo];

      continue;
    }

    // Computing the distance from the vantage point to the other points
    for (let i = lo; i < end; i++)
      distances[indices[i]] = distance(items[vantagePoint], items[indices[i]]);

    inplaceQuickSortIndices(distances, indices, lo, end);

    // Finding the median of the distances
    const medianIndex = lo + l / 2 - 1;

    let mu: number;

    // Need to interpolate?
    if (medianIndex === (medianIndex | 0)) {
      mu = (distances[indices[medianIndex]] + distances[indices[medianIndex + 1]]) / 2;
    }
    else {
      mu = distances[indices[Math.ceil(medianIndex)]];
    }

    mus[nodeIndex] = mu;

    const mid = lowerBoundIndices(distances, indices, mu, lo, end);

    // Right
    if (end - mid > 0) {
      C++;
      rights[nodeIndex] = C;
      stack.push(C, mid, end);
    }

    // Left
    if (mid - lo > 0) {
      C++;
      lefts[nodeIndex] = C;
      stack.push(C, lo, mid);
    }
  }

  return {nodes, lefts, rights, mus};
}

export class VPTree<T> {
  /** The distance function the tree was built with. */
  readonly distance: DistanceFunction<T>;

  /** Number of indexed items. */
  readonly size: number;

  /** Number of distance computations performed by the last query. */
  D: number;

  /** The indexed items. */
  private readonly items: T[];

  private readonly nodes: PointerArray;
  private readonly lefts: PointerArray;
  private readonly rights: PointerArray;
  private readonly mus: Float64Array;

  constructor(distance: DistanceFunction<T>, items: Iterable<T>) {
    if (typeof distance !== 'function')
      throw new Error('talisman/structures/vp-tree: given `distance` must be a function.');

    if (!items)
      throw new Error('talisman/structures/vp-tree: you must provide items to the tree. A VPTree cannot be updated after its creation.');

    this.distance = distance;
    this.D = 0;

    this.items = Array.from(items);
    this.size = this.items.length;

    const indices = new (getPointerArray(this.size))(this.size);

    for (let i = 0; i < this.size; i++)
      indices[i] = i;

    const tree = createBinaryTree(distance, this.items, indices);

    this.nodes = tree.nodes;
    this.lefts = tree.lefts;
    this.rights = tree.rights;
    this.mus = tree.mus;
  }

  /**
   * Method returning every item lying within the given radius of the query.
   *
   * @param  radius - Maximum distance to the query.
   * @param  query  - The query.
   * @return The matching items, in no particular order.
   */
  neighbors(radius: number, query: T): QueryMatch<T>[] {
    const neighbors: QueryMatch<T>[] = [],
          stack = [0];

    this.D = 0;

    while (stack.length) {
      const nodeIndex = stack.pop() as number,
            itemIndex = this.nodes[nodeIndex],
            vantagePoint = this.items[itemIndex];

      // Distance between the query & the current vantage point
      const d = this.distance(vantagePoint, query);
      this.D++;

      if (d <= radius)
        neighbors.push({distance: d, item: vantagePoint});

      const leftIndex = this.lefts[nodeIndex],
            rightIndex = this.rights[nodeIndex];

      // We are in a leaf
      if (!leftIndex && !rightIndex)
        continue;

      const mu = this.mus[nodeIndex];

      if (d < mu) {
        if (leftIndex && d < mu + radius)
          stack.push(leftIndex);
        if (rightIndex && d >= mu - radius)
          stack.push(rightIndex);
      }
      else {
        if (rightIndex && d >= mu - radius)
          stack.push(rightIndex);
        if (leftIndex && d < mu + radius)
          stack.push(leftIndex);
      }
    }

    return neighbors;
  }
}
