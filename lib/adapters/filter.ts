import type { Iter } from "../iter.ts";

export type FilterFn<T> = (x: T) => boolean;

export class Filter<T> implements Iterable<T> {
  #iter;
  #f;

  constructor(iter: Iter<T>, f: FilterFn<T>) {
    this.#iter = iter;
    this.#f = f;
  }

  [Symbol.iterator](): Iterator<T> {
    return {
      next: () => this.next(),
    };
  }

  next(): IteratorResult<T> {
    const value = this.#iter.find(this.#f);
    if (value) {
      return { value, done: false };
    }

    return { value: undefined, done: true };
  }
}
