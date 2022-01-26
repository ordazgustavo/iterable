import type { Iter } from "../../mod.ts";

export type FilterMapFn<T, U> = (x: T) => U | undefined;

export class FilterMap<T, U> {
  #iter;
  #f;

  constructor(iter: Iter<T>, f: FilterMapFn<T, U>) {
    this.#iter = iter;
    this.#f = f;
  }

  [Symbol.iterator](): Iterator<U> {
    return {
      next: () => this.next(),
    };
  }

  next(): IteratorResult<U> {
    const value = this.#iter.findMap(this.#f);
    if (value) {
      return { value, done: false };
    }
    return { value: undefined, done: true };
  }
}
