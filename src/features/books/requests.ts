import { books, clampPage, type BookProgress } from "./catalog.ts";
import type { BookRequest } from "../journey/navigation.ts";
export function applyBookRequest(
  progress: Record<string, BookProgress>,
  request?: BookRequest,
) {
  if (!request) return progress;
  const book = books.find((b) => b.id === request.bookId),
    guide = book?.guides.find((g) => g.id === request.guideId);
  if (!book || !guide) return progress;
  return {
    ...progress,
    [book.id]: {
      ...(progress[book.id] ?? { page: 1, notes: "", completed: [] }),
      page: clampPage(request.page, book.pages),
      guide: guide.id,
      view: guide.review ? ("review" as const) : ("study" as const),
    },
  };
}
