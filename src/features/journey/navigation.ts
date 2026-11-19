import { books, clampPage } from "../books/catalog.ts";
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
export type BookRequest = { bookId: string; guideId: string; page: number };
export type Location = {
  page: Page;
  day: number;
  from?: "books" | "practice" | "day";
  track?: "book";
  book?: BookRequest;
};
export function readLocation(search: string): Location {
  const p = new URLSearchParams(search),
    view = p.get("view"),
    n = Number(p.get("day"));
  const page = pages.includes(view as Page) ? (view as Page) : "home";
  const from = p.get("from");
  const book = books.find((b) => b.id === p.get("book"));
  const guide = book?.guides.find((g) => g.id === p.get("guide"));
  const requested = Number(p.get("bookPage"));
  return {
    page,
    day: Number.isInteger(n) && n >= 1 && n <= 30 ? n : 1,
    ...(from === "books" || from === "practice" || from === "day"
      ? { from }
      : {}),
    ...(p.get("track") === "book" ? { track: "book" as const } : {}),
    ...(page === "books" && book && guide
      ? {
          book: {
            bookId: book.id,
            guideId: guide.id,
            page: clampPage(
              Number.isInteger(requested) && requested > 0
                ? requested
                : guide.page,
              book.pages,
            ),
          },
        }
      : {}),
  };
}
export function locationUrl(current: string, location: Location) {
  const url = new URL(current);
  url.searchParams.set("view", location.page);
  url.searchParams.delete("day");
  url.searchParams.delete("from");
  for (const key of ["track", "book", "guide", "bookPage"])
    url.searchParams.delete(key);
  if (location.page === "day" || location.from === "day")
    url.searchParams.set("day", String(location.day));
  if (location.from) url.searchParams.set("from", location.from);
  if (location.track) url.searchParams.set("track", location.track);
  if (location.page === "books" && location.book) {
    url.searchParams.set("book", location.book.bookId);
    url.searchParams.set("guide", location.book.guideId);
    url.searchParams.set("bookPage", String(location.book.page));
  }
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
