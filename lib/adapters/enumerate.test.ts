import { assert, assertEquals } from "std/testing/asserts.ts";
import { bench, runBenchmarks } from "std/testing/bench.ts";

import { Iter } from "../../mod.ts";

const enumerate = (item: number, i: number) => [i, item] as const;
const double = (x: number) => x * 2;

Deno.test({
  name: "Enumerate collection values",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(
      base.map(enumerate),
      Array.from(iter.enumerate()),
    );
  },
});

Deno.test({
  name: "Enumerate can be chained",
  fn: () => {
    const base = [1, 2, 3, 4, 5];

    assertEquals(
      base.map(double).map(enumerate),
      Array.from(new Iter(base).map(double).enumerate()),
    );
    assertEquals(
      base.map(enumerate).map(([i, item]) => [i, double(item)]),
      Array.from(
        new Iter(base).enumerate().map(([i, item]) => [i, double(item)]),
      ),
    );
  },
});

Deno.test({
  name: "Enumerate benchmark",
  fn: async () => {
    const length = 1_000;
    const data = Array.from({ length }).map((_, i) => i);
    const iter = new Iter(data);

    bench({
      name: "Iter.prototype.enumerate",
      func: (b) => {
        b.start();
        iter.enumerate().collect();
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "Array.prototype.map",
      func: (b) => {
        b.start();
        data.map(enumerate);
        b.stop();
      },
      runs: 10_000,
    });
    const { results } = await runBenchmarks();
    const [first, second] = results;
    assert(first.measuredRunsAvgMs < second.measuredRunsAvgMs);
  },
});
