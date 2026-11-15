export type Guide = {
  id: string;
  label: string;
  page: number;
  review?: boolean;
  task: string;
};
export type Book = {
  id: string;
  title: string;
  subtitle: string;
  pages: number;
  fileName: string;
  sha256: string;
  source: string;
  edition: string;
  guides: Guide[];
};
const goetheGuides: Guide[] = [
  {
    id: "reading",
    label: "Reading tasks",
    page: 8,
    task: "Read the task before the text. Choose an answer, then record the sentence that supports it.",
  },
  {
    id: "listening",
    label: "Listening tasks",
    page: 18,
    task: "Use the matching publisher audio. Answer before opening the transcript; a PDF alone does not contain the recording.",
  },
  {
    id: "teil4",
    label: "Listening Teil 4",
    page: 21,
    task: "Make a speaker grid: moderator, guest A, guest B. Record each opinion and one paraphrase that identifies its speaker.",
  },
  {
    id: "writing",
    label: "Writing tasks",
    page: 24,
    task: "Draft your response first. Check every content point, the form of address, connectors, and verb position.",
  },
  {
    id: "speaking",
    label: "Speaking tasks",
    page: 26,
    task: "Plan with keywords. Speak aloud, support your opinion with an example, and ask a follow-up question.",
  },
  {
    id: "reading-key",
    label: "Reading answer key",
    page: 31,
    review: true,
    task: "Compare only after attempting the tasks. Record why your distractor was wrong.",
  },
  {
    id: "listening-key",
    label: "Listening answer key",
    page: 33,
    review: true,
    task: "Check your answers, then replay the exact point that distinguishes the speakers.",
  },
  {
    id: "transcripts",
    label: "Listening transcripts",
    page: 35,
    review: true,
    task: "Highlight paraphrases after listening. Keep an unknown-word list of at most seven items.",
  },
  {
    id: "teil4-script",
    label: "Teil 4 transcript",
    page: 38,
    review: true,
    task: "Trace each statement back to its speaker. Notice agreement, contrast, hesitation, and changes of opinion.",
  },
  {
    id: "writing-rubric",
    label: "Writing criteria",
    page: 43,
    review: true,
    task: "Use the published criteria for self-review. This app does not assign an official exam score.",
  },
  {
    id: "speaking-rubric",
    label: "Speaking criteria",
    page: 47,
    review: true,
    task: "Reflect on task completion, interaction, vocabulary, structures and pronunciation without inventing an examiner score.",
  },
];
export const books: Book[] = [
  {
    id: "goethe-adults",
    title: "Goethe-Zertifikat B1",
    subtitle: "Adult practice set",
    pages: 49,
    fileName: "Goethe-Zertifikat B1 Übungssatz Erwachsene.pdf",
    sha256: "d209142000008ffdc8d3764f13494ef0f7899160b16c368236347a7d4f4bbdcb",
    source: "https://www.goethe.de/de/spr/prf/ueb/pb1.html",
    edition: "Supplied 49-page adult practice PDF; publisher imprint 2016.",
    guides: goetheGuides,
  },
  {
    id: "goethe-youth",
    title: "Goethe-Zertifikat B1",
    subtitle: "Youth practice set",
    pages: 49,
    fileName: "Goethe-Zertifikat B1 Übungssatz Jugendliche.pdf",
    sha256: "49030fb407e87d35b8836cc1a604e26972e12a5a8a855cdc2fb9db36c6d41451",
    source: "https://www.goethe.de/de/spr/prf/ueb/pb1.html",
    edition: "Supplied 49-page youth practice PDF; revised January 2018.",
    guides: goetheGuides,
  },
  {
    id: "klett-teacher",
    title: "So geht’s noch besser",
    subtitle: "Goethe-/ÖSD-Zertifikat B1 · teacher’s guide",
    pages: 76,
    fileName: "SGnbzZD_TBMP3_LHB_web.pdf",
    sha256: "b84ef14b05ada715b70fbfe86cfb053b4816b408ad9d3d4df1c85f53b2f773e6",
    source:
      "https://www.klett-sprachen.de/so-geht-s-zum-goethe-oesd-zertifikat/r-258/220",
    edition:
      "Supplied Klett Hellas teacher’s guide, 76 PDF pages; ISBN 978-960-6891-73-1. Other editions may differ.",
    guides: [
      {
        id: "method",
        label: "How the modules work",
        page: 5,
        task: "Review task formats and timing. This is a teacher’s guide, not the companion candidate test book.",
      },
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `key-${i + 1}`,
        label: `Model test ${i + 1} · answers`,
        page: i === 0 ? 8 : 14 + (i - 1) * 2,
        review: true,
        task: "Use with the matching test book and edition. Attempt the tasks before reviewing this answer key.",
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `script-${i + 1}`,
        label: `Model test ${i + 1} · transcript`,
        page: 32 + i * 4,
        review: true,
        task: "Use the matching publisher track for this model test. Do not substitute a synthetic reading for native listening.",
      })),
      {
        id: "speaker-grid",
        label: "Model test 1 · Teil 4",
        page: 35,
        review: true,
        task: "After two listening attempts, inspect the speaker labels and mark the evidence for each answer.",
      },
    ],
  },
];
export const identifyBook = (sha: string) =>
  books.find((b) => b.sha256 === sha);
export const clampPage = (value: number, total: number) =>
  Math.max(1, Math.min(total, Number.isFinite(value) ? Math.floor(value) : 1));
export type BookProgress = { page: number; notes: string; completed: string[] };
export function readBookProgress(
  raw: string | null,
): Record<string, BookProgress> {
  try {
    const data = JSON.parse(raw ?? "{}");
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const out: Record<string, BookProgress> = {};
    for (const b of books) {
      const p = data[b.id];
      if (!p || typeof p !== "object") continue;
      out[b.id] = {
        page: clampPage(p.page, b.pages),
        notes: typeof p.notes === "string" ? p.notes.slice(0, 6000) : "",
        completed: Array.isArray(p.completed)
          ? ([
              ...new Set(
                p.completed.filter(
                  (id: unknown) =>
                    typeof id === "string" && b.guides.some((g) => g.id === id),
                ),
              ),
            ] as string[])
          : [],
      };
    }
    return out;
  } catch {
    return {};
  }
}
export function textLines(items: unknown[]): string[] {
  const lines: string[] = [];
  let line = "";
  for (const value of items) {
    if (
      !value ||
      typeof value !== "object" ||
      !("str" in value) ||
      typeof value.str !== "string"
    )
      continue;
    line += (line && !line.endsWith(" ") ? " " : "") + value.str;
    if ("hasEOL" in value && value.hasEOL) {
      if (line.trim()) lines.push(line.trim());
      line = "";
    }
    if (lines.length >= 800) break;
  }
  if (line.trim()) lines.push(line.trim());
  return lines.map((s) => s.slice(0, 3000));
}
