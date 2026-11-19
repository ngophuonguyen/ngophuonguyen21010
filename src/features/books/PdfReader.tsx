import { MAX_PDF_BYTES } from "./limits";
import { useEffect, useRef, useState } from "react";
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentLoadingTask,
  type PDFDocumentProxy,
  type RenderTask,
} from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { GermanText } from "../dictionary/Dictionary";
import { clampPage, identifyBook, textLines, type Book } from "./catalog";
import { indexMaterial, type Material } from "./materials";
GlobalWorkerOptions.workerSrc = workerUrl;
export default function PdfReader({
  book,
  page,
  onPage,
  onIdentify,
  scope,
  onStored,
  onReady,
  openRequest,
}: {
  scope: string;
  onStored: () => void;
  onReady: (bookId: string | null) => void;
  openRequest: { file: File; ticket: number } | null;
  book: Book;
  page: number;
  onPage: (n: number) => void;
  onIdentify: (id: string) => void;
}) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null),
    [fileName, setFileName] = useState(""),
    [loading, setLoading] = useState(false),
    [rendering, setRendering] = useState(false),
    [error, setError] = useState(""),
    [lines, setLines] = useState<string[]>([]),
    [verified, setVerified] = useState<string | null>(null),
    [pageDraft, setPageDraft] = useState(String(page));
  const [level, setLevel] = useState<Material["level"]>("B1"),
    [indexStatus, setIndexStatus] = useState("");
  const importAbort = useRef<AbortController | null>(null);
  useEffect(() => {
    if (openRequest) void openFile(openRequest.file);
  }, [openRequest]);
  const task = useRef<PDFDocumentLoadingTask | null>(null),
    generation = useRef(0),
    canvas = useRef<HTMLCanvasElement>(null),
    input = useRef<HTMLInputElement>(null),
    callbacks = useRef({ onPage, onIdentify, onReady });
  callbacks.current = { onPage, onIdentify, onReady };
  useEffect(
    () => () => {
      generation.current++;
      importAbort.current?.abort();
      void task.current?.destroy();
    },
    [],
  );
  useEffect(() => setPageDraft(String(page)), [page]);
  // A different catalog selection must not silently reuse the previous book's pages.
  useEffect(() => {
    if (pdf && verified !== book.id) {
      generation.current++;
      importAbort.current?.abort();
      void task.current?.destroy();
      task.current = null;
      setPdf(null);
      setLines([]);
      setVerified(null);
      setFileName("");
      callbacks.current.onReady(null);
    }
  }, [book.id]);
  async function openFile(file: File) {
    const ticket = ++generation.current;
    importAbort.current?.abort();
    const abort = new AbortController();
    importAbort.current = abort;
    setIndexStatus("");
    callbacks.current.onReady(null);
    void task.current?.destroy();
    task.current = null;
    setPdf(null);
    setError("");
    setLines([]);
    setLoading(true);
    setFileName(file.name);
    setVerified(null);
    try {
      if (file.size > MAX_PDF_BYTES)
        throw new Error(
          "Choose a PDF no larger than 200 MiB. For larger books, split a local copy into chapters.",
        );
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (!new TextDecoder().decode(bytes.slice(0, 1024)).includes("%PDF-"))
        throw new Error("This file is not a PDF.");
      const hash = await crypto.subtle.digest("SHA-256", bytes);
      if (ticket !== generation.current) return;
      const known = identifyBook(
        [...new Uint8Array(hash)]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join(""),
      );
      const loadingTask = getDocument({
        data: bytes,
        enableXfa: false,
        useSystemFonts: true,
        useWasm: false,
      });
      task.current = loadingTask;
      const doc = await loadingTask.promise;
      if (ticket !== generation.current) {
        void loadingTask.destroy();
        return;
      }
      if (doc.numPages > 600) {
        void loadingTask.destroy();
        throw new Error("Choose a PDF with at most 600 pages.");
      }
      setVerified(known?.id ?? null);
      setPdf(doc);
      callbacks.current.onReady(known?.id ?? null);
      if (known) callbacks.current.onIdentify(known.id);
      else callbacks.current.onPage(1);
      setLoading(false);
      try {
        await indexMaterial(
          doc,
          file,
          [...new Uint8Array(hash)]
            .map((x) => x.toString(16).padStart(2, "0"))
            .join(""),
          scope,
          known?.id === "aspekte-b2" ? "B2" : known ? "B1" : level,
          (n, total) => {
            if (ticket === generation.current)
              setIndexStatus(`Indexing page ${n} of ${total}…`);
          },
          abort.signal,
        );
        if (ticket === generation.current) {
          setIndexStatus("Saved to your reusable device library.");
          onStored();
        }
      } catch (cause) {
        if (ticket === generation.current && !abort.signal.aborted)
          setIndexStatus(
            `PDF opened, but library save failed: ${cause instanceof Error ? cause.message : "storage unavailable"}. Previous materials remain unchanged.`,
          );
      }
    } catch (e) {
      if (ticket === generation.current)
        setError(
          e instanceof Error && /Choose|not a PDF/.test(e.message)
            ? e.message
            : "The PDF could not be opened. It may be damaged or password-protected. Choose an unlocked PDF.",
        );
    } finally {
      if (ticket === generation.current) setLoading(false);
    }
  }
  const current = pdf ? clampPage(page, pdf.numPages) : page;
  useEffect(() => {
    if (!pdf) return;
    let disposed = false,
      render: RenderTask | undefined;
    setRendering(true);
    setError("");
    setLines([]);
    void (async () => {
      try {
        const p = await pdf.getPage(current);
        if (disposed || !canvas.current) return;
        const base = p.getViewport({ scale: 1 }),
          scale = Math.min(660 / base.width, 1100 / base.height),
          viewport = p.getViewport({ scale }),
          output = Math.min(1.5, window.devicePixelRatio || 1);
        const el = canvas.current;
        el.width = Math.ceil(viewport.width * output);
        el.height = Math.ceil(viewport.height * output);
        const ctx = el.getContext("2d");
        if (!ctx) throw Error();
        render = p.render({
          canvas: el,
          canvasContext: ctx,
          viewport,
          transform: [output, 0, 0, output, 0, 0],
        });
        const text = await p.getTextContent();
        if (!disposed) setLines(textLines(text.items));
        await render.promise;
      } catch (e) {
        if (
          !disposed &&
          !(e instanceof Error && e.name === "RenderingCancelledException")
        )
          setError(
            "This page could not be rendered. Try another page or reopen the PDF.",
          );
      } finally {
        if (!disposed) setRendering(false);
      }
    })();
    return () => {
      disposed = true;
      render?.cancel();
    };
  }, [pdf, current]);
  return (
    <section className="card pdf-reader">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PERSONAL PDF READER</span>
          <h2>Read. Click. Understand.</h2>
        </div>
        <button
          className="button primary"
          onClick={() => input.current?.click()}
        >
          {pdf ? "Choose another PDF" : "Open my PDF"}
        </button>
      </div>
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        aria-label="Open personal PDF"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void openFile(file);
          e.target.value = "";
        }}
      />
      <label className="field-label">
        Level for the next PDF import
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as Material["level"])}
        >
          <option>B1</option>
          <option>B2</option>
          <option>Mixed</option>
        </select>
      </label>
      {indexStatus && (
        <p role="status" className="notice">
          {indexStatus}
        </p>
      )}
      <p className="micro">
        PDFs up to 200 MiB are supported, including the supplied Aspekte scan.
        Large scans take longer to open and may exceed browser storage quota.
        PDF files and extracted text are saved in your reusable device library
        without uploading them. Notes and page bookmarks are also saved locally.
        Clicking a word sends only that term to the dictionary when needed.
      </p>
      {loading && <p role="status">Opening your PDF…</p>}
      {error && (
        <p role="alert" className="notice">
          {error}
        </p>
      )}
      {pdf ? (
        <>
          <p className="micro">
            {fileName} · {pdf.numPages} pages ·{" "}
            {verified === book.id
              ? "Exact match to the supplied edition."
              : "Edition not verified. Page guides refer to the supplied copy; check headings before using them."}
          </p>
          <form
            className="pdf-page-controls"
            onSubmit={(e) => {
              e.preventDefault();
              onPage(clampPage(Number(pageDraft), pdf.numPages));
            }}
          >
            <button
              type="button"
              className="button secondary"
              disabled={current <= 1 || rendering}
              onClick={() => onPage(current - 1)}
            >
              Previous page
            </button>
            <label className="field-label">
              PDF page
              <input
                type="number"
                min={1}
                max={pdf.numPages}
                value={pageDraft}
                onChange={(e) => setPageDraft(e.target.value)}
              />
            </label>
            <button type="submit" className="button secondary">
              Go
            </button>
            <span>of {pdf.numPages}</span>
            <button
              type="button"
              className="button secondary"
              disabled={current >= pdf.numPages || rendering}
              onClick={() => onPage(current + 1)}
            >
              Next page
            </button>
          </form>
          {rendering && <p role="status">Rendering page {current}…</p>}
          <div className="pdf-study-columns">
            <div className="pdf-canvas-wrap">
              <canvas
                ref={canvas}
                aria-label={`Original PDF page ${current}`}
              />
            </div>
            <div className="pdf-extracted">
              <h3>Click words in the extracted text.</h3>
              <p className="micro">
                Text order may differ in columns or tables. Check the original
                page alongside it. No automatic translation or answer grading is
                applied.
              </p>
              {lines.length
                ? lines.map((line, i) => (
                    <p key={`${current}-${i}`}>
                      <GermanText text={line} />
                    </p>
                  ))
                : !rendering && (
                    <p>
                      No selectable text found on this page. Scanned images need
                      OCR, which is not included.
                    </p>
                  )}
            </div>
          </div>
        </>
      ) : (
        !loading && (
          <div className="pdf-empty">
            <p>
              Choose <strong>{book.fileName}</strong> from your device to use
              its page guide and word lookup.
            </p>
            <p>
              Publisher PDFs and textbook recordings are not bundled into this
              public website. The official-source links above provide the
              available materials and audio.
            </p>
          </div>
        )
      )}
    </section>
  );
}
