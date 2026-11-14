export const DAY = 86_400_000;
export type Cue = {
  start: number;
  end: number;
  de: string;
  en: string;
  grammar?: string;
};
export type Lesson = {
  id: string;
  title: string;
  type: "narration" | "youtube" | "audio";
  cues: Cue[];
  videoId?: string;
  source: string;
  fileName?: string;
};
export type PassProgress = { pass: number; completed: number[]; notes: string };
export type ReviewState = { interval: number; due: number };
export type GameState = {
  version: 1;
  xp: number;
  lastReview: number;
  decayPeriods: number;
  lastPenalty: number;
  activities: Record<string, { xp: number; listeningSeconds: number }>;
  reviews: Record<string, ReviewState>;
  listening: Record<string, PassProgress>;
  rewarded: string[];
  reviewed: number;
  correct: number;
  listeningSeconds: number;
};
export const initialGame = (now = Date.now()): GameState => ({
  version: 1,
  xp: 0,
  lastReview: now,
  decayPeriods: 0,
  lastPenalty: 0,
  activities: {},
  reviews: {},
  listening: {},
  rewarded: [],
  reviewed: 0,
  correct: 0,
  listeningSeconds: 0,
});
export const emptyPass = (): PassProgress => ({
  pass: 0,
  completed: [],
  notes: "",
});
export const ranks = [
  { name: "Bronze", xp: 0 },
  { name: "Silver", xp: 500 },
  { name: "Gold", xp: 1500 },
  { name: "Platinum", xp: 3000 },
  { name: "Constellation", xp: 5000 },
];
export function getRank(xp: number) {
  const index = Math.max(
    0,
    ranks.reduce((index, r, i) => (xp >= r.xp ? i : index), 0),
  );
  return { current: ranks[index], next: ranks[index + 1] ?? null };
}
export function dateKey(now = Date.now()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(now));
}
export function streak(activities: GameState["activities"], now = Date.now()) {
  let count = 0,
    cursor = now;
  if (!activities[dateKey(cursor)]) cursor -= DAY;
  while (activities[dateKey(cursor)]) {
    count++;
    cursor -= DAY;
  }
  return count;
}
export function applyDecay(state: GameState, now: number): GameState {
  const periods = Math.max(0, Math.floor((now - state.lastReview) / DAY) - 1);
  if (periods <= state.decayPeriods) return state;
  const penalty = Math.min(state.xp, (periods - state.decayPeriods) * 50);
  return {
    ...state,
    xp: state.xp - penalty,
    decayPeriods: periods,
    lastPenalty: penalty,
  };
}
function activity(
  s: GameState,
  xp: number,
  seconds: number,
  now: number,
): GameState {
  const key = dateKey(now),
    old = s.activities[key] ?? { xp: 0, listeningSeconds: 0 };
  return {
    ...s,
    xp: s.xp + xp,
    listeningSeconds: s.listeningSeconds + seconds,
    activities: {
      ...s.activities,
      [key]: {
        xp: old.xp + xp,
        listeningSeconds: old.listeningSeconds + seconds,
      },
    },
  };
}
export function reviewWord(
  s: GameState,
  id: string,
  remembered: boolean,
  now: number,
): GameState {
  s = applyDecay(s, now);
  const old = s.reviews[id] ?? { interval: 0, due: 0 };
  if (old.due > now) return s;
  const interval = remembered
    ? old.interval === 0
      ? 1
      : Math.min(90, old.interval * 2 + 1)
    : 0;
  return activity(
    {
      ...s,
      lastReview: now,
      decayPeriods: 0,
      lastPenalty: 0,
      reviewed: s.reviewed + 1,
      correct: s.correct + Number(remembered),
      reviews: {
        ...s.reviews,
        [id]: { interval, due: now + (remembered ? interval * DAY : 600_000) },
      },
    },
    remembered ? 10 : 0,
    0,
    now,
  );
}
// Early recall protects rank without granting XP or changing the spaced schedule.
export function practiceWord(s: GameState, id: string, now: number): GameState {
  s = applyDecay(s, now);
  if (!s.reviews[id] || s.reviews[id].due <= now) return s;
  return activity(
    { ...s, lastReview: now, decayPeriods: 0, lastPenalty: 0 },
    0,
    0,
    now,
  );
}
export function canOpenPass(p: PassProgress, pass: number) {
  return (
    Number.isInteger(pass) &&
    pass >= 0 &&
    pass <= 2 &&
    Array.from({ length: pass }, (_, i) => i).every((i) =>
      p.completed.includes(i),
    )
  );
}
export function finishPass(
  s: GameState,
  lessonId: string,
  pass: number,
  heard: boolean,
  seconds: number,
  now: number,
): GameState {
  const p = s.listening[lessonId] ?? emptyPass();
  if (
    !heard ||
    p.completed.includes(pass) ||
    !canOpenPass(p, pass) ||
    !Number.isFinite(seconds) ||
    seconds <= 0 ||
    seconds > 7200
  )
    return s;
  const reward = pass === 2 && !s.rewarded.includes(lessonId);
  return activity(
    {
      ...applyDecay(s, now),
      listening: {
        ...s.listening,
        [lessonId]: {
          ...p,
          pass: Math.min(2, pass + 1),
          completed: [...p.completed, pass],
        },
      },
      rewarded: reward ? [...s.rewarded, lessonId] : s.rewarded,
    },
    reward ? 50 : 0,
    Math.round(seconds),
    now,
  );
}
export function getYouTubeId(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    const host = url.hostname.replace(/^www\./, "");
    let id = "";
    if (host === "youtu.be")
      id = url.pathname.split("/").filter(Boolean)[0] ?? "";
    else if (["youtube.com", "m.youtube.com"].includes(host))
      id =
        url.searchParams.get("v") ??
        (/^\/(embed|shorts)\//.test(url.pathname)
          ? url.pathname.split("/")[2]
          : "");
    return /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
function timestamp(value: string) {
  if (!/^(\d{2,}:)?[0-5]\d:[0-5]\d\.\d{3}$/.test(value)) return NaN;
  return value.split(":").reduce((n, v) => n * 60 + Number(v), 0);
}
export function parseVtt(input: string): Cue[] {
  if (
    input.length > 64000 ||
    !/^WEBVTT(?:[ \t].*)?(?:\r?\n|$)/.test(input.trimStart())
  )
    return [];
  const cues: Cue[] = [];
  for (const block of input.replace(/\r/g, "").split(/\n\s*\n/)) {
    const lines = block.trim().split("\n");
    if (/^(NOTE|STYLE|REGION)(\s|$)/.test(lines[0])) continue;
    const i = lines.findIndex((l) => l.includes("-->"));
    if (i < 0) continue;
    const pair = lines[i].split("-->");
    if (pair.length !== 2) return [];
    const start = timestamp(pair[0].trim()),
      end = timestamp(pair[1].trim().split(/\s+/)[0]);
    const [raw, ...english] = lines
      .slice(i + 1)
      .join(" ")
      .split("|");
    const de = raw.replace(/<[^>]*>/g, "").trim(),
      en = english
        .join("|")
        .replace(/<[^>]*>/g, "")
        .trim();
    if (
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      end <= start ||
      end > 7200 ||
      !de ||
      de.length > 1500 ||
      en.length > 2000
    )
      return [];
    cues.push({ start, end, de, en });
    if (cues.length > 200) return [];
  }
  cues.sort((a, b) => a.start - b.start);
  if (cues.some((c, i) => i > 0 && c.start < cues[i - 1].end)) return [];
  return cues;
}
export function lessonId(type: string, source: string, cues: Cue[]) {
  let hash = 2166136261;
  for (const char of `${type}:${source}:${JSON.stringify(cues)}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `${type}-${(hash >>> 0).toString(16)}`;
}
export function validLesson(x: unknown): x is Lesson {
  if (!x || typeof x !== "object") return false;
  const l = x as Lesson;
  return (
    typeof l.id === "string" &&
    /^[\w-]{1,100}$/.test(l.id) &&
    typeof l.title === "string" &&
    l.title.length <= 100 &&
    ["narration", "audio", "youtube"].includes(l.type) &&
    typeof l.source === "string" &&
    l.source.length <= 300 &&
    Array.isArray(l.cues) &&
    l.cues.length > 0 &&
    l.cues.length <= 200 &&
    l.cues.every(
      (c, i) =>
        c &&
        Number.isFinite(c.start) &&
        Number.isFinite(c.end) &&
        c.start >= 0 &&
        c.end > c.start &&
        c.end <= 7200 &&
        (!i || c.start >= l.cues[i - 1].end) &&
        typeof c.de === "string" &&
        c.de.length <= 1500 &&
        typeof c.en === "string" &&
        c.en.length <= 2000,
    ) &&
    ((l.type === "youtube" && /^[\w-]{11}$/.test(l.videoId ?? "")) ||
      l.type !== "youtube")
  );
}
export function readGame(raw: string | null, now = Date.now()): GameState {
  try {
    const s = JSON.parse(raw ?? "null") as GameState;
    if (
      !s ||
      s.version !== 1 ||
      ![
        s.xp,
        s.lastReview,
        s.decayPeriods,
        s.lastPenalty,
        s.reviewed,
        s.correct,
        s.listeningSeconds,
      ].every((n) => Number.isSafeInteger(n) && n >= 0) ||
      s.correct > s.reviewed ||
      s.xp > 1e9 ||
      s.lastReview > now + DAY ||
      !Array.isArray(s.rewarded) ||
      s.rewarded.length > 1000 ||
      s.rewarded.some((x) => typeof x !== "string") ||
      !s.activities ||
      !s.reviews ||
      !s.listening
    )
      throw Error();
    if (
      Object.entries(s.activities).some(
        ([key, a]) =>
          !/^\d{4}-\d{2}-\d{2}$/.test(key) ||
          !a ||
          ![a.xp, a.listeningSeconds].every(
            (n) => Number.isFinite(n) && n >= 0,
          ),
      )
    )
      throw Error();
    if (
      Object.values(s.reviews).some(
        (r) =>
          !r ||
          !Number.isInteger(r.interval) ||
          r.interval < 0 ||
          r.interval > 90 ||
          !Number.isFinite(r.due) ||
          r.due < 0,
      )
    )
      throw Error();
    if (
      Object.values(s.listening).some(
        (p) =>
          !p ||
          !canOpenPass({ ...p, completed: p.completed ?? [] }, p.pass) ||
          typeof p.notes !== "string" ||
          p.notes.length > 5000 ||
          !Array.isArray(p.completed) ||
          p.completed.some((v, i) => v !== i),
      )
    )
      throw Error();
    return applyDecay(s, now);
  } catch {
    return initialGame(now);
  }
}
export const formatTime = (n: number) =>
  `${Math.floor(Math.max(0, n) / 60)}:${String(Math.floor(Math.max(0, n) % 60)).padStart(2, "0")}`;
// Union played media ranges: seeking to the end cannot stand in for listening.
export function addRange(
  ranges: [number, number][],
  start: number,
  end: number,
): [number, number][] {
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
    return ranges;
  const sorted = [...ranges, [start, end] as [number, number]].sort(
    (a, b) => a[0] - b[0],
  );
  const out: [number, number][] = [];
  for (const r of sorted) {
    const last = out.at(-1);
    if (last && r[0] <= last[1] + 0.1) last[1] = Math.max(last[1], r[1]);
    else out.push([...r]);
  }
  return out;
}
export const coveredSeconds = (ranges: [number, number][]) =>
  ranges.reduce((n, r) => n + r[1] - r[0], 0);
