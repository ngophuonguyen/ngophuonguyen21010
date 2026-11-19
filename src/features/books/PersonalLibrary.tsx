import { Localized } from "../language/Language";
import { useEffect, useState } from "react";
import { GermanText } from "../dictionary/Dictionary";
import { listMaterials, transferPractice, type Material } from "./materials";
export default function PersonalLibrary({
  scope,
  refresh,
  onOpen,
}: {
  scope: string;
  refresh: number;
  onOpen: (file: File) => void;
}) {
  const [rows, setRows] = useState<Material[]>([]),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [level, setLevel] = useState("All");
  useEffect(() => {
    let active = true;
    void listMaterials(scope)
      .then((r) => {
        if (active) {
          setRows(r);
          setError("");
        }
      })
      .catch(() => {
        if (active)
          setError(
            "The persistent library could not be opened. Check browser storage permissions.",
          );
      });
    return () => {
      active = false;
    };
  }, [scope, refresh]);
  const search = query.toLocaleLowerCase("de-DE");
  return (
    <Localized>
      {
        <section className="card personal-library">
          <span className="eyebrow">
            YOUR REUSABLE MATERIALS · DEVICE STORAGE
          </span>
          <h2>A library that grows with you.</h2>
          <p>
            Opening a PDF below extracts and indexes its text on this device.
            New files are added by content fingerprint; existing imports and
            authored daily lessons are never overwritten.
          </p>
          <p className="micro">
            Classification uses visible keywords and grammar patterns, not an AI
            or CEFR assessment. You choose the B1/B2 level. Vocabulary items are
            candidates, not verified dictionary lemmas. Scanned pages require
            OCR.
          </p>
          <div className="import-fields">
            <label className="field-label">
              Search title, topic, grammar, skill or word
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. work, Konjunktiv, listening"
              />
            </label>
            <label className="field-label">
              Library level
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option>All</option>
                <option>B1</option>
                <option>B2</option>
                <option>Mixed</option>
              </select>
            </label>
          </div>
          {error && (
            <p className="notice" role="alert">
              {error}
            </p>
          )}
          {!rows.length && !error && (
            <p>
              No saved documents yet. Open a PDF in the reader below to add it.
            </p>
          )}
          {rows
            .filter(
              (r) =>
                (level === "All" || r.level === level) &&
                (!search ||
                  `${r.name} ${r.pages.map((p) => [p.topics, p.grammar, p.skills, p.text].flat().join(" ")).join(" ")}`
                    .toLocaleLowerCase("de-DE")
                    .includes(search)),
            )
            .map((r) => {
              const matches = r.pages.filter(
                (p) =>
                  !search ||
                  `${p.topics.join(" ")} ${p.grammar.join(" ")} ${p.skills.join(" ")} ${p.text}`
                    .toLocaleLowerCase("de-DE")
                    .includes(search),
              );
              const tags = [
                ...new Set(
                  r.pages.flatMap((p) => [
                    ...p.topics,
                    ...p.grammar,
                    ...p.skills,
                  ]),
                ),
              ];
              return (
                <article className="saved-material" key={r.id}>
                  <div className="section-heading">
                    <h3>{r.name}</h3>
                    <button
                      className="button secondary"
                      onClick={() =>
                        onOpen(
                          new File([r.blob], r.name, {
                            type: "application/pdf",
                          }),
                        )
                      }
                    >
                      Reopen saved PDF
                    </button>
                  </div>
                  <p className="micro">
                    {r.level} · {r.pages.length} pages · {r.emptyPages} pages
                    without selectable text · Added{" "}
                    {new Date(r.createdAt).toLocaleDateString("en-GB")}
                  </p>
                  <div className="chips">
                    {tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <details>
                    <summary>
                      View extracted topics and vocabulary candidates
                    </summary>
                    {matches.slice(0, 8).map((p) => (
                      <div key={p.page}>
                        <strong>PDF page {p.page}</strong>
                        <p>
                          {p.topics.join(", ") || "No topic keyword matched"} ·{" "}
                          {p.grammar.join(", ") || "No grammar pattern matched"}
                        </p>
                        <p>
                          <GermanText text={p.vocabulary.join(" · ")} />
                        </p>
                        <details>
                          <summary>
                            Original transfer practice for this page
                          </summary>
                          <p>{transferPractice(p).prompt}</p>
                          <p>
                            <GermanText text={transferPractice(p).example} />
                          </p>
                          <p>
                            <GermanText text={transferPractice(p).question} />
                          </p>
                          <p>{transferPractice(p).options.join(" / ")}</p>
                          <details>
                            <summary>Answer and explanation</summary>
                            <p>
                              {
                                transferPractice(p).options[
                                  transferPractice(p).answer
                                ]
                              }{" "}
                              — {transferPractice(p).explanation}
                            </p>
                          </details>
                          <p className="micro">
                            Rule-based practice, selected from detected grammar
                            candidates. Check the pattern against the page; this
                            is not an AI interpretation of the book.
                          </p>
                        </details>
                      </div>
                    ))}
                    {matches.length > 8 && (
                      <p>
                        Showing the first eight matching pages. Refine the
                        search or reopen the PDF.
                      </p>
                    )}
                  </details>
                </article>
              );
            })}
          <p className="micro">
            Stored in this browser’s IndexedDB, isolated by account in the UI.
            Files remain on this device; this is not server backup or cloud
            sync. Clearing site data removes the saved library.
          </p>
        </section>
      }
    </Localized>
  );
}
