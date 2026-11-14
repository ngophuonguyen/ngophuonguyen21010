import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validItem,
  readItems,
  legacyItems,
  selected,
} from "../src/progress.ts";
test("legacy progress migration filters invalid indices and removes duplicates", () => {
  const result = legacyItems([1, 1, 30, 31, "bad"], [0, 7, 8, -1]);
  assert.deepEqual(selected(result, "day"), ["1", "30"]);
  assert.deepEqual(selected(result, "word"), ["0", "7"]);
});
test("corrupt storage and malformed records cannot break hydration", () => {
  assert.deepEqual(readItems("{invalid"), {});
  assert.deepEqual(
    readItems(
      JSON.stringify({
        a: {
          category: "attempt",
          item_id: "x",
          value: { score: 10, total: 5, day: 1, at: "date" },
        },
      }),
    ),
    {},
  );
  assert.equal(
    validItem({
      category: "listening",
      item_id: "javascript:evil",
      value: true,
    }),
    false,
  );
});
test("explicit false records retain the ability to unmark progress after sync", () => {
  const rows = readItems(
    JSON.stringify({ old: { category: "word", item_id: "2", value: false } }),
  );
  assert.equal(rows["word:2"].value, false);
  assert.deepEqual(selected(rows, "word"), []);
});
test("quiz attempts retain day, score and timestamp", () => {
  assert.equal(
    validItem({
      category: "attempt",
      item_id: "abc",
      value: { score: 3, total: 5, day: 30, at: new Date().toISOString() },
    }),
    true,
  );
  assert.equal(
    validItem({
      category: "attempt",
      item_id: "abc",
      value: { score: -1, total: 5, day: 30, at: "date" },
    }),
    false,
  );
});
