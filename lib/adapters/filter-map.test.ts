import { assert, assertEquals } from "std/testing/asserts.ts";
import { bench, runBenchmarks } from "std/testing/bench.ts";

import { Iter } from "../../mod.ts";
import { double, isEven } from "../test-utils.ts";

Deno.test({
  name: "Filter map collection into another collection",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const doubleEvens = (item: number) => item % 2 === 0 ? item * 2 : undefined;

    const result = [4, 8];

    assertEquals(
      result,
      new Iter(base).filterMap(doubleEvens).collect(),
    );
    assertEquals(
      result,
      new Iter(base).filterMap(doubleEvens).collect(),
    );
    assertEquals(
      result,
      new Iter(base).filterMap(doubleEvens).collect(),
    );
    assertEquals(
      result,
      base.reduce<number[]>((acc, curr) => {
        if (curr % 2 === 0) acc.push(curr * 2);
        return acc;
      }, []),
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
      name: "FilterMap: Iter.prototype.filterMap",
      func: (b) => {
        b.start();
        new Iter(data).filterMap(doubleEvens).collect();
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "FilterMap: Array.prototype.reduce",
      func: (b) => {
        b.start();
        data.reduce<number[]>((acc, curr) => {
          if (curr % 2 === 0) acc.push(curr * 2);
          return acc;
        }, []);
        b.stop();
      },
      runs: 10_000,
    });

    bench({
      name: "FilterMap: Array.prototype.filter + Array.prototype.map",
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
      first.measuredRunsAvgMs < second.measuredRunsAvgMs,
      "Array.prototype.reduce is faster",
    );
    assert(
      first.measuredRunsAvgMs < third.measuredRunsAvgMs,
      "Array.prototype.filter + Array.prototype.map is faster",
    );
  },
});
