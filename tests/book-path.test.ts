import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { bookUnits } from "../src/content/book-path/units.ts";
import { aspekteModules } from "../src/content/book-path/aspekte.ts";
import { books } from "../src/features/books/catalog.ts";
import { auditBookUnits } from "../src/features/book-path/quality.ts";
import {
  freshUnit,
  hydrateUnits,
  sourceKey,
  unitReady,
  unitRevision,
} from "../src/features/book-path/progress.ts";
import { lessons } from "../src/content/curriculum/index.ts";
import { lessonRevision } from "../src/features/curriculum/quality.ts";
import {
  readLocation,
  locationUrl,
} from "../src/features/journey/navigation.ts";
import { MAX_PDF_BYTES } from "../src/features/books/limits.ts";
for (const unit of bookUnits)
  test(`book-linked day ${unit.day} has inspected sources and independent teaching data`, () => {
    assert.equal(unit.day, lessons[unit.day - 1].day);
    assert.ok(unit.insight.length > 60);
    assert.ok(unit.production.split(/\s+/).length >= 15);
    assert.equal(unit.questions.length, 2);
    assert.equal(unit.sources.filter((s) => s.primary).length, 1);
    for (const source of unit.sources) {
      const book = books.find((b) => b.id === source.bookId)!;
      assert.ok(book);
      assert.equal(
        book.guides.find((g) => g.id === source.guideId)?.page,
        source.page,
      );
    }
    assert.equal(new Set(unit.questions.map((q) => q.prompt)).size, 2);
  });
test("all thirty units cover all supplied books and all ten Aspekte chapters", () => {
  assert.deepEqual(auditBookUnits(bookUnits).errors, []);
  assert.equal(
    new Set(bookUnits.flatMap((u) => u.sources.map((s) => s.bookId))).size,
    4,
  );
  assert.equal(
    new Set(
      bookUnits.map(
        (u) =>
          aspekteModules.find((m) => m.id === u.sources[0].guideId)?.chapter,
      ),
    ).size,
    10,
  );
  const broken = structuredClone(bookUnits);
  broken[3].sources[0].page = 999;
  assert.equal(auditBookUnits(broken).valid, false);
  const duplicate = structuredClone(bookUnits);
  duplicate[29].production = duplicate[0].production;
  assert.equal(auditBookUnits(duplicate).valid, false);
});
const response =
  "In meiner Lerngruppe möchten wir die Aufgaben besser verteilen. Ich schlage vor, dass wir zuerst alle Termine sammeln und anschließend gemeinsam entscheiden. So können wir unsere Ziele klarer beschreiben und regelmäßig überprüfen.";
function complete(unit = bookUnits[0]) {
  const p = freshUnit(unit);
  p.sources = unit.sources.filter((s) => s.primary).map(sourceKey);
  p.answers = unit.questions.map((q) => q.answer);
  p.checked = [true, true];
  p.response = response;
  p.reviewed = true;
  return p;
}
test("book completion requires source evidence, correct checked answers and reviewed production", () => {
  const u = bookUnits[0];
  assert.equal(unitReady(u, freshUnit(u)), false);
  const p = complete();
  assert.equal(unitReady(u, p), true);
  for (const patch of [
    { sources: [] },
    { answers: [null, null] },
    { checked: [false, true] },
    { response: "Zu kurz." },
    { reviewed: false },
    { revision: "old" },
  ])
    assert.equal(unitReady(u, { ...p, ...patch }), false);
  assert.equal(
    hydrateUnits(
      JSON.stringify({ [u.id]: { ...p, completed: true } }),
      bookUnits,
    )[u.id].completed,
    true,
  );
});
test("stale book-unit content keeps the written draft while resetting obsolete completion evidence", () => {
  const u = bookUnits[0],
    p = { ...complete(), revision: "earlier", completed: true };
  const restored = hydrateUnits(JSON.stringify({ [u.id]: p }), bookUnits)[u.id];
  assert.equal(restored.response, response);
  assert.equal(restored.completed, false);
  assert.deepEqual(restored.answers, [null, null]);
  assert.equal(restored.revision, unitRevision(u));
  for (const raw of ["{broken", "null", "[]"])
    assert.deepEqual(hydrateUnits(raw, bookUnits), {});
});
test("all source links preserve the exact document, page, task and return lesson", () => {
  for (const u of bookUnits)
    for (const s of u.sources) {
      const loc = {
          page: "books" as const,
          day: u.day,
          from: "day" as const,
          track: "book" as const,
          book: { bookId: s.bookId, guideId: s.guideId, page: s.page },
        },
        url = new URL(
          locationUrl("https://example.com/app/?v=release", loc),
          "https://example.com",
        );
      assert.deepEqual(readLocation(url.search), loc);
    }
  const bad = readLocation(
    "?view=books&book=missing&guide=bad&bookPage=999&day=31&from=day",
  );
  assert.equal(bad.book, undefined);
  assert.equal(bad.day, 1);
});
test("adding the book pathway does not change any original lesson revision or invalidate its saved work", () => {
  const baseline = JSON.parse(
    readFileSync(
      new URL("../docs/curriculum-audit.json", import.meta.url),
      "utf8",
    ),
  );
  for (const l of lessons)
    assert.equal(
      lessonRevision(l),
      baseline.days.find((d: { day: number }) => d.day === l.day).revision,
    );
});
test("the supplied 167,802,821-byte B2 scan fits the reader's declared limit", () => {
  assert.ok(MAX_PDF_BYTES >= 167802821);
  assert.equal(books.find((b) => b.id === "aspekte-b2")?.pages, 202);
});
test("course-to-library requests preserve existing notes and completed book tasks", async () => {
  const { applyBookRequest } = await import(
    "../src/features/books/requests.ts"
  );
  const old = {
    "aspekte-b2": { page: 1, notes: "My earlier notes", completed: ["ch2-m1"] },
    "goethe-adults": { page: 24, notes: "B1 draft", completed: [] },
  };
  const next = applyBookRequest(old, {
    bookId: "aspekte-b2",
    guideId: "ch3-m1",
    page: 43,
  });
  assert.equal(next["aspekte-b2"].notes, "My earlier notes");
  assert.deepEqual(next["aspekte-b2"].completed, ["ch2-m1"]);
  assert.equal(next["aspekte-b2"].page, 43);
  assert.deepEqual(next["goethe-adults"], old["goethe-adults"]);
  assert.equal(old["aspekte-b2"].page, 1);
});
