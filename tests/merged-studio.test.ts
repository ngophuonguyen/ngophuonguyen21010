import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialGame,
  applyDecay,
  DAY,
  getRank,
  practiceWord,
  reviewWord,
  finishPass,
  emptyPass,
  canOpenPass,
  parseVtt,
  getYouTubeId,
  lessonId,
  readGame,
  addRange,
  coveredSeconds,
  dateKey,
  streak,
} from "../src/features/studio/model.ts";
const now = 1700000000000;
test("rank decay starts at 48 hours and never charges a period twice", () => {
  const s = { ...initialGame(now), xp: 200 };
  assert.equal(applyDecay(s, now + 2 * DAY - 1).xp, 200);
  const a = applyDecay(s, now + 2 * DAY);
  assert.equal(a.xp, 150);
  assert.equal(applyDecay(a, now + 2 * DAY).xp, 150);
  assert.equal(applyDecay(a, now + 3 * DAY).xp, 100);
  assert.equal(applyDecay(a, now + 100 * DAY).xp, 0);
});
test("clock rollback does not refund decay or charge it again", () => {
  const s = applyDecay({ ...initialGame(now), xp: 200 }, now + 4 * DAY);
  assert.equal(applyDecay(s, now + DAY).xp, s.xp);
  assert.equal(applyDecay(s, now + 4 * DAY).xp, s.xp);
});
test("due-word review earns XP once and resets the decay clock", () => {
  const s = reviewWord(
    { ...initialGame(now), xp: 100 },
    "erfahrung",
    true,
    now + 2 * DAY,
  );
  assert.equal(s.xp, 60);
  assert.equal(s.lastReview, now + 2 * DAY);
  assert.equal(s.reviews.erfahrung.interval, 1);
  assert.equal(reviewWord(s, "erfahrung", true, now + 2 * DAY), s);
  assert.equal(applyDecay(s, now + 3 * DAY).xp, 60);
});
test("forgotten words return after ten minutes without XP", () => {
  const s = reviewWord(initialGame(now), "word", false, now);
  assert.equal(s.xp, 0);
  assert.equal(s.reviews.word.due, now + 600000);
  assert.equal(s.reviewed, 1);
});
test("spaced intervals follow 1,3,7 days and cap at 90", () => {
  let s = initialGame(now),
    time = now;
  for (const expected of [1, 3, 7, 15, 31, 63, 90, 90]) {
    s = reviewWord(s, "word", true, time);
    assert.equal(s.reviews.word.interval, expected);
    time = s.reviews.word.due;
  }
});
test("three passes must complete in sequence and reward only once", () => {
  const s = initialGame(now);
  assert.equal(finishPass(s, "demo", 2, true, 10, now), s);
  assert.equal(finishPass(s, "demo", 0, false, 10, now), s);
  let next = s;
  for (let i = 0; i < 3; i++) next = finishPass(next, "demo", i, true, 10, now);
  assert.equal(next.xp, 50);
  assert.equal(next.listeningSeconds, 30);
  assert.deepEqual(next.listening.demo.completed, [0, 1, 2]);
  assert.equal(finishPass(next, "demo", 2, true, 10, now), next);
});
test("pass unlocks reject invalid indices and skipped completion", () => {
  assert.equal(canOpenPass(emptyPass(), 1), false);
  assert.equal(canOpenPass(emptyPass(), -1), false);
  assert.equal(canOpenPass(emptyPass(), 3), false);
  assert.equal(canOpenPass({ pass: 1, completed: [0], notes: "" }, 1), true);
});
test("coverage merges replayed intervals without crediting seeks", () => {
  let ranges: [number, number][] = [];
  ranges = addRange(ranges, 0, 2);
  ranges = addRange(ranges, 8, 10);
  assert.equal(coveredSeconds(ranges), 4);
  ranges = addRange(ranges, 1, 2);
  assert.equal(coveredSeconds(ranges), 4);
  ranges = addRange(ranges, 2, 8);
  assert.equal(coveredSeconds(ranges), 10);
});
test("YouTube import accepts supported HTTPS URLs and rejects lookalike hosts", () => {
  const id = "yv5ZHXAeN00";
  for (const url of [
    `https://www.youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}`,
    `https://youtube.com/shorts/${id}`,
  ])
    assert.equal(getYouTubeId(url), id);
  for (const url of [
    "https://youtube.com.evil.test/watch?v=" + id,
    "javascript:alert(1)",
    "http://youtu.be/" + id,
    "https://x:secret@youtu.be/" + id,
  ])
    assert.equal(getYouTubeId(url), null);
});
const vtt =
  "WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nGuten Morgen! | Good morning!\n\n00:00:05.000 --> 00:00:10.000\nWie geht es dir? | How are you?";
test("WebVTT import creates bilingual cues and rejects malformed timing", () => {
  const cues = parseVtt(vtt);
  assert.equal(cues.length, 2);
  assert.equal(cues[0].en, "Good morning!");
  assert.equal(parseVtt(vtt.replace("00:00:10.000", "00:00:04.000")).length, 0);
  assert.equal(parseVtt(vtt.replace("00:00:10.000", "00:99:10.000")).length, 0);
  assert.equal(parseVtt("not WebVTT").length, 0);
});
test("WebVTT text is treated as text and exact duplicate imports have stable IDs", () => {
  const a = parseVtt(vtt.replace("Guten Morgen!", "<b>Guten Morgen!</b>"));
  assert.equal(a[0].de, "Guten Morgen!");
  assert.equal(
    lessonId("youtube", "id", a),
    lessonId("youtube", "id", parseVtt(vtt)),
  );
});
test("stored progress validates cleanly and safely recovers from corrupt data", () => {
  const s = finishPass(initialGame(now), "demo", 0, true, 10, now);
  assert.deepEqual(readGame(JSON.stringify(s), now), s);
  assert.equal(readGame("{bad", now).xp, 0);
  assert.equal(readGame(JSON.stringify({ ...s, xp: -10 }), now).xp, 0);
  assert.equal(
    readGame(
      JSON.stringify({
        ...s,
        listening: { demo: { pass: 2, completed: [0], notes: "" } },
      }),
      now,
    ).xp,
    0,
  );
});
test("rank thresholds and Vietnam-day streaks are deterministic", () => {
  assert.equal(getRank(499).current.name, "Bronze");
  assert.equal(getRank(500).current.name, "Silver");
  assert.equal(getRank(5000).next, null);
  assert.equal(dateKey(Date.UTC(2026, 0, 1, 18)), "2026-01-02");
  assert.equal(
    streak(
      {
        [dateKey(now)]: { xp: 10, listeningSeconds: 0 },
        [dateKey(now - DAY)]: { xp: 10, listeningSeconds: 0 },
      },
      now,
    ),
    2,
  );
});

test("early recall protects rank without XP or rescheduling", () => {
  const s = reviewWord(initialGame(now), "word", true, now);
  const a = practiceWord(s, "word", now + 1000);
  assert.equal(a.xp, s.xp);
  assert.deepEqual(a.reviews, s.reviews);
  assert.equal(a.lastReview, now + 1000);
  assert.equal(a.reviewed, s.reviewed);
  assert.equal(practiceWord(s, "unknown", now + 1000), s);
});
