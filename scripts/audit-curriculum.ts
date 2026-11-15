import { lessons } from "../src/content/curriculum/index.ts";
import {
  auditLessons,
  lessonRevision,
  words,
} from "../src/features/curriculum/quality.ts";
const audit = auditLessons(lessons);
console.log(
  JSON.stringify(
    {
      ...audit,
      days: lessons.map((l) => ({
        day: l.day,
        title: l.title,
        revision: lessonRevision(l),
        vocabulary: l.vocabulary.length,
        readingWords: words(l.reading.text),
        listeningWords: words(l.listening.script),
        questions: l.quiz.length,
      })),
    },
    null,
    2,
  ),
);
if (!audit.valid) process.exitCode = 1;
