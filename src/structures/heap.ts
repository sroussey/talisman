/**
 * Talisman structures/heap
 * =========================
 *
 * Binary heap. Only the operations the library needs are implemented.
 *
 * Ported from Mnemonist <https://github.com/Yomguithereal/mnemonist>
 * Copyright (c) 2016 Guillaume Plique (Yomguithereal), MIT licensed.
 */

/**
 * A function ordering two items, the way `Array#sort` expects one.
 */
export type HeapComparator<T> = (a: T, b: T) => number;

/**
 * Comparator used when none is provided.
 */
const DEFAULT_COMPARATOR: HeapComparator<unknown> = function (a, b) {
  if ((a as never) < (b as never))
    return -1;
  if ((a as never) > (b as never))
    return 1;

  return 0;
};

/**
 * Function moving the item at the given index up towards the root, until its
 * parent compares lower than it.
 */
function siftDown<T>(
  compare: HeapComparator<T>,
  heap: T[],
  startIndex: number,
  i: number
): void {
  const item = heap[i];

  while (i > startIndex) {
    const parentIndex = (i - 1) >> 1,
          parent = heap[parentIndex];

    if (compare(item, parent) < 0) {
      heap[i] = parent;
      i = parentIndex;
      continue;
    }

    break;
  }

  heap[i] = item;
}

/**
 * Function moving the item at the given index down towards the leaves, then
 * back up to its final position.
 */
function siftUp<T>(compare: HeapComparator<T>, heap: T[], i: number): void {
  const endIndex = heap.length,
        startIndex = i,
        item = heap[i];

  let childIndex = 2 * i + 1;

  while (childIndex < endIndex) {
    const rightIndex = childIndex + 1;

    if (rightIndex < endIndex && compare(heap[childIndex], heap[rightIndex]) >= 0)
      childIndex = rightIndex;

    heap[i] = heap[childIndex];
    i = childIndex;
    childIndex = 2 * i + 1;
  }

  heap[i] = item;
  siftDown(compare, heap, startIndex, i);
}

export class Heap<T> {
  /** Number of items currently stored by the heap. */
  size: number;

  /** The heap's items, kept in heap order rather than sorted order. */
  private items: T[];

  /** The comparator ordering the items. */
  private readonly comparator: HeapComparator<T>;

  constructor(comparator?: HeapComparator<T>) {
    this.items = [];
    this.size = 0;
    this.comparator = comparator || (DEFAULT_COMPARATOR as HeapComparator<T>);

    if (typeof this.comparator !== 'function')
      throw new Error('talisman/structures/heap: given comparator should be a function.');
  }

  /**
   * Method emptying the heap.
   */
  clear(): void {
    this.items = [];
    this.size = 0;
  }

  /**
   * Method pushing an item into the heap.
   *
   * @param  item - The item to push.
   * @return The heap's new size.
   */
  push(item: T): number {
    this.items.push(item);
    siftDown(this.comparator, this.items, 0, this.items.length - 1);

    return ++this.size;
  }

  /**
   * Method returning the heap's first item without removing it.
   */
  peek(): T | undefined {
    return this.items[0];
  }

  /**
   * Method removing & returning the heap's first item.
   */
  pop(): T | undefined {
    if (this.size !== 0)
      this.size--;

    const lastItem = this.items.pop();

    if (this.items.length !== 0) {
      const item = this.items[0];

      this.items[0] = lastItem as T;
      siftUp(this.comparator, this.items, 0);

      return item;
    }

    return lastItem;
  }
}
