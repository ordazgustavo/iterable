import { assert, assertEquals } from "std/testing/asserts.ts";
import { bench, runBenchmarks } from "std/testing/bench.ts";

import { Iter } from "../../mod.ts";

const isEven = (x: number) => x % 2 === 0;

Deno.test({
  name: "Filters items from the collection",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals([2, 4], iter.filter(isEven).collect());
  },
});

Deno.test({
  name: "Filters can be chained",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(
      [4],
      iter.filter(isEven).filter((item) => item === 4).collect(),
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
        iter.filter(isEven).collect();
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "Array.prototype.filter",
      func: (b) => {
        b.start();
        data.filter(isEven);
        b.stop();
      },
      runs: 10_000,
    });
    const { results } = await runBenchmarks();
    const [first, second] = results;
    assert(first.measuredRunsAvgMs < second.measuredRunsAvgMs);
  },
});
