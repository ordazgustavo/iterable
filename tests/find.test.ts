import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

import { Iter } from "../main.ts";

Deno.test({
  name: "Finds an item in the collection",
  fn: () => {
    const base = [1, 2, 3, 4, 5];
    const iter = new Iter(base);

    assertEquals(3, iter.find((item) => item === 3));
  },
});
