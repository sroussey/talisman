/**
 * Talisman structures/heap tests
 * ===============================
 *
 */
import {describe, it} from 'bun:test';
import assert from 'node:assert';
import {Heap} from '../../src/structures/heap.js';

describe('heap', function() {

  it('should throw if the given comparator is not a function.', function() {
    assert.throws(function() {
      // @ts-expect-error - deliberately invalid input
      new Heap('test');
    }, /function/);
  });

  it('should pop the items in ascending order by default.', function() {
    const heap = new Heap<number>();

    [5, 1, 4, 1, 9, 3].forEach(item => heap.push(item));

    assert.strictEqual(heap.size, 6);

    const popped: (number | undefined)[] = [];

    while (heap.size)
      popped.push(heap.pop());

    assert.deepEqual(popped, [1, 1, 3, 4, 5, 9]);
  });

  it('should honor the given comparator.', function() {
    const heap = new Heap<number>((a, b) => b - a);

    [5, 1, 4, 9, 3].forEach(item => heap.push(item));

    const popped: (number | undefined)[] = [];

    while (heap.size)
      popped.push(heap.pop());

    assert.deepEqual(popped, [9, 5, 4, 3, 1]);
  });

  it('should be possible to peek at the first item.', function() {
    const heap = new Heap<number>();

    assert.strictEqual(heap.peek(), undefined);

    heap.push(4);
    assert.strictEqual(heap.peek(), 4);

    heap.push(2);
    assert.strictEqual(heap.peek(), 2);
    assert.strictEqual(heap.size, 2);
  });

  it('should return the size after a push.', function() {
    const heap = new Heap<number>();

    assert.strictEqual(heap.push(1), 1);
    assert.strictEqual(heap.push(2), 2);
  });

  it('should handle popping an empty heap.', function() {
    const heap = new Heap<number>();

    assert.strictEqual(heap.pop(), undefined);
    assert.strictEqual(heap.size, 0);
  });

  it('should be possible to clear the heap.', function() {
    const heap = new Heap<number>();

    [3, 1, 2].forEach(item => heap.push(item));
    heap.clear();

    assert.strictEqual(heap.size, 0);
    assert.strictEqual(heap.peek(), undefined);
  });

  it('should keep the k smallest items when used as a bounded heap.', function() {
    const heap = new Heap<number>((a, b) => b - a),
          items = [7, 2, 9, 4, 1, 8, 3, 6];

    items.forEach(function(item) {
      heap.push(item);

      if (heap.size > 3)
        heap.pop();
    });

    const kept: (number | undefined)[] = [];

    while (heap.size)
      kept.push(heap.pop());

    assert.deepEqual(kept.sort(), [1, 2, 3]);
  });
});
