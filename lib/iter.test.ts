import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { bench, runBenchmarks } from "https://deno.land/std/testing/bench.ts";

import { Iter } from "../mod.ts";

const isPair = (x: number) => x % 2 === 0;
const double = (x: number) => x * 2;

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
  name: "Filters items from the collection",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals([2, 4], iter.filter(isPair).collect());
  },
});

Deno.test({
  name: "Filters can be chained",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(
      [4],
      iter.filter(isPair).filter((item) => item === 4).collect(),
    );
  },
});

Deno.test({
  name: "Filter benchmark",
  fn: async () => {
    const data = Array.from({ length: 1_000 }).map((_, i) => i);
    const iter = new Iter(data);

    bench({
      name: "Iter.prototype.filter",
      func: (b) => {
        b.start();
        iter.filter(isPair).collect();
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "Array.prototype.filter",
      func: (b) => {
        b.start();
        data.filter(isPair);
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

    assertEquals(6, iter.filter(isPair).fold(0, (acc, item) => item + acc));
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

    assertEquals(6, iter.filter(isPair).reduce((acc, item) => item + acc));
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
  name: "Map a collection into another",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(base.map(double), Array.from(iter.map(double)));
  },
});

Deno.test({
  name: "Map can be chained",
  fn: () => {
    const base = [1, 2, 3, 4, 5];

    assertEquals(
      base.map(double).map(double),
      Array.from(new Iter(base).map(double).map(double)),
    );
    assertEquals(
      base.map(double).map(double).filter(isPair),
      Array.from(new Iter(base).map(double).map(double).filter(isPair)),
    );
    assertEquals(
      base.filter(isPair).map(double),
      Array.from(new Iter(base).filter(isPair).map(double)),
    );
  },
});

Deno.test({
  name: "Map a collection into collection of another type",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(base.map(String), Array.from(iter.map(String)));
  },
});

Deno.test({
  name: "Map benchmark",
  fn: async () => {
    const length = 1_000;
    const data = Array.from({ length }).map((_, i) => i);
    const iter = new Iter(data);

    bench({
      name: "Iter.prototype.map",
      func: (b) => {
        b.start();
        iter.map(double).collect();
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "Array.prototype.map",
      func: (b) => {
        b.start();
        data.map(double);
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
    const doublePairs = (item: number) => item % 2 === 0 ? item * 2 : undefined;

    assertEquals(
      [4, 8],
      new Iter(base).filterMap(doublePairs).collect(),
    );
    assertEquals(
      base.filter(isPair).map(double),
      Array.from(new Iter(base).filterMap(doublePairs)),
    );
    assertEquals(
      new Iter(base).filter(isPair).map(double).collect(),
      Array.from(new Iter(base).filterMap(doublePairs)),
    );
  },
});

Deno.test({
  name: "Filter map benchmark",
  fn: async () => {
    const length = 1_000;
    const data = Array.from({ length }).map((_, i) => i);
    const doublePairs = (item: number) => item % 2 === 0 ? item * 2 : undefined;

    bench({
      name: "Iter.prototype.filterMap",
      func: (b) => {
        b.start();
        new Iter(data).filterMap(doublePairs).collect();
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
        data.filter(isPair).map(double);
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
