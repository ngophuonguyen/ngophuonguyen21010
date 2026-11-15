import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cleanTerm,
  wordAt,
  localEntry,
  parseDefinitions,
  plainText,
  dictionaryLinks,
  onlineEntry,
} from "../src/features/dictionary/lookup.ts";
test("German search preserves umlauts and expressions but rejects URLs and oversized input", () => {
  assert.equal(cleanTerm(" „Herausforderung!“ "), "Herausforderung");
  assert.equal(cleanTerm("sich entscheiden"), "sich entscheiden");
  assert.equal(cleanTerm("U\u0308berraschung"), "Überraschung");
  for (const value of ["https://evil.test", "<script>", "x".repeat(101), "123"])
    assert.equal(cleanTerm(value), "");
});
test("pointer word extraction respects punctuation, compounds and exact boundaries", () => {
  const s = "Ein B1–B2-Kurs, außerdem Spaß.";
  assert.equal(wordAt(s, s.indexOf("außerdem") + 3), "außerdem");
  assert.equal(wordAt("Deutsch-Kurs.", 8), "Deutsch-Kurs");
  assert.equal(wordAt("Wort.", 4), "");
});
test("curated entries resolve plurals and supplied reference vocabulary offline", () => {
  assert.equal(localEntry("Erfahrungen")?.meaning, "experience");
  assert.equal(localEntry("Sehnsucht")?.lemma, "die Sehnsucht");
  assert.match(localEntry("wahrnehmen")?.grammar ?? "", /Separable/);
  assert.equal(localEntry("inventedwordxyz"), undefined);
});
test("remote definitions display German senses only and never render remote HTML", () => {
  const rows = parseDefinitions({
    en: [{ definitions: [{ definition: "English only" }] }],
    de: [
      {
        partOfSpeech: "Noun",
        definitions: [
          {
            definition:
              "<b>longing</b> &amp; yearning<script>alert(1)</script>",
            examples: ["Ich habe <i>Sehnsucht</i>.", 42],
          },
          { definition: null },
        ],
      },
    ],
  });
  assert.deepEqual(rows, [
    {
      partOfSpeech: "Noun",
      definition: "longing & yearning",
      examples: ["Ich habe Sehnsucht."],
    },
  ]);
  assert.equal(parseDefinitions({ de: "bad" }).length, 0);
  assert.equal(parseDefinitions({ en: [] }).length, 0);
  assert.equal(plainText("&#xFC; &#252; &nbsp;"), "ü ü");
});
test("dictionary sources encode searches as path content", () => {
  for (const url of Object.values(dictionaryLinks("für/gegen?x=1"))) {
    const u = new URL(url);
    assert.equal(u.protocol, "https:");
    assert.ok(u.pathname.includes("%2F"));
    assert.equal(u.search, "");
  }
});
test("online lookup retries noun capitalization and caches German senses", async () => {
  const old = globalThis.fetch;
  const calls: string[] = [];
  globalThis.fetch = async (input) => {
    calls.push(String(input));
    return new Response(
      JSON.stringify(
        calls.length === 1
          ? { en: [] }
          : {
              de: [
                {
                  partOfSpeech: "Noun",
                  definitions: [{ definition: "a test entry" }],
                },
              ],
            },
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };
  try {
    const signal = new AbortController().signal;
    const rows = await onlineEntry("testwortqa", signal);
    assert.equal(rows[0].definition, "a test entry");
    assert.equal(calls.length, 2);
    assert.ok(calls[1].endsWith("/Testwortqa"));
    await onlineEntry("testwortqa", signal);
    assert.equal(calls.length, 2);
  } finally {
    globalThis.fetch = old;
  }
});

test("daily lesson vocabulary has an instant curated lookup and inherited keys are not entries", () => {
  assert.equal(localEntry("einhalten")?.meaning, "to keep; comply with");
  assert.equal(localEntry("constructor"), undefined);
});
