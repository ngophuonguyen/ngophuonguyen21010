import type { Lesson } from "./types.ts";
import { lessonRevision, words } from "./quality.ts";
export const sections = [
  "vocabulary",
  "grammar",
  "reading",
  "listening",
  "speaking",
  "writing",
  "quiz",
] as const;
export type DayProgress = {
  revision: string;
  seen: string[];
  answers: (number | null)[];
  checked: boolean[];
  speaking: string;
  writing: string;
  completed: boolean;
};
export function freshDay(l: Lesson): DayProgress {
  return {
    revision: lessonRevision(l),
    seen: [],
    answers: l.quiz.map(() => null),
    checked: l.quiz.map(() => false),
    speaking: "",
    writing: "",
    completed: false,
  };
}
export function readyToComplete(
  l: Lesson,
  p: DayProgress,
  auditValid: boolean,
) {
  return (
    auditValid &&
    p.revision === lessonRevision(l) &&
    sections.every((s) => p.seen.includes(s)) &&
    words(p.speaking) >= 12 &&
    words(p.writing) >= 40 &&
    p.checked.length === l.quiz.length &&
    p.checked.every(Boolean) &&
    p.answers.filter((a, i) => a === l.quiz[i]?.answer).length >= 2
  );
}
export function hydrateDays(
  raw: string | null,
  lessons: Lesson[],
  auditValid: boolean,
) {
  const out: Record<string, DayProgress> = {};
  try {
    const data = JSON.parse(raw ?? "{}");
    for (const l of lessons) {
      const x = data?.[l.id];
      if (!x || x.revision !== lessonRevision(l)) continue;
      const p = freshDay(l);
      p.seen = Array.isArray(x.seen)
        ? sections.filter((s) => x.seen.includes(s))
        : [];
      p.answers = l.quiz.map((q, i) =>
        Number.isInteger(x.answers?.[i]) &&
        x.answers[i] >= 0 &&
        x.answers[i] < q.options.length
          ? x.answers[i]
          : null,
      );
      p.checked = l.quiz.map(
        (_, i) => x.checked?.[i] === true && p.answers[i] !== null,
      );
      p.speaking =
        typeof x.speaking === "string" ? x.speaking.slice(0, 3000) : "";
      p.writing = typeof x.writing === "string" ? x.writing.slice(0, 5000) : "";
      p.completed = x.completed === true && readyToComplete(l, p, auditValid);
      out[l.id] = p;
    }
  } catch {}
  return out;
}
