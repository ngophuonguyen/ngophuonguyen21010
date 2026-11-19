import test from "node:test";
import assert from "node:assert/strict";
import { createElement, type ReactElement } from "react";
import {
  translate,
  hasVietnamese,
  readLanguage,
} from "../src/features/language/translate.ts";
import { localizeTree } from "../src/features/language/tree.ts";
import { bookAnswerLanguage } from "../src/features/language/answers.ts";
import { lessons } from "../src/content/curriculum/index.ts";
import { bookUnits } from "../src/content/book-path/units.ts";
import { vocabulary, passages, idioms } from "../src/content/course.ts";
import { nativeLessons } from "../src/content/vi/course.ts";
import { nativeBookUnits } from "../src/content/vi/books.ts";
for (const [i, l] of lessons.entries())
  test(`Vietnamese study support covers core and book day ${l.day}`, () => {
    const u = bookUnits[i];
    const fields = [
      l.title,
      l.grammar.focus,
      l.grammar.explanation,
      l.grammar.translation,
      l.reading.summary,
      l.listening.task,
      l.speaking.support,
      l.writing.checklist,
      l.speaking.prompt,
      l.writing.prompt,
      ...l.quiz.map((q) => q.explanation),
      ...l.vocabulary.flatMap((v) => [v.meaning, v.translation]),
      u.focus,
      u.connection,
      u.insight,
      u.translation,
      u.checklist,
      u.production,
      ...u.questions.flatMap((q) => [q.prompt, q.explanation]),
      ...u.phrases.map((p) => p.split(" · ")[1]),
    ];
    for (const s of fields) {
      assert.ok(hasVietnamese(s), `Missing day ${l.day}: ${s}`);
      assert.notEqual(translate(s, "vi"), s);
      assert.equal(translate(s, "en"), s);
    }
    assert.equal(nativeLessons[i][4].length, l.vocabulary.length);
    assert.equal(nativeLessons[i][9].length, l.quiz.length);
  });
