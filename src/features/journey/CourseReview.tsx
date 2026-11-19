import { Localized } from "../language/Language";
import { useBookPath } from "../book-path/BookPathProgress";
import { getBookUnit } from "../../content/book-path/units";
import { freshDay } from "../curriculum/progress";
import { lessons } from "../../content/curriculum";
import { useCurriculum } from "../curriculum/CurriculumProgress";
import { hasWork } from "./navigation";
export default function CourseReview({
  onDay,
  onCourse,
  onBookDay,
}: {
  onDay: (day: number) => void;
  onCourse: () => void;
  onBookDay: (day: number) => void;
}) {
  const b = useBookPath();
  const c = useCurriculum(),
    started = lessons.filter((l) => {
      const u = getBookUnit(l.day),
        p = u ? b.units[u.id] : undefined;
      return (
        hasWork(c.days[l.id]) ||
        (!!p &&
          (!!p.response ||
            p.sources.length > 0 ||
            p.answers.some((a) => a !== null)))
      );
    });
  return (
    <Localized>
      {
        <>
          <div className="page-heading">
            <span className="eyebrow">YOUR COURSE HISTORY</span>
            <h1>
              Review your own work<span>.</span>
            </h1>
            <p>
              Return to the same lesson, saved responses and explanations. This
              is your 30-day course history; optional studio flashcards remain
              in Practice tools.
            </p>
          </div>
          {!started.length && (
            <section className="card">
              <h2>Your review starts with a lesson.</h2>
              <p>
                Study a day and record an answer or a draft. It will appear here
                automatically.
              </p>
              <button className="button primary" onClick={onCourse}>
                Choose a study day
              </button>
            </section>
          )}
          <div className="plan-grid">
            {started.map((l) => {
              const p = c.days[l.id] ?? freshDay(l),
                mistakes = p.checked.filter(
                  (v, i) => v && p.answers[i] !== l.quiz[i].answer,
                ).length;
              return (
                <section className="card" key={l.id}>
                  <span className="eyebrow">
                    DAY {l.day} · {p.completed ? "COMPLETED" : "IN PROGRESS"}
                  </span>
                  <h2>{l.title}</h2>
                  <p>
                    {p.seen.length}/7 sections reviewed · {mistakes} checked
                    answers to revisit
                  </p>
                  <p>
                    Book-linked practice:{" "}
                    {b.completed.includes(l.day)
                      ? "completed"
                      : b.units[getBookUnit(l.day)!.id]
                        ? "in progress"
                        : "not started"}
                  </p>
                  <p className="micro">
                    Speaking draft: {p.speaking ? "saved" : "empty"} · Writing
                    draft: {p.writing ? "saved" : "empty"}
                  </p>
                  <button
                    className="button secondary"
                    onClick={() => onDay(l.day)}
                  >
                    Review day {l.day}
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => onBookDay(l.day)}
                  >
                    Review book practice for day {l.day}
                  </button>
                </section>
              );
            })}
          </div>
        </>
      }
    </Localized>
  );
}
