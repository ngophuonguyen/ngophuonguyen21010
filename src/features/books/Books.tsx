import PersonalLibrary from "./PersonalLibrary";
import { lazy, Suspense, useEffect, useState } from "react";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { books, readBookProgress, type BookProgress } from "./catalog";
import { GermanText } from "../dictionary/Dictionary";
const PdfReader = lazy(() => import("./PdfReader"));
export default function Books({
  scope,
  onListening,
}: {
  scope: string;
  onListening: () => void;
}) {
  const [refresh, setRefresh] = useState(0),
    [openRequest, setOpenRequest] = useState<{
      file: File;
      ticket: number;
    } | null>(null);
  const key = `deutsch-books-v1:${scope}`;
  const [selected, setSelected] = useState(books[0].id),
    [review, setReview] = useState(false),
    [storageError, setStorageError] = useState(""),
    [progress, setProgress] = useState(() => {
      try {
        return readBookProgress(localStorage.getItem(key));
      } catch {
        return {};
      }
    });
  const book = books.find((b) => b.id === selected) ?? books[0],
    saved = progress[book.id] ?? { page: 1, notes: "", completed: [] };
  const edit = (patch: Partial<BookProgress>) =>
    setProgress((p) => ({ ...p, [book.id]: { ...saved, ...patch } }));
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
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">YOUR BOOKS · B1 PRACTICE</span>
        <h1>
          Turn a page. Build a skill<span>.</span>
        </h1>
        <p>
          Three supplied resources, clear page guides, and a personal PDF reader
          with German word lookup.
        </p>
      </div>
      <div className="book-catalog">
        {books.map((b) => (
          <button
            key={b.id}
            className={`card book-resource ${selected === b.id ? "selected" : ""}`}
            aria-pressed={selected === b.id}
            onClick={() => {
              setSelected(b.id);
              setReview(false);
            }}
          >
            <BookOpen size={24} />
            <span className="eyebrow">B1 · {b.pages} PDF PAGES</span>
            <h2>{b.title}</h2>
            <p>{b.subtitle}</p>
            <span className="micro">
              {b.id === "klett-teacher"
                ? "Answers and transcripts · 10 model tests"
                : "Reading · listening · writing · speaking"}
            </span>
          </button>
        ))}
      </div>
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
            This is a teacher’s guide. It contains solutions, sample responses
            and listening transcripts; the companion test book and audio are
            separate.
          </p>
        )}
        <div className="book-guide-switch">
          <button
            className={`button ${!review ? "primary" : "secondary"}`}
            onClick={() => setReview(false)}
          >
            Study first
          </button>
          <button
            className={`button ${review ? "primary" : "secondary"}`}
            onClick={() => setReview(true)}
          >
            Review answers & transcripts
          </button>
        </div>
        <div className="book-jump-list">
          {book.guides
            .filter((g) => !!g.review === review)
            .map((g) => (
              <div key={g.id}>
                <button
                  className="button subtle"
                  onClick={() => edit({ page: g.page })}
                >
                  {g.label}
                  <span>PDF p. {g.page}</span>
                </button>
                <p>{g.task}</p>
                <label className="micro">
                  <input
                    type="checkbox"
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
          Checklists are personal study records, not exam marks or XP rewards.
        </p>
      </section>
      <PersonalLibrary
        scope={scope}
        refresh={refresh}
        onOpen={(file) => setOpenRequest({ file, ticket: Date.now() })}
      />
      <Suspense fallback={<p role="status">Opening the PDF reader…</p>}>
        <PdfReader
          scope={scope}
          onStored={() => setRefresh((v) => v + 1)}
          openRequest={openRequest}
          book={book}
          page={saved.page}
          onPage={(page) => edit({ page })}
          onIdentify={(id) => {
            setSelected(id);
            setReview(false);
          }}
        />
      </Suspense>
      <div className="book-notes-grid">
        <section className="card">
          <span className="eyebrow">30-MINUTE STUDY ROUTINE</span>
          <h2>A focused session.</h2>
          <ol>
            <li>
              10 minutes: attempt one reading section or one listening part
              without the key.
            </li>
            <li>
              10 minutes: inspect the evidence, check answers, and collect six
              or seven useful words.
            </li>
            <li>
              10 minutes: write or speak a short response using those words and
              one connector.
            </li>
          </ol>
          <h3>For listening Teil 4</h3>
          <p>
            Track who says what, rather than matching isolated words. On the
            first pass, identify viewpoints; on the second, verify the evidence.
            Then consult the matching transcript. Use the existing three-pass
            studio for further intensive practice with a recording and timed
            captions you may use.
          </p>
          <button className="button secondary" onClick={onListening}>
            Open listening studio
          </button>
          <p className="micro">
            The PDFs do not contain playable audio. Obtain the matching
            recording from the publisher; the current source page may offer
            newer sets. Check the edition and track before combining materials.
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
            Saved on this device, separately for each account. PDF bytes are not
            saved. Notes do not sync to the cloud.
          </p>
        </section>
      </div>
      <section className="card book-transfer">
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
          Self-review: Did you address the situation, support an opinion, and
          place the conjugated verb correctly? These prompts are authored for
          this app and are not copied from the supplied exams.
        </p>
      </section>
    </>
  );
}
