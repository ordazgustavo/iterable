import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { bench, runBenchmarks } from "https://deno.land/std/testing/bench.ts";

import { Iter } from "../main.ts";

import { isPair } from "./utils.ts";

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
      name: "FilterIter",
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
