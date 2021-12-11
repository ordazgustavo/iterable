import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { bench, runBenchmarks } from "https://deno.land/std/testing/bench.ts";

import { Iter } from "../main.ts";

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
      name: "Iter.find",
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
