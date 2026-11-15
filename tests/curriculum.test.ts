import { test } from "node:test";
import assert from "node:assert/strict";
import { lessons, getLesson } from "../src/content/curriculum/index.ts";
import {
  auditLessons,
  similarity,
  lessonRevision,
} from "../src/features/curriculum/quality.ts";
import {
  freshDay,
  hydrateDays,
  readyToComplete,
  sections,
} from "../src/features/curriculum/progress.ts";
import { schedule } from "../src/features/curriculum/types.ts";
test("all thirty actual lesson records pass completeness and pairwise duplicate checks", () => {
  assert.deepEqual(auditLessons(lessons), {
    checkedDays: 30,
    errors: [],
    valid: true,
  });
  assert.equal(new Set(lessons.map((l) => lessonRevision(l))).size, 30);
  assert.equal(
    schedule.reduce((sum, [, n]) => sum + n, 0),
    30,
  );
});
for (const l of lessons)
  test(`day ${l.day}: independent navigation, seven sections, valid explained answers and completion gates`, () => {
    assert.equal(getLesson(l.day)?.id, l.id);
    assert.equal(l.vocabulary.length, 4);
    assert.equal(l.quiz.length, 3);
    assert.ok(
      l.quiz.every((q) => q.explanation.length > 30 && q.options[q.answer]),
    );
    const p = freshDay(l);
    assert.equal(readyToComplete(l, p, true), false);
    p.seen = [...sections];
    p.answers = l.quiz.map((q) => q.answer);
    p.checked = l.quiz.map(() => true);
    p.speaking =
      "Ich möchte meine Meinung mit einem konkreten Beispiel aus meinem Alltag ausführlich erklären.";
    p.writing = Array(45).fill("Lernen").join(" ");
    assert.equal(readyToComplete(l, p, true), true);
    assert.equal(readyToComplete(l, p, false), false);
    for (const section of sections)
      assert.equal(
        readyToComplete(
          l,
          { ...p, seen: p.seen.filter((s) => s !== section) },
          true,
        ),
        false,
      );
    assert.equal(
      readyToComplete(l, { ...p, checked: [false, false, false] }, true),
      false,
    );
  });
test("cosmetic title changes cannot hide duplicated lesson bodies", () => {
  const clone = structuredClone(lessons);
  clone[1] = {
    ...structuredClone(clone[0]),
    id: "day-02",
    day: 2,
    title: "A different title",
  };
  const result = auditLessons(clone);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("duplicated")));
  assert.ok(
    similarity(
      lessons[0].reading.text,
      lessons[0].reading.text.replace("Mira", "Lina"),
    ) > 0.72,
  );
});
test("missing day and missing section data are detected without crashing", () => {
  assert.equal(auditLessons(lessons.slice(0, 29)).valid, false);
  const bad = structuredClone(lessons);
  bad[4].reading = { title: "", text: "", summary: "" };
  assert.ok(
    auditLessons(bad).errors.some((e) =>
      e.includes("Day 5: incomplete reading"),
    ),
  );
  assert.equal(getLesson(0), undefined);
  assert.equal(getLesson(31), undefined);
});
test("stale content and forged completion flags do not hydrate as completed", () => {
  const l = lessons[0],
    p = freshDay(l);
  assert.equal(
    hydrateDays(
      JSON.stringify({ [l.id]: { ...p, completed: true } }),
      lessons,
      true,
    )[l.id].completed,
    false,
  );
  assert.deepEqual(
    hydrateDays(
      JSON.stringify({ [l.id]: { ...p, revision: "stale", completed: true } }),
      lessons,
      true,
    ),
    {},
  );
  assert.deepEqual(hydrateDays("{bad", lessons, true), {});
});

test("missing vocabulary fields and missing whole records fail audit safely", () => {
  const broken = structuredClone(lessons);
  delete (
    broken[0].vocabulary[0] as Partial<(typeof broken)[0]["vocabulary"][0]>
  ).meaning;
  assert.equal(auditLessons(broken).valid, false);
  const hole = [...lessons];
  hole[3] = null as unknown as (typeof hole)[0];
  assert.equal(auditLessons(hole).valid, false);
});
