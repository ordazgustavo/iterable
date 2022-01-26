import { assert, assertEquals } from "std/testing/asserts.ts";
import { bench, runBenchmarks } from "std/testing/bench.ts";

import { Iter } from "../mod.ts";
import { double, isEven } from "./test-utils.ts";

Deno.test({
  name: "Iterates with for-of",
  fn: () => {
    const iter = new Iter([1, 2, 3, 4, 5]);
    let acc = 0;

    for (const item of iter) {
      acc += item;
    }

    assertEquals(acc, 15);
  },
});

Deno.test({
  name: "Collects iterator into array",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(base, iter.collect());
  },
});

Deno.test({
  name: "Finds an item in the collection",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(3, iter.find((item) => item === 3));
  },
});

Deno.test({
  name: "Find benchmark",
  fn: async () => {
    const length = 1_000;
    const data = Array.from({ length }).map((_, i) => i);
    const iter = new Iter(data);
    const last = (item: number) => item === length - 1;

    bench({
      name: "Iter.prototype.find",
      func: (b) => {
        b.start();
        iter.find(last);
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "Array.prototype.find",
      func: (b) => {
        b.start();
        data.find(last);
        b.stop();
      },
      runs: 10_000,
    });
    const { results } = await runBenchmarks();
    const [first, second] = results;
    assert(first.measuredRunsAvgMs < second.measuredRunsAvgMs);
  },
});

Deno.test({
  name: "Fold items into an accumulator",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(15, iter.fold(0, (acc, item) => item + acc));
  },
});

Deno.test({
  name: "Fold items into an accumulator of different type",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals("12345", iter.fold("", (acc, item) => acc + item));
  },
});

Deno.test({
  name: "Fold can be chained",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(6, iter.filter(isEven).fold(0, (acc, item) => item + acc));
  },
});

Deno.test({
  name: "Fold benchmark",
  fn: async () => {
    const length = 1_000;
    const data = Array.from({ length }).map((_, i) => i);
    const iter = new Iter(data);

    bench({
      name: "Iter.prototype.fold",
      func: (b) => {
        b.start();
        iter.fold(0, (acc, item) => acc + item);
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "Array.prototype.reduce",
      func: (b) => {
        b.start();
        data.reduce((acc, item) => acc + item, 0);
        b.stop();
      },
      runs: 10_000,
    });
    const { results } = await runBenchmarks();
    const [first, second] = results;
    assert(first.measuredRunsAvgMs < second.measuredRunsAvgMs);
  },
});

Deno.test({
  name: "Reduce items into an accumulator",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(15, iter.reduce((acc, item) => acc + item));
  },
});

Deno.test({
  name: "Reduce can be chained",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(6, iter.filter(isEven).reduce((acc, item) => item + acc));
  },
});

Deno.test({
  name: "Reduce benchmark",
  fn: async () => {
    const length = 1_000;
    const data = Array.from({ length }).map((_, i) => i);
    const iter = new Iter(data);

    bench({
      name: "Iter.prototype.reduce",
      func: (b) => {
        b.start();
        iter.reduce((acc, item) => acc + item);
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "Array.prototype.reduce",
      func: (b) => {
        b.start();
        data.reduce((acc, item) => acc + item, 0);
        b.stop();
      },
      runs: 10_000,
    });
    const { results } = await runBenchmarks();
    const [first, second] = results;
    assert(first.measuredRunsAvgMs < second.measuredRunsAvgMs);
  },
});

Deno.test({
  name: "Take n values from a collection",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals([1, 2, 3], Array.from(iter.take(3)));
  },
});

Deno.test({
  name: "Take all values if n > length",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals([1, 2, 3, 4, 5], Array.from(iter.take(6)));
  },
});

Deno.test({
  name: "Filter map collection into another collection",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const doubleEvens = (item: number) => item % 2 === 0 ? item * 2 : undefined;

    assertEquals(
      [4, 8],
      new Iter(base).filterMap(doubleEvens).collect(),
    );
    assertEquals(
      base.filter(isEven).map(double),
      Array.from(new Iter(base).filterMap(doubleEvens)),
    );
    assertEquals(
      new Iter(base).filter(isEven).map(double).collect(),
      Array.from(new Iter(base).filterMap(doubleEvens)),
    );
  },
});

Deno.test({
  name: "Filter map benchmark",
  fn: async () => {
    const length = 1_000;
    const data = Array.from({ length }).map((_, i) => i);
    const doubleEvens = (item: number) => item % 2 === 0 ? item * 2 : undefined;

    bench({
      name: "Iter.prototype.filterMap",
      func: (b) => {
        b.start();
        new Iter(data).filterMap(doubleEvens).collect();
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "Array.prototype.reduce",
      func: (b) => {
        b.start();
        data.reduce<number[]>((acc, curr) => {
          if (curr % 2 === 0) acc.push(curr);
          return acc;
        }, []);
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "Array.prototype.filter + Array.prototype.map",
      func: (b) => {
        b.start();
        data.filter(isEven).map(double);
        b.stop();
      },
      runs: 10_000,
    });
    const { results } = await runBenchmarks();
    const [first, second, third] = results;
    assert(
      first.measuredRunsAvgMs < second.measuredRunsAvgMs &&
        first.measuredRunsAvgMs < third.measuredRunsAvgMs,
    );
  },
});
