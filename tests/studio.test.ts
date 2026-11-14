import { test } from "node:test";
import assert from "node:assert/strict";
import {
  vocabulary,
  passages,
  hasTarget,
  normalize,
  wordCount,
} from "../src/content/course.ts";
import { lookup, tokens } from "../src/content/dictionary.ts";
import {
  freshBatch,
  validBatch,
  phase,
  validFeedback,
} from "../src/features/batchState.ts";
test("every batch contains six complete noun entries and four bilingual examples", () => {
  assert.equal(vocabulary.length, 6);
  for (const w of vocabulary) {
    assert.ok(["der", "die", "das"].includes(w.article));
    assert.ok(w.plural.startsWith("die "));
    assert.equal(w.examples.length, 4);
    assert.ok(w.collocations.length >= 2);
    assert.ok(w.examples.every((e) => e.de && e.en));
  }
});
test("every token in every reading passage and dialogue has a curated lookup", () => {
  const missing = new Set<string>();
  for (const p of passages)
    for (const s of p.sentences)
      for (const token of tokens(s.de))
        if (/\p{L}/u.test(token) && !lookup(token)) missing.add(token);
  assert.deepEqual([...missing], []);
});
test("word recognition accepts plural forms without substring false positives", () => {
  assert.equal(hasTarget("Wir haben zwei Vorschläge.", vocabulary[4]), true);
  assert.equal(
    hasTarget("Die Entscheidungshilfe ist gut.", vocabulary[1]),
    false,
  );
  assert.equal(normalize("  ERFAHRUNG. "), "erfahrung");
  assert.equal(wordCount("Ich hätte einen Vorschlag."), 4);
});
test("workflow advances only after introduction, production and native listening", () => {
  const b = freshBatch();
  assert.deepEqual(phase(b), { index: 0, step: 1 });
  b.records[0].introduced = true;
  assert.equal(phase(b).step, 2);
  b.records[0].response = "Ich habe Erfahrung mit Musik.";
  b.records[0].review = "self";
  b.records[0].produced = true;
  assert.equal(phase(b).step, 3);
  b.records[0].solved = true;
  b.records[0].guess = "Erfahrung";
  assert.equal(validBatch(b), false);
  b.records[0].nativeSource = "Course unit 1, track 3";
  assert.equal(validBatch(b), true);
  assert.deepEqual(phase(b), { index: 1, step: 1 });
});
test("corrupt or skipped progress cannot unlock the visual task", () => {
  const b = freshBatch();
  b.records[5].introduced = true;
  assert.equal(validBatch(b), false);
  const c = freshBatch();
  c.completed = true;
  assert.equal(validBatch(c), false);
  assert.equal(validBatch({}), false);
});
test("feedback bounds reject malformed model outputs", () => {
  assert.equal(
    validFeedback({
      corrected: "Ich hätte einen Vorschlag.",
      grammar: 4,
      naturalness: 4,
      notes: ["A natural polite suggestion."],
    }),
    true,
  );
  assert.equal(
    validFeedback({ corrected: "x", grammar: 100, naturalness: 4, notes: [] }),
    false,
  );
});

test("the visual application task unlocks only after all six native-context steps", () => {
  const b = freshBatch();
  for (const [i, r] of b.records.entries()) {
    r.introduced = true;
    r.response = `Heute sprechen wir über ${vocabulary[i].word} und weitere Themen.`;
    r.produced = true;
    r.review = "self";
    r.solved = true;
    r.guess = vocabulary[i].word;
    r.nativeSource = "Test fixture: native course context";
  }
  assert.equal(validBatch(b), true);
  assert.equal(phase(b).step, 4);
  b.paragraph = "Wir planen einen Musikabend.";
  b.visualReview = "self";
  b.completed = true;
  assert.equal(validBatch(b), false);
  b.paragraph =
    "Am Freitag planen wir einen Musikabend mit alten Freunden. Aus Erfahrung weiß ich, dass wir einen guten Zeitplan brauchen. Die größte Herausforderung besteht darin, Arbeit und Freizeit unter einen Hut zu bringen. Mein Vorschlag ist, dass jeder etwas zu essen mitbringt. Nach unserer Entscheidung nutzen wir die Gelegenheit, gemeinsam alte Lieder zu hören. So können wir uns in Ruhe unterhalten und einen schönen Abend verbringen.";
  assert.equal(validBatch(b), true);
});
