import type { Iter } from "../iter.ts";

export class Take<T> implements Iterable<T> {
  #iter;
  #n;

  constructor(iter: Iter<T>, n: number) {
    this.#iter = iter;
    this.#n = n;
  }

  [Symbol.iterator](): Iterator<T> {
    return {
      next: () => this.next(),
    };
  }

  next(): IteratorResult<T> {
    if (this.#n !== 0) {
      this.#n -= 1;
      return this.#iter.next();
    }

    return { value: undefined, done: true };
  }
}
