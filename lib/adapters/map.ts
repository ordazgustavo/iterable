import type { Iter } from "../iter.ts";

export type MapFn<T, U> = (x: T) => U;

export class IterMap<T, U> implements Iterable<U> {
  #iter;
  #f;

  constructor(iter: Iter<T>, f: MapFn<T, U>) {
    this.#iter = iter;
    this.#f = f;
  }

  [Symbol.iterator](): Iterator<U> {
    return {
      next: () => this.next(),
    };
  }

  next(): IteratorResult<U> {
    const next = this.#iter.next();
    if (!next.done) {
      return { value: this.#f(next.value), done: false };
    }
    return { value: undefined, done: true };
  }
}
