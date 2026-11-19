import type { Lesson } from "../curriculum/types.ts";
import type { DayProgress } from "../curriculum/progress.ts";
export const pages = [
  "home",
  "plan",
  "books",
  "review",
  "practice",
  "day",
  "vocabulary",
  "reading",
  "listening",
  "grammar",
  "leaderboard",
  "spaced",
  "resources",
] as const;
export type Page = (typeof pages)[number];
export type Location = { page: Page; day: number; from?: "books" | "practice" };
export function readLocation(search: string): Location {
  const p = new URLSearchParams(search),
    view = p.get("view"),
    n = Number(p.get("day"));
  const page = pages.includes(view as Page) ? (view as Page) : "home";
  const from = p.get("from");
  return {
    page,
    day: Number.isInteger(n) && n >= 1 && n <= 30 ? n : 1,
    ...(from === "books" || from === "practice" ? { from } : {}),
  };
}
export function locationUrl(current: string, location: Location) {
  const url = new URL(current);
  url.searchParams.set("view", location.page);
  url.searchParams.delete("day");
  url.searchParams.delete("from");
  if (location.page === "day")
    url.searchParams.set("day", String(location.day));
  if (location.from) url.searchParams.set("from", location.from);
  url.hash = "";
  return `${url.pathname}${url.search}`;
}
export function nextStudyDay(
  lessons: Lesson[],
  days: Record<string, DayProgress>,
  last: number,
) {
  const recent = lessons.find((l) => l.day === last);
  if (recent && !days[recent.id]?.completed) return recent.day;
  return lessons.find((l) => !days[l.id]?.completed)?.day ?? 30;
}
export function hasWork(p?: DayProgress) {
  return (
    !!p &&
    (p.seen.length > 0 ||
      !!p.speaking ||
      !!p.writing ||
      p.answers.some((a) => a !== null))
  );
}