test("all sixty source-linked units remain present with the original German exercises", () => {
  assert.equal(nativeLessons.length, 30);
  assert.equal(nativeBookUnits.length, 30);
  const before = JSON.stringify({ lessons, bookUnits });
  for (const l of lessons)
    for (const s of [
      l.grammar.explanation,
      l.speaking.prompt,
      l.writing.prompt,
    ])
      translate(s, "vi");
  assert.equal(JSON.stringify({ lessons, bookUnits }), before);
});
test("legacy vocabulary examples, reading translations and grammar insights have Vietnamese support", () => {
  for (const s of [
    ...vocabulary.flatMap((w) => [
      w.meaning,
      w.scenario,
      ...w.examples.map((e) => e.en),
    ]),
    ...passages.flatMap((p) => [
      ...p.sentences.map((s) => s.en),
      ...p.insights.map((g) => g.explanation),
    ]),
    ...idioms.map((i) => i.en),
  ])
    assert.ok(hasVietnamese(s), s);
});
test("support-language preference defaults safely to Vietnamese", () => {
  assert.equal(readLanguage(null), "vi");
  assert.equal(readLanguage("vi"), "vi");
  assert.equal(readLanguage("en"), "en");
  assert.equal(readLanguage("<script>"), "vi");
});
test("German answer choices are never translated even when their spelling matches an English word", () => {
  const original = createElement(
    "div",
    { lang: "de" },
    createElement("button", { key: "answer", value: "hat" }, "hat"),
    createElement("span", { key: "pronoun" }, "I"),
  );
  const vi = localizeTree(original, "vi") as ReactElement<any>;
  assert.equal(vi.props.children[0].props.children, "hat");
  assert.equal(vi.props.children[1].props.children, "I");
  assert.equal(vi.props.children[0].key, original.props.children[0].key);
  assert.equal(vi.props.children[1].key, original.props.children[1].key);
  assert.equal(localizeTree(original, "en"), original);
});
test("translation retains input values, handlers, source identifiers and implicit select values", () => {
  const change = () => {};
  const input = createElement("input", {
    value: "hat",
    id: "german-response",
    onChange: change,
    placeholder: "Your German response",
  });
  const vi = localizeTree(input, "vi") as ReactElement<any>;
  assert.equal(vi.props.value, "hat");
  assert.equal(vi.props.id, "german-response");
  assert.equal(vi.props.onChange, change);
  assert.equal(vi.props.placeholder, "Bài làm tiếng Đức của bạn");
  const option = localizeTree(
    createElement("option", {}, "All"),
    "vi",
  ) as ReactElement<any>;
  assert.equal(option.props.value, "All");
  assert.equal(option.props.children, "Tất cả");
});
test("German audio payloads stay German while their playback labels change", () => {
  function Player(_props: any) {
    return null;
  }
  const german = "Ich habe den Text gelesen.";
  const vi = localizeTree(
    createElement(Player, {
      text: german,
      label: "Play audio prompt",
      targets: ["Erfahrung"],
    }),
    "vi",
  ) as ReactElement<any>;
  assert.equal(vi.props.text, german);
  assert.deepEqual(vi.props.targets, ["Erfahrung"]);
  assert.equal(vi.props.label, "Nghe tình huống");
});
test("a translation can switch language within a German reading paragraph", () => {
  const node = createElement(
    "section",
    { lang: "de" },
    createElement("p", { key: "source" }, "hat"),
    createElement(
      "p",
      { key: "translation", lang: "en" },
      "I have experience organizing events.",
    ),
  );
  const vi = localizeTree(node, "vi") as ReactElement<any>;
  assert.equal(vi.props.children[0].props.children, "hat");
  assert.equal(vi.props.children[1].props.lang, "vi");
  assert.equal(
    vi.props.children[1].props.children,
    "Tôi có kinh nghiệm tổ chức sự kiện.",
  );
});
test("support-language questions change labels while German-form questions keep their choices", () => {
  assert.equal(bookAnswerLanguage(1, 0, 1), "de");
  assert.equal(bookAnswerLanguage(3, 0, 0), "de");
  assert.equal(bookAnswerLanguage(3, 0, 2), "en");
  assert.equal(bookAnswerLanguage(27, 1, 1), "en");
  assert.equal(
    translate(bookUnits[26].questions[1].options[1], "vi"),
    "Đã phân tích bản chép lời; phần nghe vẫn chưa làm",
  );
});
test("unknown and prototype-named strings have an honest unchanged fallback", () => {
  for (const s of [
    "constructor",
    "__proto__",
    "A newly imported sentence without a curated translation.",
  ])
    assert.equal(translate(s, "vi"), s);
  assert.equal(translate("  Today  ", "vi"), "  Hôm nay  ");
});
test("every curated reading-dictionary entry has a Vietnamese usage note", async () => {
  const { dictionary } = await import("../src/content/dictionary.ts");
  for (const e of Object.values(dictionary)) {
    assert.ok(hasVietnamese(e.note), e.note);
    assert.notEqual(translate(e.note, "vi"), e.note);
  }
});
test("mapped source cards and question arrays localise without flattening or rekeying their children", () => {
  const children = [
    createElement("h2", { key: "heading" }, "Your source for this task"),
    [
      createElement("article", { key: "source" }, "Open linked book page"),
      createElement("p", { key: "prompt" }, bookUnits[0].questions[0].prompt),
    ],
  ];
  const node = createElement("section", {}, ...children);
  const vi = localizeTree(node, "vi") as ReactElement<any>;
  assert.equal(
    vi.props.children[1][0].props.children,
    "Mở trang sách liên kết",
  );
  assert.equal(
    vi.props.children[1][1].props.children,
    "Câu nào đặt động từ ở vị trí thứ hai?",
  );
  assert.equal(vi.props.children[1][0].key, "source");
  assert.ok(Array.isArray(vi.props.children[1]));
});
