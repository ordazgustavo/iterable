import { assertEquals } from "std/testing/asserts.ts";

import { Iter } from "../../mod.ts";

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
