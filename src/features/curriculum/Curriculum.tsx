import BookUnitPanel from "../book-path/BookUnitPanel";
import type { BookLink } from "../../content/book-path/units";
import { useState } from "react";
import { lessons, getLesson } from "../../content/curriculum";
import { GermanText } from "../dictionary/Dictionary";
import { ListenButton } from "../Speech";
import { curriculumAudit, useCurriculum } from "./CurriculumProgress";
import { freshDay, readyToComplete, sections } from "./progress";
import { schedule } from "./types";
export default function DailyLesson({
  day,
  onOpen,
  onPlan,
  track,
  onTrack,
  onBook,
}: {
  day: number;
  onOpen: (day: number) => void;
  onPlan: () => void;
  track?: "book";
  onTrack: (track?: "book") => void;
  onBook: (source: BookLink) => void;
}) {
  const l = getLesson(day),
    c = useCurriculum(),
    [translation, setTranslation] = useState(false),
    [script, setScript] = useState(false);
  if (!l)
    return (
      <section className="card">
        <h1>Lesson unavailable.</h1>
        <button className="button primary" onClick={onPlan}>
          Back to learning plan
        </button>
      </section>
    );
  const p = c.days[l.id] ?? freshDay(l),
    edit = (patch: Parameters<typeof c.edit>[1]) => c.edit(day, patch),
    check = (id: string) => (
      <label className="daily-check">
        <input
          type="checkbox"
          checked={p.seen.includes(id)}
          onChange={(e) =>
            edit({
              seen: e.target.checked
                ? [...new Set([...p.seen, id])]
                : p.seen.filter((x) => x !== id),
            })
          }
        />
        {id === "listening"
          ? "I completed the listening task · self-recorded"
          : `I reviewed the ${id} section`}
      </label>
    );
  const ready = readyToComplete(l, p, curriculumAudit.valid);
  return (
    <>
      <div className="daily-navigation">
        <button
          className="button secondary"
          disabled={day === 1}
          onClick={() => onOpen(day - 1)}
        >
          Previous day
        </button>
        <button className="button subtle" onClick={onPlan}>
          All 30 days
        </button>
        <button
          className="button secondary"
          disabled={day === 30}
          onClick={() => onOpen(day + 1)}
        >
          Next day
        </button>
      </div>
      <div className="page-heading">
        <span className="eyebrow">
          DAY {day} · {l.level} · ORIGINAL LESSON
        </span>
        <h1>
          {l.title}
          <span>.</span>
        </h1>
        <p>{l.grammar.focus}</p>
      </div>
      <div
        className="lesson-tracks"
        role="tablist"
        aria-label="Lesson pathways"
      >
        <button
          className={`button ${!track ? "primary" : "secondary"}`}
          role="tab"
          aria-selected={!track}
          onClick={() => onTrack(undefined)}
        >
          Core lesson · 30 min
        </button>
        <button
          className={`button ${track === "book" ? "primary" : "secondary"}`}
          role="tab"
          aria-selected={track === "book"}
          onClick={() => onTrack("book")}
        >
          Book-linked practice · 10–15 min
        </button>
      </div>
      {track === "book" ? (
        <BookUnitPanel day={day} onBook={onBook} />
      ) : (
        <>
          <div className="daily-timing">
            {schedule.map(([id, n]) => (
              <a key={id} href={`#daily-${id}`}>
                {id} · {n} min
              </a>
            ))}
          </div>
          {c.error && (
            <p className="notice" role="alert">
              {c.error}
            </p>
          )}
          <section id="daily-vocabulary" className="card daily-section">
            <span className="eyebrow">01 · VOCABULARY · 4 MIN</span>
            <h2>Four words to put to work.</h2>
            <div className="daily-word-grid">
              {l.vocabulary.map((v) => (
                <article key={v.term}>
                  <h3>
                    <GermanText text={v.term} />
                  </h3>
                  <strong>{v.meaning}</strong>
                  <p className="micro">{v.grammar}</p>
                  <p>
                    <GermanText text={v.example} />
                  </p>
                  <small>{v.translation}</small>
                </article>
              ))}
            </div>
            {check("vocabulary")}
          </section>
          <section id="daily-grammar" className="card daily-section">
            <span className="eyebrow">02 · GRAMMAR · 4 MIN</span>
            <h2>{l.grammar.focus}</h2>
            <p>{l.grammar.explanation}</p>
            <blockquote>
              <GermanText text={l.grammar.example} />
            </blockquote>
            <p>{l.grammar.translation}</p>
            {check("grammar")}
          </section>
          <section id="daily-reading" className="card daily-section">
            <span className="eyebrow">03 · READING · 6 MIN</span>
            <h2>{l.reading.title}</h2>
            <p className="daily-reading">
              <GermanText text={l.reading.text} />
            </p>
            <button
              className="button subtle"
              onClick={() => setTranslation(!translation)}
            >
              {translation ? "Hide" : "Show"} English summary
            </button>
            {translation && <p className="translation">{l.reading.summary}</p>}
            <p className="micro">
              Click any word for a definition. Read for the main idea first,
              then identify evidence for the reading question below.
            </p>
            {check("reading")}
          </section>
          <section id="daily-listening" className="card daily-section">
            <span className="eyebrow">04 · LISTENING · 5 MIN</span>
            <h2>Listen for meaning.</h2>
            <p>{l.listening.task}</p>
            <ListenButton
              text={l.listening.script}
              label="Play this day’s listening script"
            />
            <p className="micro">
              This original script uses synthetic speech when a German
              voice/service is available. It is not a native-speaker recording
              or an official exam track.
            </p>
            <button
              className="button secondary"
              onClick={() => setScript(!script)}
            >
              {script ? "Hide" : "Show"} listening transcript
            </button>
            {script && (
              <p>
                <GermanText text={l.listening.script} />
              </p>
            )}
            <p>
              <a
                href={l.listening.source}
                target="_blank"
                rel="noopener noreferrer"
              >
                Optional native-audio practice: official Goethe B1 resources ↗
              </a>
            </p>
            <p className="micro">
              If playback is unavailable, use a publisher recording for
              additional listening; reading the transcript alone is reading
              practice. The optional source is not the recording of this
              authored script.
            </p>
            {check("listening")}
          </section>
          <section id="daily-speaking" className="card daily-section">
            <span className="eyebrow">05 · SPEAKING · 4 MIN</span>
            <h2>Say it in your own words.</h2>
            <p>
              <GermanText text={l.speaking.prompt} />
            </p>
            <p>{l.speaking.support}</p>
            <label className="field-label">
              Your speaking outline or spoken transcript
              <textarea
                maxLength={3000}
                value={p.speaking}
                onChange={(e) => edit({ speaking: e.target.value })}
                placeholder="After speaking, record at least 12 words of your outline or response."
              />
            </label>
            <p className="micro">
              Self-review: complete the situation, support one point and try the
              target structure. No automatic pronunciation or fluency score is
              assigned.
            </p>
            {check("speaking")}
          </section>
          <section id="daily-writing" className="card daily-section">
            <span className="eyebrow">06 · WRITING · 5 MIN</span>
            <h2>Make your message clear.</h2>
            <p>
              <GermanText text={l.writing.prompt} />
            </p>
            <p>{l.writing.checklist}</p>
            <label className="field-label">
              Your German response
              <textarea
                rows={7}
                maxLength={5000}
                value={p.writing}
                onChange={(e) => edit({ writing: e.target.value })}
                placeholder="Write at least 40 words, then check the day’s checklist."
              />
            </label>
            {check("writing")}
          </section>
          <section id="daily-quiz" className="card daily-section">
            <span className="eyebrow">07 · CHECK & EXPLAIN · 2 MIN</span>
            <h2>Check what you understood.</h2>
            {l.quiz.map((q, i) => (
              <article className="daily-question" key={i}>
                <h3>
                  {i + 1}. <GermanText text={q.question} />
                </h3>
                <div className="quiz-options">
                  {q.options.map((o, n) => (
                    <button
                      key={o}
                      className={`${p.answers[i] === n ? "selected " : ""}${p.checked[i] && n === q.answer ? "correct" : ""}`}
                      onClick={() =>
                        edit({
                          answers: p.answers.map((a, j) => (j === i ? n : a)),
                          checked: p.checked.map((v, j) =>
                            j === i ? false : v,
                          ),
                          completed: false,
                        })
                      }
                    >
                      <GermanOption text={o} />
                    </button>
                  ))}
                </div>
                <button
                  className="button secondary"
                  disabled={p.answers[i] === null}
                  onClick={() =>
                    edit({
                      checked: p.checked.map((v, j) => (j === i ? true : v)),
                    })
                  }
                >
                  Check question {i + 1}
                </button>
                {p.checked[i] && (
                  <div className="feedback" role="status">
                    <strong>
                      {p.answers[i] === q.answer
                        ? "Correct."
                        : "Review the explanation."}
                    </strong>
                    <p>Answer: {q.options[q.answer]}</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </article>
            ))}
            {check("quiz")}
          </section>
          <section className="card daily-finish">
            <h2>
              {p.completed
                ? "This study day is complete."
                : "Finish with evidence."}
            </h2>
            <p>
              Review all seven sections, record a speaking outline (12+ words)
              and a written response (40+ words), and check all three questions
              with at least two correct answers. The entire 30-day dataset must
              also pass validation.
            </p>
            <p>
              {
                p.seen.filter((x) =>
                  sections.includes(x as (typeof sections)[number]),
                ).length
              }
              /7 sections reviewed ·{" "}
              {p.answers.filter((a, i) => a === l.quiz[i]?.answer).length}/3
              questions correct.
            </p>
            <button
              className="button primary"
              disabled={!ready || p.completed}
              onClick={() => c.finish(day)}
            >
              {p.completed ? "Completed" : "Complete this study day"}
            </button>
          </section>
        </>
      )}
    </>
  );
}
// Quiz choices stay single controls; nested lookup buttons would break answer selection.
function GermanOption({ text }: { text: string }) {
  return <span lang="de">{text}</span>;
}
