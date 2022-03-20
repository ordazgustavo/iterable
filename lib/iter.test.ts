import { assert, assertEquals } from "std/testing/asserts.ts";
import { bench, runBenchmarks } from "std/testing/bench.ts";

import { Iter } from "../mod.ts";
import { isEven } from "./test-utils.ts";

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
  name: "Finds and transform an item in the collection",
  fn: () => {
    const base = ["lol", "NaN", "2", "5"];
    const iter = new Iter(base);

    assertEquals(
      2,
      iter.findMap((item) => !isNaN(Number(item)) ? Number(item) : undefined),
    );
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
