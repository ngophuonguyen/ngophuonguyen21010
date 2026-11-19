import { useBookPath } from "../book-path/BookPathProgress";
import { lessons } from "../../content/curriculum";
import { useCurriculum } from "../curriculum/CurriculumProgress";
import { schedule } from "../curriculum/types";
import { hasWork, nextStudyDay } from "./navigation";
export default function StudyHome({
  last,
  onDay,
  onCourse,
  onBooks,
  onBookPath,
}: {
  last: number;
  onDay: (day: number) => void;
  onCourse: () => void;
  onBooks: () => void;
  onBookPath: () => void;
}) {
  const b = useBookPath();
  const c = useCurriculum(),
    day = nextStudyDay(lessons, c.days, last),
    lesson = lessons[day - 1],
    p = c.days[lesson.id];
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">YOUR DAILY PATH · B1–B2</span>
        <h1>
          One lesson. A clear next step<span>.</span>
        </h1>
        <p>
          Study today’s lesson, check your answers, then return to review. Your
          books now have a linked practice pathway alongside it.
        </p>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="pill">
            DAY {day} OF 30 · {lesson.level} · 30 MINUTES
          </span>
          <h2>{lesson.title}</h2>
          <p>{lesson.grammar.focus}</p>
          <button className="button primary" onClick={() => onDay(day)}>
            {c.completed.length === 30
              ? "Revisit day 30"
              : hasWork(p)
                ? `Resume day ${day}`
                : `Start day ${day}`}
          </button>
          <small>
            {c.completed.length}/30 days complete · Drafts saved on this device
          </small>
        </div>
        <div
          className="hero-image"
          role="img"
          aria-label="A pink-lit planet against a dark star field"
        />
      </section>
      <section className="card journey-outline">
        <span className="eyebrow">INSIDE THIS LESSON</span>
        <h2>Everything stays in the same day.</h2>
        <ol>
          {schedule.map(([id, min]) => (
            <li key={id}>
              <strong>
                {id === "quiz"
                  ? "Check & explain"
                  : id[0].toUpperCase() + id.slice(1)}
              </strong>
              <span>{min} min</span>
            </li>
          ))}
        </ol>
        <p>
          Each section has its own task. Completion requires your responses and
          checked answers; opening a page alone does not complete it.
        </p>
        <button className="button secondary" onClick={onCourse}>
          View all 30 days
        </button>
      </section>
      <div className="book-notes-grid">
        <section className="card">
          <span className="eyebrow">BOOKS YOU SHARED</span>
          <h2>Study from a document.</h2>
          <p>
            Aspekte neu B2 now connects all 30 days to inspected modules and new
            transfer tasks. Two Goethe B1 sets and the Klett teacher’s guide
            provide additional skills practice.
          </p>
          <p>
            <strong>
              Book pathway: {b.completed.length}/30 units completed
            </strong>
          </p>
          <button className="button primary" onClick={onBookPath}>
            Open book-linked pathway
          </button>
          <button className="button secondary" onClick={onBooks}>
            Open my library
          </button>
          <p className="micro">
            Core lessons stay intact. The new book pathway adds original
            practice mapped to your sources. PDF copies are imported locally;
            recordings are separate.
          </p>
        </section>
        <section className="card">
          <span className="eyebrow">HOW TO USE THIS SPACE</span>
          <h2>Today → Lesson → Review</h2>
          <p>
            <strong>Today</strong> resumes your course.{" "}
            <strong>30-day course</strong> lets you choose a day.{" "}
            <strong>Review my lessons</strong> returns to your answers and
            drafts.
          </p>
          <p>
            <strong>My library</strong> is for book study.{" "}
            <strong>Practice tools</strong> contains the four-step vocabulary
            studio, three-pass listening, interactive reading and other optional
            exercises. Their progress stays separate from course completion.
          </p>
        </section>
      </div>
    </>
  );
}
