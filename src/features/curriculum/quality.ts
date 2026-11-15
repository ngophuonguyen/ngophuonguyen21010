import type { Lesson } from "./types.ts";
export const words = (s: string) =>
  s.trim().split(/\s+/).filter(Boolean).length;
const normalized = (s: string) =>
  s
    .normalize("NFC")
    .toLocaleLowerCase("de-DE")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
export function similarity(a: string, b: string) {
  const shingles = (s: string) => {
    const w = normalized(s).split(" ");
    return new Set(w.slice(0, -3).map((_, i) => w.slice(i, i + 4).join(" ")));
  };
  const x = shingles(a),
    y = shingles(b);
  if (!x.size || !y.size) return normalized(a) === normalized(b) ? 1 : 0;
  const shared = [...x].filter((v) => y.has(v)).length;
  return shared / (x.size + y.size - shared);
}
export function lessonRevision(l: Lesson) {
  let h = 2166136261;
  for (const c of JSON.stringify(l)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
export function auditLessons(all: Lesson[]) {
  const errors: string[] = [];
  const ids = new Set<string>(),
    days = new Set<number>();
  if (all.length !== 30)
    errors.push(`Expected 30 lessons, found ${all.length}.`);
  for (let d = 1; d <= 30; d++)
    if (!all.some((l) => l?.day === d)) errors.push(`Day ${d}: missing data.`);
  for (const l of all) {
    if (!l || typeof l !== "object") {
      errors.push("Missing lesson record.");
      continue;
    }
    const tag = `Day ${l.day}`;
    if (days.has(l.day) || ids.has(l.id))
      errors.push(`${tag}: duplicate identity.`);
    days.add(l.day);
    ids.add(l.id);
    if (
      l.day < 1 ||
      l.day > 30 ||
      !l.title ||
      !l.grammar?.focus ||
      !l.grammar?.example ||
      !l.grammar?.translation ||
      !l.grammar?.explanation
    )
      errors.push(`${tag}: missing identity or grammar.`);
    if (
      !Array.isArray(l.vocabulary) ||
      l.vocabulary.length < 4 ||
      l.vocabulary.some(
        (v) =>
          !v ||
          [v.term, v.meaning, v.grammar, v.example, v.translation].some(
            (s) => typeof s !== "string" || !s.trim(),
          ),
      )
    )
      errors.push(`${tag}: incomplete vocabulary.`);
    if (words(l.reading?.text ?? "") < 70 || !l.reading?.summary)
      errors.push(`${tag}: incomplete reading.`);
    if (
      words(l.listening?.script ?? "") < 35 ||
      !l.listening?.task ||
      !l.listening?.source?.startsWith("https://")
    )
      errors.push(`${tag}: incomplete listening.`);
    if (
      !l.speaking?.prompt ||
      !l.speaking?.support ||
      !l.writing?.prompt ||
      !l.writing?.checklist
    )
      errors.push(`${tag}: missing production task.`);
    if (
      !Array.isArray(l.quiz) ||
      l.quiz.length < 3 ||
      l.quiz.some(
        (q) =>
          !q ||
          !q.question ||
          !Array.isArray(q.options) ||
          q.options.length < 3 ||
          q.options.some((o) => !o) ||
          !Number.isInteger(q.answer) ||
          q.answer < 0 ||
          q.answer >= q.options.length ||
          !q.explanation,
      )
    )
      errors.push(`${tag}: invalid assessment.`);
  }
  for (let i = 0; i < all.length; i++)
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i],
        b = all[j];
      if (!a || !b) continue;
      for (const [kind, x, y] of [
        ["reading", a.reading?.text ?? "", b.reading?.text ?? ""],
        ["listening", a.listening?.script ?? "", b.listening?.script ?? ""],
        ["writing", a.writing?.prompt ?? "", b.writing?.prompt ?? ""],
        ["speaking", a.speaking?.prompt ?? "", b.speaking?.prompt ?? ""],
      ] as const)
        if (similarity(x, y) > 0.72)
          errors.push(
            `Days ${a.day}/${b.day}: duplicated or near-duplicated ${kind}.`,
          );
      if (
        a.grammar?.example &&
        b.grammar?.example &&
        normalized(a.grammar.example) === normalized(b.grammar.example)
      )
        errors.push(`Days ${a.day}/${b.day}: duplicated grammar example.`);
      if (JSON.stringify(a.quiz) === JSON.stringify(b.quiz))
        errors.push(`Days ${a.day}/${b.day}: shared quiz data.`);
    }
  return {
    checkedDays: all.length,
    errors,
    valid: all.length === 30 && errors.length === 0,
  };
}
