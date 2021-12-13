import { Enumerate, Item } from "./adapters/enumerate.ts";
import { Filter, FilterFn } from "./adapters/filter.ts";

export class Iter<T> implements Iterable<T> {
  #iter;

  constructor(iter: Iterable<T>) {
    this.#iter = iter[Symbol.iterator]();
  }

  [Symbol.iterator](): Iterator<T> {
    return {
      next: () => this.next(),
    };
  }

  next(): IteratorResult<T> {
    return this.#iter.next();
  }

  collect(): Array<T> {
    return Array.from(this);
  }

  enumerate(): Iter<Item<T>> {
    return new Iter(new Enumerate(this));
  }

  filter(f: FilterFn<T>): Iter<T> {
    return new Iter(new Filter(this, f));
  }

  filterMap<U>(f: FilterMapFn<T, U>): Iter<U> {
    return new Iter(new IterFilterMap(this, f));
  }

  find(f: FilterFn<T>): T | null {
    for (const item of this) {
      if (f(item)) return item;
    }

    return null;
  }

  findMap<U>(f: (x: T) => U | undefined): U | undefined {
    for (const item of this) {
      const result = f(item);
      if (result) return result;
    }

    return undefined;
  }

  fold<B>(init: B, f: (accum: B, x: T) => B): B {
    let accum = init;
    for (const item of this) {
      accum = f(accum, item);
    }

    return accum;
  }

  map<U>(f: MapFn<T, U>): Iter<U> {
    return new Iter(new IterMap(this, f));
  }

  reduce(f: (acum: T, x: T) => T): T | null {
    const first = this.next();
    if (!first.done) {
      return this.fold(first.value, f);
    }

    return null;
  }

  take(n: number): IterTake<T> {
    return new IterTake(this, n);
  }
}

type MapFn<T, U> = (x: T) => U;

class IterMap<T, U> {
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

type FilterMapFn<T, U> = (x: T) => U | undefined;

class IterFilterMap<T, U> {
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

class IterTake<T> extends Iter<T> {
  #iter;
  #n;

  constructor(iter: Iter<T>, n: number) {
    super(iter);
    this.#iter = iter;
    this.#n = n;
  }

  next(): IteratorResult<T> {
    if (this.#n !== 0) {
      this.#n -= 1;
      return this.#iter.next();
    }

    return { value: undefined, done: true };
  }
}
