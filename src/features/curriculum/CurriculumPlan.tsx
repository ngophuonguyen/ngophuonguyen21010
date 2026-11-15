import { lessons } from "../../content/curriculum";
import { curriculumAudit, useCurriculum } from "./CurriculumProgress";
export function CurriculumPlan({ onOpen }: { onOpen: (day: number) => void }) {
  const c = useCurriculum();
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">30 DISTINCT LESSONS · 30 MINUTES A DAY</span>
        <h1>
          One month. A clearer voice<span>.</span>
        </h1>
        <p>
          Each day has its own vocabulary, grammar, reading, listening script,
          speaking, writing and explained questions.
        </p>
      </div>
      <div className="notice">
        <strong>
          {curriculumAudit.valid
            ? "Data check passed: 30 of 30 lessons complete and distinct."
            : "Curriculum validation failed. Completion is disabled."}
        </strong>
        <p>
          {c.completed.length}/30 study days completed. Older foundation-quiz
          marks remain separate. Progress here is self-recorded on this device,
          not an exam certificate.
        </p>
        {curriculumAudit.errors.map((e) => (
          <p key={e}>{e}</p>
        ))}
      </div>
      <div className="plan-grid">
        {lessons.map((l) => (
          <button
            key={l.id}
            className="card day-card"
            onClick={() => onOpen(l.day)}
            aria-label={`Open day ${l.day}: ${l.title}`}
          >
            <span className="eyebrow">
              DAY {String(l.day).padStart(2, "0")} · {l.level} · 30 MIN
            </span>
            <h3>{l.title}</h3>
            <p>{l.grammar.focus}</p>
            <small>
              {c.completed.includes(l.day)
                ? "Completed with all sections"
                : "Open this lesson"}
            </small>
          </button>
        ))}
      </div>
    </>
  );
}
