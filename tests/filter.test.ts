import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

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
