import { Localized } from "./language/Language";
import { useState } from "react";
import { BookOpen, Languages, X } from "lucide-react";
import { passages, idioms, type Passage } from "../content/course";
import { lookup, tokens, type Entry } from "../content/dictionary";
export function ReadingText({ passage }: { passage: Passage }) {
  const [entry, setEntry] = useState<
      | (Entry & {
          surface: string;
        })
      | null
    >(null),
    [translated, setTranslated] = useState<number[]>([]),
    [all, setAll] = useState(false),
    [insight, setInsight] = useState(0);
  return (
    <Localized>
      {
        <div className="reading-grid">
          <article className="card reading-copy">
            <div className="section-heading">
              <span className="eyebrow">{passage.kind}</span>
              <button className="button subtle" onClick={() => setAll(!all)}>
                <Languages size={16} />
                {all ? "Hide translations" : "Translate passage"}
              </button>
            </div>
            <h2>{passage.title}</h2>
            <p className="muted">
              Select a word for grammar and meaning. Use the sentence icon for
              an English translation.
            </p>
            <div
              lang="de"
              onMouseUp={() => {
                const text = window.getSelection()?.toString().trim();
                if (text && text.length > 20) {
                  const indices = passage.sentences
                    .map((s, i) =>
                      text.includes(s.de) || s.de.includes(text) ? i : -1,
                    )
                    .filter((i) => i >= 0);
                  if (indices.length)
                    setTranslated((old) => [...new Set([...old, ...indices])]);
                }
              }}
            >
              {passage.sentences.map((s, i) => (
                <div
                  className={
                    "sentence " +
                    (s.de.includes(passage.insights[insight].quote)
                      ? "highlighted-sentence"
                      : "")
                  }
                  key={i}
                >
                  <p>
                    {tokens(s.de).map((token, n) =>
                      /\p{L}/u.test(token) ? (
                        <button
                          className="word-token"
                          key={n}
                          onClick={() => {
                            const item = lookup(token);
                            setEntry(
                              item
                                ? { ...item, surface: token }
                                : {
                                    surface: token,
                                    lemma: token,
                                    meaning: "Not in this lesson dictionary.",
                                    grammar:
                                      "Check the linked dictionary for a full entry.",
                                    note: "No definition is inferred.",
                                  },
                            );
                          }}
                        >
                          {token}
                        </button>
                      ) : (
                        <span key={n}>{token}</span>
                      ),
                    )}
                    <button
                      className="translate-sentence"
                      aria-label={`Translate sentence ${i + 1}`}
                      onClick={() =>
                        setTranslated((old) =>
                          old.includes(i)
                            ? old.filter((x) => x !== i)
                            : [...old, i],
                        )
                      }
                    >
                      <Languages size={16} />
                    </button>
                  </p>
                  {(all || translated.includes(i)) && (
                    <p className="translation" lang="en">
                      {s.en}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="micro">
              Original teaching text · B1–B2 · English translations are curated,
              not machine-generated at runtime.
            </p>
          </article>
          <aside className="reading-sidebar">
            <section className="card dictionary-panel" aria-live="polite">
              {entry ? (
                <>
                  <button
                    className="icon-button close-lookup"
                    aria-label="Close word lookup"
                    onClick={() => setEntry(null)}
                  >
                    <X size={16} />
                  </button>
                  <span className="eyebrow">WORD LOOKUP</span>
                  <h3 lang="de">{entry.lemma}</h3>
                  <strong>{entry.meaning}</strong>
                  <p className="grammar-tag">{entry.grammar}</p>
                  <p>{entry.note}</p>
                  <a
                    href={`https://www.dwds.de/wb/${encodeURIComponent(entry.surface)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore in DWDS ↗
                  </a>
                </>
              ) : (
                <>
                  <BookOpen size={24} />
                  <h3>A dictionary in the margins.</h3>
                  <p>
                    Click any word in the passage. Meaning, grammatical form,
                    and a usage note appear here instantly.
                  </p>
                </>
              )}
            </section>
            <section className="card">
              <span className="eyebrow">STRUCTURE LAB</span>
              <h3>Notice the patterns.</h3>
              <div className="insight-tabs">
                {passage.insights.map((g, i) => (
                  <button
                    key={g.title}
                    className={insight === i ? "selected" : ""}
                    onClick={() => setInsight(i)}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
              <blockquote lang="de">
                {passage.insights[insight].quote}
              </blockquote>
              <p>{passage.insights[insight].explanation}</p>
              <span className="pill">{passage.insights[insight].skill}</span>
            </section>
          </aside>
        </div>
      }
    </Localized>
  );
}
export default function Reading() {
  const [index, setIndex] = useState(0);
  return (
    <Localized>
      {
        <>
          <div className="page-heading">
            <span className="eyebrow">READ · NOTICE · BORROW</span>
            <h1>
              German between the lines<span>.</span>
            </h1>
            <p>
              Realistic situations. Useful structures. Expressions you can
              actually say.
            </p>
          </div>
          <div
            className="tab-row"
            role="tablist"
            aria-label="Reading exercises"
          >
            {passages.map((p, i) => (
              <button
                role="tab"
                aria-selected={i === index}
                key={p.id}
                onClick={() => setIndex(i)}
              >
                {p.kind}
              </button>
            ))}
          </div>
          <ReadingText key={passages[index].id} passage={passages[index]} />
          <div className="section-heading">
            <h2>Say it more naturally.</h2>
            <span className="muted">Everyday expressions</span>
          </div>
          <div className="idiom-grid">
            {idioms.map((i) => (
              <article className="card" key={i.de}>
                <span className="pill">{i.register}</span>
                <h3 lang="de">{i.de}</h3>
                <p>{i.en}</p>
                <small>{i.note}</small>
              </article>
            ))}
          </div>
        </>
      }
    </Localized>
  );
}
