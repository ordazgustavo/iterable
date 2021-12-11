import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

import { Iter } from "../main.ts";

import { isPair } from "./utils.ts";

Deno.test({
  name: "Reduce items into an accumulator",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(15, iter.reduce((acc, item) => acc + item));
  },
});

Deno.test({
  name: "Reduce can be chained",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(6, iter.filter(isPair).reduce((acc, item) => item + acc));
  },
});
