import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

import { Iter } from "../main.ts";

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
