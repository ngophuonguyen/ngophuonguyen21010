import "fake-indexeddb/auto";
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classifyPage,
  indexMaterial,
  listMaterials,
  addMaterial,
  transferPractice,
} from "../src/features/books/materials.ts";
import { lessons } from "../src/content/curriculum/index.ts";
const pdf = {
  numPages: 2,
  getPage: async (n: number) => ({
    getTextContent: async () => ({
      items: [
        {
          str:
            n === 1
              ? "Arbeit und Beruf: Schreiben. Wenn ich Zeit hätte, würde ich lernen."
              : "Hören: Die Nachbarn treffen sich im Garten.",
          hasEOL: true,
        },
      ],
    }),
  }),
};
test("PDF indexing persists across reads, adds without overwriting, isolates accounts and preserves lessons", async () => {
  const snapshot = JSON.stringify(lessons),
    file = Object.assign(new Blob(["%PDF-test"]), { name: "B2-work.pdf" }),
    signal = new AbortController().signal,
    scope = "test-library";
  let updates = 0;
  const one = await indexMaterial(
    pdf,
    file,
    "a".repeat(64),
    scope,
    "B2",
    () => updates++,
    signal,
  );
  assert.equal(updates, 2);
  assert.ok(one.pages[0].topics.includes("work"));
  assert.ok(one.pages[0].grammar.includes("Konjunktiv II"));
  assert.equal(one.level, "B2");
  assert.equal((await listMaterials(scope)).length, 1);
  await addMaterial({ ...one, name: "must-not-replace.pdf" });
  assert.equal((await listMaterials(scope))[0].name, "B2-work.pdf");
  await indexMaterial(pdf, file, "b".repeat(64), scope, "B1", () => {}, signal);
  assert.equal((await listMaterials(scope)).length, 2);
  assert.equal((await listMaterials("another-account")).length, 0);
  assert.equal(JSON.stringify(lessons), snapshot);
});
test("cancelled extraction never saves a partial new document", async () => {
  const abort = new AbortController();
  abort.abort();
  const file = Object.assign(new Blob(["%PDF"]), { name: "cancel.pdf" });
  await assert.rejects(
    indexMaterial(
      pdf,
      file,
      "c".repeat(64),
      "cancelled",
      "B1",
      () => {},
      abort.signal,
    ),
    { name: "AbortError" },
  );
  assert.equal((await listMaterials("cancelled")).length, 0);
});
test("classification labels candidate patterns and transfer practice uses original examples", () => {
  const p = classifyPage(
    "Je öfter ich übe, desto sicherer werde ich. Hören und Schreiben.",
    1,
  );
  assert.ok(p.grammar.includes("Comparative pairs"));
  assert.ok(p.skills.includes("listening"));
  const practice = transferPractice({ ...p, grammar: ["Comparative pairs"] });
  assert.equal(practice.options[practice.answer], "werde");
  assert.ok(practice.prompt.includes("Do not copy"));
  assert.notEqual(practice.example, p.text);
});
