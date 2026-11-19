import { Localized } from "../language/Language";
import { applyBookRequest } from "./requests";
import type { BookRequest } from "../journey/navigation";
import { findMaterial } from "./materials";
import PersonalLibrary from "./PersonalLibrary";
import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { books, readBookProgress, type BookProgress } from "./catalog";
import { GermanText } from "../dictionary/Dictionary";
const PdfReader = lazy(() => import("./PdfReader"));
export default function Books({
  scope,
  onListening,
  request,
  onLocation,
}: {
  scope: string;
  onListening: () => void;
  request?: BookRequest;
  onLocation: (request: BookRequest) => void;
}) {
  const [readyBook, setReadyBook] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0),
    [openRequest, setOpenRequest] = useState<{
      file: File;
      ticket: number;
    } | null>(null);
  const key = `deutsch-books-v1:${scope}`;
  const [selected, setSelected] = useState(() => {
      if (request) return request.bookId;
      try {
        return (
          localStorage.getItem(`deutsch-selected-book:${scope}`) || books[0].id
        );
      } catch {
        return books[0].id;
      }
    }),
    [storageError, setStorageError] = useState(""),
    [progress, setProgress] = useState(() => {
      try {
        return applyBookRequest(
          readBookProgress(localStorage.getItem(key)),
          request,
        );
      } catch {
        return applyBookRequest({}, request);
      }
    });
  const book = books.find((b) => b.id === selected) ?? books[0],
    saved = progress[book.id] ?? { page: 1, notes: "", completed: [] };
  const review = saved.view === "review";
  const guide =
    book.guides.find((g) => g.id === saved.guide && !!g.review === review) ??
    book.guides.find((g) => !!g.review === review);
  const selectBook = (id: string) => {
    const target = books.find((b) => b.id === id);
    if (!target) return;
    setSelected(id);
    const p = progress[id],
      g = target.guides.find((g) => g.id === p?.guide) ?? target.guides[0];
    onLocation({ bookId: id, guideId: g.id, page: p?.page ?? g.page });
  };
  const edit = (patch: Partial<BookProgress>) => {
    const view = patch.view ?? saved.view;
    const g =
      book.guides.find(
        (g) =>
          g.id === (patch.guide ?? saved.guide) &&
          !!g.review === (view === "review"),
      ) ?? book.guides.find((g) => !!g.review === (view === "review"));
    const page =
      patch.page ??
      ((patch.guide || patch.view !== undefined) && g ? g.page : saved.page);
    setProgress((p) => ({ ...p, [book.id]: { ...saved, ...patch, page } }));
    if (g) onLocation({ bookId: book.id, guideId: g.id, page });
  };
  useEffect(() => {
    if (!request) return;
    setSelected(request.bookId);
    setProgress((old) => applyBookRequest(old, request));
  }, [request?.bookId, request?.guideId, request?.page]);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(progress));
      setStorageError("");
    } catch {
      setStorageError(
        "Device storage is unavailable. Notes and bookmarks may not survive a reload.",
      );
    }
  }, [key, progress]);
  useEffect(() => {
    let active = true;
    try {
      localStorage.setItem(`deutsch-selected-book:${scope}`, book.id);
    } catch {
      /* Notes expose storage errors separately. */
    }
    void findMaterial(scope, book.sha256)
      .then((material) => {
        if (active && material)
          setOpenRequest({
            file: new File([material.blob], material.name, {
              type: "application/pdf",
            }),
            ticket: Date.now(),
          });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [scope, book.id]);
  return (
    <Localized>
      {
        <>
          <div className="page-heading">
            <span className="eyebrow">MY LIBRARY · DOCUMENT STUDY</span>
            <h1>
              Choose a book. Follow its pages<span>.</span>
            </h1>
            <p>
              Choose one source, open your copy, attempt a task, then check the
              matching answers and record what you learned. Book study stays
              separate from the 30-day course.
            </p>
          </div>
          <section className="card library-start">
            <span className="eyebrow">START HERE</span>
            <h2>One document at a time.</h2>
            <label className="field-label">
              Study guide for a supplied document
              <select
                value={book.id}
                onChange={(e) => {
                  selectBook(e.target.value);
                }}
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} — {b.subtitle}
                  </option>
                ))}
              </select>
            </label>
            <ol className="library-steps">
              <li>
                <strong>Open your copy</strong>
                <span>
                  A saved copy reopens automatically. Otherwise use the PDF
                  reader below.
                </span>
              </li>
              <li>
                <strong>Attempt a task</strong>
                <span>
                  Choose a skill in the page guide; keep your answer in the
                  notes for this book.
                </span>
              </li>
              <li>
                <strong>Check and apply</strong>
                <span>
                  Open the matching key or transcript, explain a mistake and
                  write a new example.
                </span>
              </li>
            </ol>
            <p className="notice" role="status">
              {readyBook === book.id
                ? `Ready: ${book.subtitle}. Page-guide buttons open this exact edition.`
                : `Guide available: ${book.subtitle}. Open the matching PDF below to enable its page shortcuts.`}
            </p>
            <p className="micro">
              Chat attachments are not automatically installed in this browser.
              The three supplied documents have page guides; importing a PDF
              adds searchable text and pattern-based practice, not an
              automatically rewritten course.
            </p>
            <button
              className="button secondary"
              onClick={() =>
                document
                  .getElementById("book-reader")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Go to PDF reader
            </button>
          </section>
          <section className="card book-guide">
            <div className="section-heading">
              <div>
                <span className="eyebrow">STUDY GUIDE</span>
                <h2>{book.subtitle}</h2>
              </div>
              <a
                className="button secondary"
                href={book.source}
                target="_blank"
                rel="noopener noreferrer"
              >
                Official publisher resources <ArrowUpRight size={15} />
              </a>
            </div>
            <p className="micro">
              {book.edition} Page numbers below are PDF viewer pages, not always
              printed page labels. Current publisher editions may differ.
            </p>
            {book.id === "klett-teacher" && (
              <p className="notice">
                This is a teacher’s guide. It contains solutions, sample
                responses and listening transcripts; the companion test book and
                audio are separate.
              </p>
            )}
            <div className="book-guide-switch">
              <button
                className={`button ${!review ? "primary" : "secondary"}`}
                onClick={() => edit({ view: "study" })}
              >
                Study first
              </button>
              <button
                className={`button ${review ? "primary" : "secondary"}`}
                onClick={() => edit({ view: "review" })}
              >
                Review answers & transcripts
              </button>
            </div>
            <label className="field-label">
              Task in this document
              <select
                value={guide?.id ?? ""}
                onChange={(e) => edit({ guide: e.target.value })}
              >
                {book.guides
                  .filter((g) => !!g.review === review)
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label} · PDF p. {g.page}
                    </option>
                  ))}
              </select>
            </label>
            <div className="book-jump-list">
              {book.guides
                .filter((g) => g.id === guide?.id)
                .map((g) => (
                  <div key={g.id}>
                    <button
                      className="button subtle"
                      disabled={readyBook !== book.id}
                      onClick={() => {
                        edit({ page: g.page });
                        document
                          .getElementById("book-reader")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {g.label}
                      <span>PDF p. {g.page}</span>
                    </button>
                    <p>{g.task}</p>
                    <label className="micro">
                      <input
                        type="checkbox"
                        disabled={readyBook !== book.id}
                        checked={saved.completed.includes(g.id)}
                        onChange={(e) =>
                          edit({
                            completed: e.target.checked
                              ? [...saved.completed, g.id]
                              : saved.completed.filter((id) => id !== g.id),
                          })
                        }
                      />{" "}
                      Practised · self-recorded
                    </label>
                  </div>
                ))}
            </div>
            <p className="micro">
              Page jumps apply to your opened PDF. Choose your file below first.
              Checklists are personal study records, not exam marks or XP
              rewards.
            </p>
          </section>
          <details className="card library-imports">
            <summary>Saved imports and document search</summary>
            <PersonalLibrary
              scope={scope}
              refresh={refresh}
              onOpen={(file) => setOpenRequest({ file, ticket: Date.now() })}
            />
          </details>
          <div id="book-reader">
            <Suspense fallback={<p role="status">Opening the PDF reader…</p>}>
              <PdfReader
                scope={scope}
                onReady={setReadyBook}
                onStored={() => setRefresh((v) => v + 1)}
                openRequest={openRequest}
                book={book}
                page={saved.page}
                onPage={(page) => edit({ page })}
                onIdentify={(id) => {
                  if (id !== book.id) selectBook(id);
                }}
              />
            </Suspense>
          </div>
          <div className="book-notes-grid">
            <section className="card">
              <span className="eyebrow">OPTIONAL BOOK STUDY</span>
              <h2>A focused session.</h2>
              <ol>
                <li>
                  10 minutes: attempt one reading section or one listening part
                  without the key.
                </li>
                <li>
                  10 minutes: inspect the evidence, check answers, and collect
                  six or seven useful words.
                </li>
                <li>
                  10 minutes: write or speak a short response using those words
                  and one connector.
                </li>
              </ol>
              <h3>For listening Teil 4</h3>
              <p>
                Track who says what, rather than matching isolated words. On the
                first pass, identify viewpoints; on the second, verify the
                evidence. Then consult the matching transcript. The optional
                three-pass studio uses its own imported recording and captions.
                It does not automatically receive this PDF or its audio.
              </p>
              <button className="button secondary" onClick={onListening}>
                Open listening studio
              </button>
              <p className="micro">
                The PDFs do not contain playable audio. Obtain the matching
                recording from the publisher; the current source page may offer
                newer sets. Check the edition and track before combining
                materials.
              </p>
            </section>
            <section className="card">
              <span className="eyebrow">YOUR STUDY NOTES</span>
              <h2>Keep the useful part.</h2>
              <label className="field-label">
                Words, evidence and your response
                <textarea
                  rows={13}
                  maxLength={6000}
                  value={saved.notes}
                  onChange={(e) => edit({ notes: e.target.value })}
                  placeholder="Record the PDF page, task, your answer, supporting evidence, useful vocabulary, and one new sentence."
                />
              </label>
              {storageError && (
                <p className="notice" role="alert">
                  {storageError}
                </p>
              )}
              <p className="micro">
                Saved on this device, separately for each account. Imported PDFs
                are saved in this browser. Notes do not sync to the cloud.
              </p>
            </section>
          </div>
          <details className="card book-transfer">
            <summary>Optional original transfer prompts</summary>
            <span className="eyebrow">
              ORIGINAL TRANSFER TASK · NOT AN EXAM QUESTION
            </span>
            <h2>Use what you noticed.</h2>
            <p>
              After your book session, answer one prompt in your notes. Borrow a
              useful structure from the page, but create your own example.
            </p>
            <ul>
              <li>
                <GermanText text="Du organisierst einen Lerntreff. Welche zwei Vorschläge machst du, und wie begründest du deine Wahl?" />
              </li>
              <li>
                <GermanText text="Welche Meinung aus einem Hörtext findest du überzeugend? Erkläre deine Position und nenne ein Gegenargument." />
              </li>
              <li>
                <GermanText text="Schreibe eine kurze Nachricht an deine Lerngruppe. Schlage einen Termin vor, erkläre dein Ziel und bitte um Rückmeldung." />
              </li>
            </ul>
            <p className="micro">
              Self-review: Did you address the situation, support an opinion,
              and place the conjugated verb correctly? These prompts are
              authored for this app and are not copied from the supplied exams.
            </p>
          </details>
        </>
      }
    </Localized>
  );
}
