import { assert, assertEquals } from "std/testing/asserts.ts";
import { bench, runBenchmarks } from "std/testing/bench.ts";

import { Iter } from "../../mod.ts";
import { double, isEven } from "../test-utils.ts";

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
      base.map(double).map(double).filter(isEven),
      Array.from(new Iter(base).map(double).map(double).filter(isEven)),
    );
    assertEquals(
      base.filter(isEven).map(double),
      Array.from(new Iter(base).filter(isEven).map(double)),
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
      name: "Map: Iter.prototype.map",
      func: (b) => {
        b.start();
        iter.map(double).collect();
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "Map: Array.prototype.map",
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
