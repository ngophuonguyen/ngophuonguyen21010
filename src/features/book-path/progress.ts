import type { BookUnit } from "../../content/book-path/units.ts";
import { words } from "../curriculum/quality.ts";
export type BookUnitProgress = {
  revision: string;
  sources: string[];
  answers: (number | null)[];
  checked: boolean[];
  response: string;
  reviewed: boolean;
  completed: boolean;
};
export function unitRevision(unit: BookUnit) {
  let h = 2166136261;
  for (const c of JSON.stringify(unit)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
export function freshUnit(unit: BookUnit): BookUnitProgress {
  return {
    revision: unitRevision(unit),
    sources: [],
    answers: unit.questions.map(() => null),
    checked: unit.questions.map(() => false),
    response: "",
    reviewed: false,
    completed: false,
  };
}
export const sourceKey = (source: BookUnit["sources"][number]) =>
  `${source.bookId}:${source.guideId}`;
export function unitReady(unit: BookUnit, p: BookUnitProgress) {
  return (
    p.revision === unitRevision(unit) &&
    unit.sources
      .filter((s) => s.primary)
      .every((s) => p.sources.includes(sourceKey(s))) &&
    words(p.response) >= 30 &&
    p.reviewed &&
    p.checked.length === unit.questions.length &&
    p.checked.every(Boolean) &&
    p.answers.length === unit.questions.length &&
    p.answers.every((a, i) => a === unit.questions[i].answer)
  );
}
export function hydrateUnits(raw: string | null, units: BookUnit[]) {
  const result: Record<string, BookUnitProgress> = {};
  try {
    const parsed = JSON.parse(raw ?? "{}");
    for (const u of units) {
      const v = parsed?.[u.id];
      if (!v || typeof v !== "object") continue;
      const p = freshUnit(u);
      p.response =
        typeof v.response === "string" ? v.response.slice(0, 5000) : "";
      if (v.revision === p.revision) {
        p.sources = u.sources
          .map(sourceKey)
          .filter((id) => Array.isArray(v.sources) && v.sources.includes(id));
        p.answers = u.questions.map((q, i) =>
          Number.isInteger(v.answers?.[i]) &&
          v.answers[i] >= 0 &&
          v.answers[i] < q.options.length
            ? v.answers[i]
            : null,
        );
        p.checked = u.questions.map(
          (_, i) => v.checked?.[i] === true && p.answers[i] !== null,
        );
        p.reviewed = v.reviewed === true;
        p.completed = v.completed === true && unitReady(u, p);
      }
      result[u.id] = p;
    }
  } catch {}
  return result;
}
