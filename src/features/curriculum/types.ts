export type Vocab = {
  term: string;
  meaning: string;
  grammar: string;
  example: string;
  translation: string;
};
export type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type Lesson = {
  day: number;
  id: string;
  title: string;
  level: "B1" | "B1–B2" | "B2";
  vocabulary: Vocab[];
  grammar: {
    focus: string;
    explanation: string;
    example: string;
    translation: string;
  };
  reading: { title: string; text: string; summary: string };
  listening: { script: string; task: string; source: string };
  speaking: { prompt: string; support: string };
  writing: { prompt: string; checklist: string };
  quiz: Question[];
};
export type RawLesson = [
  number,
  string,
  Lesson["level"],
  string[],
  [string, string, string, string],
  [string, string, string],
  [string, string],
  [string, string],
  [string, string],
  [string, string[], number, string][],
];
export function unpack(r: RawLesson): Lesson {
  return {
    day: r[0],
    id: `day-${String(r[0]).padStart(2, "0")}`,
    title: r[1],
    level: r[2],
    vocabulary: r[3].map((s) => {
      const [term, meaning, grammar, example, translation] = s.split("|");
      return { term, meaning, grammar, example, translation };
    }),
    grammar: {
      focus: r[4][0],
      explanation: r[4][1],
      example: r[4][2],
      translation: r[4][3],
    },
    reading: { title: r[5][0], text: r[5][1], summary: r[5][2] },
    listening: {
      script: r[6][0],
      task: r[6][1],
      source: "https://www.goethe.de/de/spr/prf/ueb/pb1.html",
    },
    speaking: { prompt: r[7][0], support: r[7][1] },
    writing: { prompt: r[8][0], checklist: r[8][1] },
    quiz: r[9].map((q) => ({
      question: q[0],
      options: q[1],
      answer: q[2],
      explanation: q[3],
    })),
  };
}
export const schedule = [
  ["vocabulary", 4],
  ["grammar", 4],
  ["reading", 6],
  ["listening", 5],
  ["speaking", 4],
  ["writing", 5],
  ["quiz", 2],
] as const;
