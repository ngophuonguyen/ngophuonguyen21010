import { lessons } from "../../content/curriculum";
import { bookUnits } from "../../content/book-path/units";
import { useBookPath } from "../book-path/BookPathProgress";
import { curriculumAudit, useCurriculum } from "./CurriculumProgress";
export function CurriculumPlan({
  onOpen,
  track,
  onTrack,
}: {
  onOpen: (day: number) => void;
  track?: "book";
  onTrack: (track?: "book") => void;
}) {
  const c = useCurriculum(),
    b = useBookPath();
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">
          30 CONNECTED DAYS · CORE + BOOK PRACTICE
        </span>
        <h1>
          {track === "book"
            ? "Your books. One connected pathway"
            : "One month. A clearer voice"}
          <span>.</span>
        </h1>
        <p>
          {track === "book"
            ? "Thirty original transfer units link inspected Aspekte B2 modules, grammar references and your B1 exam resources to each course day. The sequence follows your course goals rather than the textbook's chapter order."
            : "Each core day keeps its independent tasks and saved progress. Choose Book-linked practice for its source pages, new examples, explained checks and your own transfer response."}
        </p>
      </div>
      <div
        className="lesson-tracks"
        role="tablist"
        aria-label="Course pathways"
      >
        <button
          className={`button ${!track ? "primary" : "secondary"}`}
          role="tab"
          aria-selected={!track}
          onClick={() => onTrack(undefined)}
        >
          Core course · 30 min/day
        </button>
        <button
          className={`button ${track === "book" ? "primary" : "secondary"}`}
          role="tab"
          aria-selected={track === "book"}
          onClick={() => onTrack("book")}
        >
          Book-linked practice · 10–15 min/day
        </button>
      </div>
      <div className="notice">
        <strong>
          Core course: {c.completed.length}/30 complete · Book-linked practice:{" "}
          {b.completed.length}/30 complete
        </strong>
        <p>
          New book units never reset core answers or completion. Book progress
          requires source review, two correct checked answers and a reviewed
          30-word response. These are personal study records, not official exam
          scores.
        </p>
        <p>
          {curriculumAudit.valid
            ? "Core data check passed: 30 of 30 lessons complete and distinct."
            : "Curriculum validation failed. Core completion is disabled."}
        </p>
        {curriculumAudit.errors.map((e) => (
          <p key={e}>{e}</p>
        ))}
      </div>
      <div className="plan-grid">
        {lessons.map((l, i) => {
          const unit = bookUnits[i];
          return (
            <button
              key={l.id}
              className="card day-card"
              onClick={() => onOpen(l.day)}
              aria-label={`Open day ${l.day}: ${l.title}`}
            >
              <span className="eyebrow">
                DAY {String(l.day).padStart(2, "0")} ·{" "}
                {track === "book"
                  ? "B1 → B2 · BOOK PRACTICE"
                  : `${l.level} · 30 MIN`}
              </span>
              <h3>{l.title}</h3>
              <p>{track === "book" ? unit.focus : l.grammar.focus}</p>
              {track === "book" && (
                <p className="micro">
                  {unit.sources[0].label} · PDF p. {unit.sources[0].page}
                </p>
              )}
              <small>
                {track === "book"
                  ? b.completed.includes(l.day)
                    ? "Book practice completed"
                    : b.units[unit.id]
                      ? "Continue book practice"
                      : "Open book practice"
                  : c.completed.includes(l.day)
                    ? "Core lesson completed"
                    : "Open core lesson"}
              </small>
            </button>
          );
        })}
      </div>
    </>
  );
}
