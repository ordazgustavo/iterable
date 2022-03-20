import { Enumerate, Item } from "./adapters/enumerate.ts";
import { Filter, FilterFn } from "./adapters/filter.ts";
import { FilterMap, FilterMapFn } from "./adapters/filter-map.ts";
import { IterMap, MapFn } from "./adapters/map.ts";
import { Take } from "./adapters/take.ts";

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
    return new Iter(new FilterMap(this, f));
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
      if (typeof result !== "undefined") return result;
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

  take(n: number): Iter<T> {
    return new Iter(new Take(this, n));
  }
}
