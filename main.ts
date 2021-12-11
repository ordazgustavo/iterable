export class Iter<T> implements Iterable<T> {
  #iter;

  constructor(iter: Iterable<T>) {
    this.#iter = iter[Symbol.iterator]();
  }

  [Symbol.iterator](): Iterator<T> {
    return {
      next: () => this.#iter.next(),
    };
  }

  next() {
    return this.#iter.next();
  }

  collect(): T[] {
    const acc: T[] = [];
    for (const item of this) {
      acc.push(item);
    }

    return acc;
  }

  filter(f: (x: T) => boolean): IterFilter<T> {
    return new IterFilter(this, f);
  }

  find(f: (x: T) => boolean): T | null {
    for (const item of this) {
      if (f(item)) return item;
    }

    return null;
  }

  fold<B>(init: B, f: (accum: B, x: T) => B): B {
    let accum = init;
    for (const item of this) {
      accum = f(accum, item);
    }

    return accum;
  }

  reduce(f: (acum: T, x: T) => T): T | null {
    const first = this.next();
    if (!first.done) {
      return this.fold(first.value, f);
    }

    return null;
  }
}

class IterFilter<T> extends Iter<T> {
  #iter;
  #f;

  constructor(iter: Iter<T>, f: (x: T) => boolean) {
    super(iter);
    this.#iter = iter;
    this.#f = f;
  }

  [Symbol.iterator](): Iterator<T> {
    return {
      next: () => {
        const value = this.#iter.find(this.#f);
        if (value) {
          return { value, done: false };
        }

        return { value: undefined, done: true };
      },
    };
  }
}
