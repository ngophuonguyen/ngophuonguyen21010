import { useStudyLanguage } from "../language/Language";
import { Localized } from "../language/Language";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BookOpen, Search, X } from "lucide-react";
import { tokens } from "../../content/dictionary";
import {
  cleanTerm,
  dictionaryLinks,
  localEntry,
  onlineEntry,
  wordAt,
  type Sense,
} from "./lookup";
import { ListenButton } from "../Speech";
type Selection = {
  term: string;
  context: string;
};
const Context = createContext<
  ((term: string, context?: string) => void) | null
>(null);
export function GermanText({ text }: { text: string }) {
  const open = useContext(Context);
  return (
    <Localized>
      {
        <span lang="de" className="german-text">
          {tokens(text).map((t, i) =>
            /\p{L}/u.test(t) ? (
              <button
                type="button"
                key={i}
                className="word-token universal-word"
                aria-label={`Look up ${t}`}
                onClick={() => open?.(t, text)}
              >
                {t}
              </button>
            ) : (
              <span key={i}>{t}</span>
            ),
          )}
        </span>
      }
    </Localized>
  );
}
export function DictionaryButton() {
  const open = useContext(Context);
  return (
    <Localized>
      {
        <button
          className="button subtle dictionary-launch"
          aria-label="Dictionary"
          onClick={() => open?.("")}
        >
          <Search size={17} />
          <span>Dictionary</span>
        </button>
      }
    </Localized>
  );
}
export function DictionaryProvider({ children }: { children: ReactNode }) {
  const { language } = useStudyLanguage();
  const [selection, setSelection] = useState<Selection | null>(null),
    [draft, setDraft] = useState(""),
    [validation, setValidation] = useState(""),
    [senses, setSenses] = useState<Sense[]>([]),
    [status, setStatus] = useState(""),
    [retry, setRetry] = useState(0);
  const anchor = useRef<HTMLElement | null>(null),
    search = useRef<HTMLInputElement>(null);
  const open = (term: string, context = "") => {
    const clean = cleanTerm(term);
    anchor.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSelection({ term: clean, context: context.slice(0, 500) });
    setDraft(clean);
    setValidation("");
  };
  const close = () => {
    setSelection(null);
    anchor.current?.focus();
  };
  useEffect(() => {
    if (!selection) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelection(null);
        anchor.current?.focus();
      }
    };
    window.addEventListener("keydown", handle);
    if (!selection.term) search.current?.focus();
    return () => window.removeEventListener("keydown", handle);
  }, [selection]);
  // Plain German headings and feedback also support pointer lookup without changing their markup.
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (
        !(e.target instanceof Element) ||
        e.target.closest(
          "button,a,input,textarea,select,[contenteditable],.global-dictionary",
        )
      )
        return;
      const region = e.target.closest('[lang="de"]');
      if (!region) return;
      const doc = document as Document & {
        caretPositionFromPoint?: (
          x: number,
          y: number,
        ) => {
          offsetNode: Node;
          offset: number;
        } | null;
        caretRangeFromPoint?: (x: number, y: number) => Range | null;
      };
      const pos = doc.caretPositionFromPoint?.(e.clientX, e.clientY);
      const range = pos
        ? null
        : doc.caretRangeFromPoint?.(e.clientX, e.clientY);
      const node = pos?.offsetNode ?? range?.startContainer,
        offset = pos?.offset ?? range?.startOffset ?? 0;
      if (node?.nodeType !== Node.TEXT_NODE || !region.contains(node)) return;
      const term = wordAt(node.textContent ?? "", offset);
      if (term) open(term, region.textContent ?? "");
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  const term = selection?.term ?? "",
    entry = useMemo(() => localEntry(term), [term]),
    links = dictionaryLinks(term);
  useEffect(() => {
    setSenses([]);
    setStatus("");
    if (!term || entry) return;
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 10000);
    setStatus("Looking up German definitions…");
    void onlineEntry(term, controller.signal)
      .then((rows) => {
        if (!controller.signal.aborted) {
          setSenses(rows);
          setStatus(
            rows.length
              ? ""
              : "No German entry found. Try the infinitive or singular form, or use a source link.",
          );
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted || timedOut)
          setStatus(
            timedOut
              ? "The online lookup timed out. Use a source link or retry."
              : e instanceof Error
                ? e.message
                : "Online lookup failed. Use a source link.",
          );
      })
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term, entry, retry]);
  return (
    <Localized>
      {
        <Context.Provider value={open}>
          {children}
          {selection && (
            <aside
              role="dialog"
              aria-modal="false"
              aria-labelledby="dictionary-title"
              className="card global-dictionary"
            >
              <div className="section-heading">
                <span className="eyebrow">
                  <BookOpen size={15} /> GERMAN WORD LOOKUP
                </span>
                <button
                  type="button"
                  className="icon-button"
                  onClick={close}
                  aria-label="Close dictionary"
                >
                  <X size={19} />
                </button>
              </div>
              <h2 id="dictionary-title">A word opens a world.</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const clean = cleanTerm(draft);
                  if (!clean) {
                    setValidation(
                      "Enter a German word or short expression of up to 100 characters.",
                    );
                    return;
                  }
                  setValidation("");
                  setSelection({ term: clean, context: "" });
                  setRetry((n) => n + 1);
                }}
              >
                <label className="field-label">
                  German word or expression
                  <input
                    ref={search}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={100}
                    placeholder="e.g. Sehnsucht, wahrnehmen"
                  />
                </label>
                <button className="button primary" type="submit">
                  Look up word <Search size={15} />
                </button>
              </form>
              {validation && (
                <p role="alert" className="notice">
                  {validation}
                </p>
              )}
              {term ? (
                <>
                  <h3 lang="de">{entry?.lemma ?? term}</h3>
                  <ListenButton text={term} label="Hear dictionary word" />
                  {selection.context && (
                    <blockquote lang="de">{selection.context}</blockquote>
                  )}
                  {entry ? (
                    <>
                      <span className="pill">
                        Curated lesson entry · available offline
                      </span>
                      <p className="dictionary-meaning">{entry.meaning}</p>
                      <p className="grammar-tag">{entry.grammar}</p>
                      <p>{entry.note}</p>
                    </>
                  ) : (
                    <>
                      <p role="status" className="micro">
                        {status}
                      </p>
                      {senses.map((s, i) => (
                        <section className="dictionary-sense" key={i}>
                          <span className="pill">{s.partOfSpeech}</span>
                          <p>{s.definition}</p>
                          {s.examples.map((ex, n) => (
                            <p key={n}>
                              <GermanText text={ex} />
                            </p>
                          ))}
                        </section>
                      ))}
                      {!senses.length && !status.startsWith("Looking") && (
                        <button
                          className="button secondary"
                          onClick={() => setRetry((n) => n + 1)}
                        >
                          Retry online lookup
                        </button>
                      )}
                      <p className="micro">
                        German entries from English Wiktionary. Inflected forms
                        may point to a lemma; use the full entry for gender,
                        plural and conjugation. No grammatical properties are
                        guessed.
                      </p>
                      <p className="micro">
                        Wiktionary contributors ·{" "}
                        <a
                          href="https://creativecommons.org/licenses/by-sa/4.0/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          CC BY-SA 4.0
                        </a>{" "}
                        · Definitions displayed as plain text.
                      </p>
                    </>
                  )}
                  <nav
                    className="dictionary-sources"
                    aria-label="Dictionary sources"
                  >
                    {language === "vi" && (
                      <a
                        href={`https://vi.glosbe.com/de/vi/${encodeURIComponent(term)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        External German–Vietnamese dictionary
                      </a>
                    )}
                    <a
                      href={links.wiktionary}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Full Wiktionary entry ↗
                    </a>
                    <a
                      href={links.dwds}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      DWDS ↗
                    </a>
                    <a
                      href={links.pons}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      German–English in PONS ↗
                    </a>
                  </nav>
                </>
              ) : (
                <p>
                  Click a German word in an example, review, or transcript, or
                  enter any word here. Online lookup sends only the searched
                  term to Wiktionary; your sentence stays on this device.
                </p>
              )}
            </aside>
          )}
        </Context.Provider>
      }
    </Localized>
  );
}
