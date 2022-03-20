import type { Iter } from "../iter.ts";

export type Item<T> = [index: number, item: T];

export class Enumerate<T> implements Iterable<Item<T>> {
  #iter;
  #count = 0;

  constructor(iter: Iter<T>) {
    this.#iter = iter;
  }

  [Symbol.iterator](): Iterator<Item<T>> {
    return {
      next: () => this.next(),
    };
  }

  next(): IteratorResult<Item<T>> {
    const next = this.#iter.next();
    if (next.value) {
      const i = this.#count;
      this.#count++;
      return { value: [i, next.value], done: false };
    }

    return { value: undefined, done: true };
  }
}
