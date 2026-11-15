import { test } from "node:test";
import assert from "node:assert/strict";
import {
  books,
  identifyBook,
  clampPage,
  readBookProgress,
  textLines,
} from "../src/features/books/catalog.ts";
test("supplied editions have unique identities and every page guide stays inside its PDF", () => {
  assert.equal(books.length, 3);
  assert.equal(new Set(books.map((b) => b.sha256)).size, 3);
  for (const b of books) {
    assert.match(b.sha256, /^[a-f0-9]{64}$/);
    assert.equal(new URL(b.source).protocol, "https:");
    assert.equal(identifyBook(b.sha256)?.id, b.id);
    assert.equal(new Set(b.guides.map((g) => g.id)).size, b.guides.length);
    for (const g of b.guides) {
      assert.ok(g.page >= 1 && g.page <= b.pages);
      assert.ok(g.task.length > 20);
    }
  }
  assert.equal(identifyBook("unknown"), undefined);
});
test("teacher guide uses PDF page offsets and keeps solutions separate from study", () => {
  const b = books[2];
  assert.equal(b.guides.find((g) => g.id === "key-1")?.page, 8);
  assert.equal(b.guides.find((g) => g.id === "key-2")?.page, 14);
  assert.equal(b.guides.find((g) => g.id === "script-1")?.page, 32);
  assert.equal(b.guides.find((g) => g.id === "script-10")?.page, 68);
  assert.equal(b.guides.find((g) => g.id === "speaker-grid")?.page, 35);
  assert.ok(
    b.guides
      .filter((g) => g.id.startsWith("key-") || g.id.startsWith("script-"))
      .every((g) => g.review),
  );
});
test("book hydration ignores unknown records, bounds pages and notes, and deduplicates study records", () => {
  const result = readBookProgress(
    JSON.stringify({
      "goethe-adults": {
        page: 999,
        notes: "a".repeat(7000),
        completed: ["reading", "reading", "fake"],
      },
      evil: { page: 1 },
    }),
  );
  assert.deepEqual(Object.keys(result), ["goethe-adults"]);
  assert.equal(result["goethe-adults"].page, 49);
  assert.equal(result["goethe-adults"].notes.length, 6000);
  assert.deepEqual(result["goethe-adults"].completed, ["reading"]);
  for (const raw of ["{broken", "null", "[]"])
    assert.deepEqual(readBookProgress(raw), {});
  assert.equal(clampPage(NaN, 49), 1);
  assert.equal(clampPage(-8, 49), 1);
});
test("PDF text extraction preserves line endings and ignores marked-content objects", () => {
  assert.deepEqual(
    textLines([
      { str: "Guten" },
      { type: "beginMarkedContent" },
      { str: "Morgen!", hasEOL: true },
      { str: "Wie geht es dir?", hasEOL: true },
    ]),
    ["Guten Morgen!", "Wie geht es dir?"],
  );
  assert.deepEqual(textLines([null, 4, {}, { str: 42 }]), []);
});
