import {
  vocabulary,
  hasTarget,
  wordCount,
  normalize,
} from "../content/course.ts";
export type Feedback = {
  corrected: string;
  grammar: number;
  naturalness: number;
  notes: string[];
};
export type RecordState = {
  introduced: boolean;
  response: string;
  produced: boolean;
  review: "self" | "ai" | null;
  feedback: Feedback | null;
  guess: string;
  solved: boolean;
  nativeSource?: string;
};
export type BatchState = {
  version: 1;
  records: RecordState[];
  paragraph: string;
  completed: boolean;
  visualReview: "self" | "ai" | null;
  visualFeedback: Feedback | null;
};
export const freshBatch = (): BatchState => ({
  version: 1,
  records: Array.from({ length: 6 }, () => ({
    introduced: false,
    response: "",
    produced: false,
    review: null,
    feedback: null,
    guess: "",
    solved: false,
  })),
  paragraph: "",
  completed: false,
  visualReview: null,
  visualFeedback: null,
});
export function validFeedback(x: unknown): x is Feedback {
  if (!x || typeof x !== "object") return false;
  const f = x as Feedback;
  return (
    typeof f.corrected === "string" &&
    f.corrected.length <= 5000 &&
    [f.grammar, f.naturalness].every(
      (n) => Number.isFinite(n) && n >= 0 && n <= 5,
    ) &&
    Array.isArray(f.notes) &&
    f.notes.length <= 8 &&
    f.notes.every((s) => typeof s === "string" && s.length <= 1000)
  );
}
export function validBatch(x: unknown): x is BatchState {
  if (!x || typeof x !== "object") return false;
  const b = x as BatchState;
  if (
    b.version !== 1 ||
    !Array.isArray(b.records) ||
    b.records.length !== 6 ||
    typeof b.paragraph !== "string" ||
    b.paragraph.length > 5000 ||
    typeof b.completed !== "boolean" ||
    ![null, "self", "ai"].includes(b.visualReview) ||
    !(b.visualFeedback === null || validFeedback(b.visualFeedback))
  )
    return false;
  let locked = false;
  for (const [index, r] of b.records.entries()) {
    if (
      !r ||
      typeof r.introduced !== "boolean" ||
      typeof r.produced !== "boolean" ||
      typeof r.solved !== "boolean" ||
      typeof r.response !== "string" ||
      r.response.length > 1500 ||
      typeof r.guess !== "string" ||
      r.guess.length > 100 ||
      ![null, "self", "ai"].includes(r.review) ||
      !(r.feedback === null || validFeedback(r.feedback))
    )
      return false;
    if (locked && (r.introduced || r.produced || r.solved)) return false;
    if (
      r.produced &&
      (!r.introduced ||
        !r.review ||
        !hasTarget(r.response, vocabulary[index]) ||
        wordCount(r.response) < 5)
    )
      return false;
    if (
      r.solved &&
      (!r.produced ||
        typeof r.nativeSource !== "string" ||
        !r.nativeSource.trim() ||
        r.nativeSource.length > 200)
    )
      return false;
    if (r.produced && r.review === "ai" && !validFeedback(r.feedback))
      return false;
    if (
      r.solved &&
      !vocabulary[index].forms.some(
        (f) =>
          normalize(f) === normalize(r.guess.replace(/^(der|die|das)\s+/i, "")),
      )
    )
      return false;
    if (!r.solved) locked = true;
  }
  return (
    !b.completed ||
    (b.records.every((r) => r.solved) &&
      !!b.visualReview &&
      visualEligible(b.paragraph) &&
      (b.visualReview !== "ai" || validFeedback(b.visualFeedback)))
  );
}
export function phase(b: BatchState) {
  const index = b.records.findIndex((r) => !r.solved);
  if (index < 0) return { index: 5, step: 4 };
  const r = b.records[index];
  return { index, step: r.produced ? 3 : r.introduced ? 2 : 1 };
}

export function visualEligible(text: string) {
  return (
    vocabulary.every((w) => hasTarget(text, w)) &&
    wordCount(text) >= 60 &&
    wordCount(text) <= 180 &&
    (/am ball/i.test(text) || /unter einen hut/i.test(text))
  );
}
