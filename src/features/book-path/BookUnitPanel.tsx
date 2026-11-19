import { bookAnswerLanguage } from "../language/answers";
import { NativeHint } from "../language/Language";
import { Localized } from "../language/Language";
import { getBookUnit, type BookLink } from "../../content/book-path/units";
import { GermanText } from "../dictionary/Dictionary";
import { useBookPath, bookPathAudit } from "./BookPathProgress";
import { freshUnit, sourceKey, unitReady } from "./progress";
export default function BookUnitPanel({
  day,
  onBook,
}: {
  day: number;
  onBook: (source: BookLink) => void;
}) {
  const c = useBookPath(),
    u = getBookUnit(day);
  if (!u)
    return (
      <Localized>
        {<p role="alert">Book practice unavailable for this day.</p>}
      </Localized>
    );
  const p = c.units[u.id] ?? freshUnit(u),
    edit = (patch: Parameters<typeof c.edit>[1]) => c.edit(day, patch),
    ready = bookPathAudit.valid && unitReady(u, p);
  return (
    <Localized>
      {
        <section
          className="book-unit"
          aria-label={`Book-linked practice for day ${day}`}
        >
          <section className="card">
            <span className="eyebrow">
              BOOK-LINKED PATH · DAY {day} · OPTIONAL 10–15 MIN
            </span>
            <h2>{u.focus}</h2>
            {!bookPathAudit.valid && (
              <p className="notice" role="alert">
                Book practice data is incomplete. Completion is unavailable.
              </p>
            )}
            <p>{u.connection}</p>
            <p className="micro">
              This is original transfer practice mapped to inspected book pages.
              It is not a copied publisher exercise or answer key. The core
              course and its previous progress remain separate.
            </p>
            {c.error && (
              <p role="alert" className="notice">
                {c.error}
              </p>
            )}
            <h3>Your source for this task</h3>
            {u.sources
              .filter((s) => s.primary)
              .map((s) => (
                <article className="book-source" key={sourceKey(s)}>
                  <strong>{s.label}</strong>
                  <p>
                    PDF p. {s.page}
                    {s.printedPage ? ` · printed p. ${s.printedPage}` : ""}
                  </p>
                  <p>{s.purpose}</p>
                  <button
                    className="button secondary"
                    onClick={() => onBook(s)}
                  >
                    Open linked book page
                  </button>
                  <label className="daily-check">
                    <input
                      type="checkbox"
                      checked={p.sources.includes(sourceKey(s))}
                      onChange={(e) =>
                        edit({
                          sources: e.target.checked
                            ? [...new Set([...p.sources, sourceKey(s)])]
                            : p.sources.filter((id) => id !== sourceKey(s)),
                        })
                      }
                    />
                    I reviewed this source in my own copy · self-recorded
                  </label>
                </article>
              ))}
            <details className="book-support">
              <summary>Grammar reference and B1 reinforcement</summary>
              {u.sources
                .filter((s) => !s.primary)
                .map((s) => (
                  <article className="book-source" key={sourceKey(s)}>
                    <strong>{s.label}</strong>
                    <p>
                      PDF p. {s.page}
                      {s.printedPage
                        ? ` · printed p. ${s.printedPage}`
                        : ""} · {s.purpose}
                    </p>
                    <button
                      className="button secondary"
                      onClick={() => onBook(s)}
                    >
                      Open {s.label}
                    </button>
                  </article>
                ))}
            </details>
            <p className="micro">
              Open your matching PDF once in My library, or study from your own
              physical copy. A PDF does not include the separate recording. A
              transcript task does not count as native listening.
            </p>
          </section>
          <section className="card">
            <span className="eyebrow">NOTICE AND APPLY</span>
            <h3>A useful distinction</h3>
            <p>{u.insight}</p>
            <blockquote>
              <GermanText text={u.example} />
            </blockquote>
            <p>{u.translation}</p>
            <ul>
              {u.phrases.map((v) => {
                const [de, en] = v.split(" · ");
                return (
                  <li key={v}>
                    <GermanText text={de} /> — {en}
                  </li>
                );
              })}
            </ul>
            <p className="micro">
              Click German words in examples and expressions for lookup.
            </p>
          </section>
          <section className="card">
            <h3>Check the new idea</h3>
            {u.questions.map((q, i) => (
              <article className="daily-question" key={i}>
                <h4>
                  {i + 1}. {q.prompt}
                </h4>
                <div className="quiz-options">
                  {q.options.map((answer, j) => (
                    <button
                      key={answer}
                      className={`${p.answers[i] === j ? "selected " : ""}${p.checked[i] && j === q.answer ? "correct" : ""}`}
                      onClick={() =>
                        edit({
                          answers: p.answers.map((v, k) => (k === i ? j : v)),
                          checked: p.checked.map((v, k) =>
                            k === i ? false : v,
                          ),
                          reviewed: false,
                        })
                      }
                    >
                      <span lang={bookAnswerLanguage(day, i, j)}>{answer}</span>
                    </button>
                  ))}
                </div>
                <button
                  className="button secondary"
                  disabled={p.answers[i] === null}
                  onClick={() =>
                    edit({
                      checked: p.checked.map((v, k) => (k === i ? true : v)),
                    })
                  }
                >
                  Check book question {i + 1}
                </button>
                {p.checked[i] && (
                  <div className="feedback" role="status">
                    <strong>
                      {p.answers[i] === q.answer
                        ? "Correct."
                        : "Review and try again."}
                    </strong>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </article>
            ))}
          </section>
          <section className="card">
            <h3>Use it in your own response</h3>
            <p>
              <GermanText text={u.production} />
            </p>
            <NativeHint text={u.production} />
            <label className="field-label">
              Your German response · at least 30 words
              <textarea
                rows={6}
                maxLength={5000}
                value={p.response}
                onChange={(e) =>
                  edit({ response: e.target.value, reviewed: false })
                }
              />
            </label>
            <p>{u.checklist}</p>
            <label className="daily-check">
              <input
                type="checkbox"
                checked={p.reviewed}
                onChange={(e) => edit({ reviewed: e.target.checked })}
              />
              I checked my response against this task’s checklist
            </label>
            <p className="micro">
              Self-review, not an AI grammar score. Complete the source review,
              both correct checked questions and your reviewed response to
              record this book unit.
            </p>
            <button
              className="button primary"
              disabled={!ready || p.completed}
              onClick={() => c.finish(day)}
            >
              {p.completed ? "Book unit completed" : "Complete book practice"}
            </button>
          </section>
        </section>
      }
    </Localized>
  );
}
