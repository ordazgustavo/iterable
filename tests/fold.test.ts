import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { bench, runBenchmarks } from "https://deno.land/std/testing/bench.ts";

import { Iter } from "../main.ts";

import { isPair } from "./utils.ts";

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
      name: "Iter.fold",
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
