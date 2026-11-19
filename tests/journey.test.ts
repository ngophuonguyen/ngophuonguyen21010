import test from "node:test";
import assert from "node:assert/strict";
import {
  readLocation,
  locationUrl,
  nextStudyDay,
  hasWork,
  pages,
} from "../src/features/journey/navigation.ts";
import { lessons } from "../src/content/curriculum/index.ts";
import { freshDay } from "../src/features/curriculum/progress.ts";
test("all navigation destinations survive reload, including the exact course day", () => {
  for (const page of pages) {
    const route = { page, day: 17, from: "books" as const };
    const result = new URL(
      locationUrl("https://example.com/app/?v=build#daily-reading", route),
      "https://example.com",
    );
    assert.equal(result.searchParams.get("v"), "build");
    assert.equal(result.hash, "");
    assert.deepEqual(readLocation(result.search), {
      page,
      day: page === "day" ? 17 : 1,
      from: "books",
    });
  }
});
test("invalid pages and day numbers have safe destinations", () => {
  for (const day of ["0", "31", "1.5", "NaN", "-1"])
    assert.equal(readLocation(`?view=day&day=${day}`).day, 1);
  assert.deepEqual(readLocation("?view=missing&from=https://bad.example"), {
    page: "home",
    day: 1,
  });
});
test("resume retains an opened lesson and advances after its validated completion", () => {
  const p = freshDay(lessons[4]);
  assert.equal(nextStudyDay(lessons, {}, 5), 5);
  p.writing = "A saved draft";
  assert.equal(nextStudyDay(lessons, { [lessons[4].id]: p }, 5), 5);
  p.completed = true;
  assert.equal(nextStudyDay(lessons, { [lessons[4].id]: p }, 5), 1);
  const all = Object.fromEntries(
    lessons.map((l) => [l.id, { ...freshDay(l), completed: true }]),
  );
  assert.equal(nextStudyDay(lessons, all, 30), 30);
});
test("review lists actual student work rather than merely opened lessons", () => {
  assert.equal(hasWork(undefined), false);
  const p = freshDay(lessons[0]);
  assert.equal(hasWork(p), false);
  p.answers[0] = 0;
  assert.equal(hasWork(p), true);
  p.answers[0] = null;
  p.speaking = "My outline";
  assert.equal(hasWork(p), true);
});

test("book tasks and study/review context persist without crossing documents", async () => {
  const { readBookProgress } = await import("../src/features/books/catalog.ts");
  const result = readBookProgress(
    JSON.stringify({
      "goethe-adults": {
        page: 21,
        notes: "Adult notes",
        guide: "teil4",
        view: "study",
      },
      "goethe-youth": {
        page: 38,
        notes: "Youth notes",
        guide: "teil4-script",
        view: "review",
      },
      "klett-teacher": { guide: "invented", view: "invalid" },
    }),
  );
  assert.equal(result["goethe-adults"].guide, "teil4");
  assert.equal(result["goethe-youth"].view, "review");
  assert.equal(result["goethe-adults"].notes, "Adult notes");
  assert.equal(result["goethe-youth"].page, 38);
  assert.equal(result["klett-teacher"].guide, undefined);
  assert.equal(result["klett-teacher"].view, undefined);
});
