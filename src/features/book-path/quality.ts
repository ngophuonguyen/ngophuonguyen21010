import type { BookUnit } from "../../content/book-path/units.ts";
import { books } from "../books/catalog.ts";
import { similarity } from "../curriculum/quality.ts";
export function auditBookUnits(units: BookUnit[]) {
  const errors: string[] = [];
  if (units.length !== 30) errors.push("Expected thirty book-linked units.");
  for (let day = 1; day <= 30; day++)
    if (!units.some((u) => u?.day === day))
      errors.push(`Day ${day}: missing book unit.`);
  const ids = new Set<string>(),
    days = new Set<number>();
  for (const u of units) {
    if (!u || ids.has(u.id) || days.has(u.day)) {
      errors.push("Missing or duplicate book-unit identity.");
      continue;
    }
    ids.add(u.id);
    days.add(u.day);
    if (
      !u.focus ||
      !u.connection ||
      !u.insight ||
      !u.example ||
      !u.translation ||
      !u.production ||
      !u.checklist ||
      u.phrases?.length < 2
    )
      errors.push(`Day ${u.day}: incomplete teaching content.`);
    if (
      !Array.isArray(u.sources) ||
      u.sources.filter((s) => s.primary).length !== 1
    )
      errors.push(`Day ${u.day}: one primary source is required.`);
    for (const s of u.sources ?? []) {
      const b = books.find((b) => b.id === s.bookId),
        g = b?.guides.find((g) => g.id === s.guideId);
      if (
        !b ||
        !g ||
        s.page !== g.page ||
        s.page < 1 ||
        s.page > b.pages ||
        !s.purpose
      )
        errors.push(`Day ${u.day}: invalid source ${s.bookId}/${s.guideId}.`);
      if (s.bookId === "aspekte-b2" && s.printedPage !== s.page - 1)
        errors.push(`Day ${u.day}: incorrect printed/PDF offset.`);
    }
    if (
      u.questions?.length !== 2 ||
      u.questions.some(
        (q) =>
          !q.prompt ||
          !q.explanation ||
          q.options.length < 3 ||
          !Number.isInteger(q.answer) ||
          q.answer < 0 ||
          q.answer >= q.options.length,
      )
    )
      errors.push(`Day ${u.day}: invalid explained questions.`);
  }
  for (let i = 0; i < units.length; i++)
    for (let j = i + 1; j < units.length; j++) {
      const a = units[i],
        b = units[j];
      if (!a || !b) continue;
      if (
        similarity(a.production ?? "", b.production ?? "") > 0.72 ||
        a.example === b.example ||
        JSON.stringify(a.questions) === JSON.stringify(b.questions)
      )
        errors.push(`Days ${a.day}/${b.day}: repeated book practice.`);
    }
  return { checkedDays: units.length, valid: errors.length === 0, errors };
}
