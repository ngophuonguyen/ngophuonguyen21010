import { NativeHint } from "./language/Language";
import { Localized } from "./language/Language";
import { GermanText } from "./dictionary/Dictionary";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Lock, RotateCcw } from "lucide-react";
import {
  vocabulary,
  idioms,
  hasTarget,
  normalize,
  wordCount,
} from "../content/course";
import { useBatch } from "./useBatch";
import {
  phase,
  freshBatch,
  type Feedback,
  type RecordState,
  visualEligible,
} from "./batchState";
import { ListenButton, Dictation } from "./Speech";
import { aiEnabled, evaluateGerman } from "./evaluation";
function FeedbackView({ feedback }: { feedback: Feedback }) {
  return (
    <Localized>
      {
        <section className="feedback" aria-live="polite">
          <span className="eyebrow">AI TEXT ASSESSMENT</span>
          <div className="score-row">
            <strong>Grammar {feedback.grammar}/5</strong>
            <strong>Naturalness {feedback.naturalness}/5</strong>
          </div>
          <p lang="de">
            <GermanText text={feedback.corrected} />
          </p>
          <ul>
            {feedback.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
          <small>
            Language-model guidance, not an exam grade. Spoken fluency and
            pronunciation are not assessed from a transcript.
          </small>
        </section>
      }
    </Localized>
  );
}
function NativeClip({
  onReady,
}: {
  onReady: (played: boolean, source: string) => void;
}) {
  const [url, setUrl] = useState(""),
    [type, setType] = useState("audio"),
    [source, setSource] = useState(""),
    [confirmed, setConfirmed] = useState(false),
    [played, setPlayed] = useState(false),
    [error, setError] = useState("");
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  useEffect(() => {
    onReady(played && confirmed && !!source.trim(), source.trim());
  }, [played, confirmed, source]);
  return (
    <Localized>
      {
        <section className="native-clip">
          <span className="eyebrow">NATIVE CONTEXT · YOUR SOURCE</span>
          <p>
            Add a short native-speaker recording containing this target word in
            a complete sentence. Use a clip you may use, such as your course
            audio. The file stays in this browser session.
          </p>
          <label className="field-label">
            Audio or video file
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (
                  !/^(audio|video)\//.test(f.type) ||
                  f.size > 50 * 1024 * 1024
                ) {
                  setError("Choose an audio or video file under 50 MB.");
                  return;
                }
                setError("");
                setUrl(URL.createObjectURL(f));
                setType(f.type.startsWith("video") ? "video" : "audio");
                setPlayed(false);
                setConfirmed(false);
              }}
            />
          </label>
          <label className="field-label">
            Source / book, unit and track
            <input
              value={source}
              maxLength={200}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Example: my course audio, unit 4, track 2"
            />
          </label>
          {url &&
            (type === "video" ? (
              <video
                controls
                src={url}
                onPlay={() => setPlayed(true)}
                onError={() => {
                  setPlayed(false);
                  setError(
                    "This video cannot be played. Try an MP4 or another supported file.",
                  );
                }}
                aria-label="Native context video"
              />
            ) : (
              <audio
                controls
                src={url}
                onPlay={() => setPlayed(true)}
                onError={() => {
                  setPlayed(false);
                  setError(
                    "This audio cannot be played. Try an MP3 or WAV file.",
                  );
                }}
                aria-label="Native context recording"
              />
            ))}
          <label className="check-label">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />{" "}
            This is a native-speaker recording containing the target word in
            context.
          </label>
          <p className="micro">
            Source confirmation is supplied by you, not verified by the app.
            Uploaded files are not sent to AI or saved online.
          </p>
          {error && <p role="alert">{error}</p>}
        </section>
      }
    </Localized>
  );
}
export default function Vocabulary({
  userId,
  authLoading,
}: {
  userId: string | null;
  authLoading: boolean;
}) {
  const batch = useBatch(userId, authLoading),
    { state, update } = batch,
    { index, step } = phase(state),
    w = vocabulary[index],
    r = state.records[index];
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [reviewed, setReviewed] = useState(false),
    [nativeReady, setNativeReady] = useState(false),
    [nativeSource, setNativeSource] = useState(""),
    [reset, setReset] = useState(false),
    [showClue, setShowClue] = useState(false),
    controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    setReviewed(false);
    setError("");
    setNativeReady(false);
    setShowClue(false);
  }, [index, step]);
  function editWord(change: Partial<RecordState>) {
    update((s) => ({
      ...s,
      records: s.records.map((x, i) => (i === index ? { ...x, ...change } : x)),
    }));
  }
  async function assess(visual = false) {
    const submitted = visual ? state.paragraph : r.response;
    controller.current?.abort();
    const c = new AbortController();
    controller.current = c;
    setBusy(true);
    setError("");
    try {
      const feedback = await evaluateGerman(
        submitted,
        visual
          ? "Describe a plan inspired by the image: a nostalgic music evening with friends. Use all six target nouns and an appropriate idiom."
          : w.scenario,
        visual ? vocabulary.map((x) => x.word) : [w.word],
        c.signal,
      );
      if (c.signal.aborted) return;
      if (visual)
        update((s) =>
          s.paragraph === submitted
            ? { ...s, visualFeedback: feedback, visualReview: "ai" }
            : s,
        );
      else
        update((s) => ({
          ...s,
          records: s.records.map((x, i) =>
            i === index && x.response === submitted
              ? { ...x, feedback, review: "ai" }
              : x,
          ),
        }));
    } catch (e) {
      if (!c.signal.aborted)
        setError(e instanceof Error ? e.message : "Assessment failed.");
    } finally {
      if (!c.signal.aborted) setBusy(false);
    }
  }
  const activeReady = hasTarget(r.response, w) && wordCount(r.response) >= 5;
  const used = vocabulary.filter((word) => hasTarget(state.paragraph, word));
  const visualReady = visualEligible(state.paragraph);
  return (
    <Localized>
      {
        <>
          <div className="page-heading">
            <span className="eyebrow">VOCABULARY STUDIO · BATCH 01</span>
            <h1>
              Learn it. Make it yours<span>.</span>
            </h1>
            <p>
              Six words, four steps, one story. Work through each word before
              your final visual task.
            </p>
          </div>
          <div className="batch-toolbar">
            <span role="status">{batch.status}</span>
            <button
              className="button subtle"
              disabled={!userId}
              onClick={batch.retry}
            >
              Retry cloud save
            </button>
            <button className="button subtle" onClick={() => setReset(!reset)}>
              <RotateCcw size={14} />
              Restart batch
            </button>
          </div>
          {reset && (
            <div className="notice">
              <p>
                Restart this batch and clear its saved answers? Your other
                learning progress will remain.
              </p>
              <button
                className="button secondary"
                onClick={() => {
                  update(() => freshBatch());
                  setReset(false);
                }}
              >
                Restart
              </button>
              <button className="button subtle" onClick={() => setReset(false)}>
                Cancel
              </button>
            </div>
          )}
          <ol className="stepper">
            {[
              "Meet the word",
              "Make a sentence",
              "Listen & identify",
              "Tell the story",
            ].map((s, i) => (
              <li
                key={s}
                className={
                  step === i + 1 ? "current" : step > i + 1 ? "done" : ""
                }
              >
                <span>{step > i + 1 ? <Check size={15} /> : i + 1}</span>
                {s}
                {i === 3 && step < 4 && <Lock size={12} />}
              </li>
            ))}
          </ol>
          <div className="studio-grid">
            <div className="card studio-main" inert={!batch.ready}>
              <div className="section-heading">
                <span className="eyebrow">
                  {step === 4 ? "ALL SIX WORDS" : `WORD ${index + 1} OF 6`} ·
                  STEP {step}
                </span>
                <span className="pill">
                  {state.records.filter((x) => x.solved).length}/6 complete
                </span>
              </div>
              {step === 1 && (
                <>
                  <h2 className="target-word">
                    <small>{w.article}</small> {w.word}
                  </h2>
                  <p className="word-meaning">{w.meaning}</p>
                  <dl className="word-spec">
                    <div>
                      <dt>Gender</dt>
                      <dd>
                        {w.article === "die" ? "Feminine" : "Masculine"} ·{" "}
                        {w.article}
                      </dd>
                    </div>
                    <div>
                      <dt>Plural</dt>
                      <dd lang="de">{w.plural}</dd>
                    </div>
                  </dl>
                  <ListenButton
                    text={`${w.article} ${w.word}. ${w.examples[0].de}`}
                    label="Hear the word"
                  />
                  <h3>Words that belong together.</h3>
                  <div className="chips">
                    {w.collocations.map((c) => (
                      <span key={c} lang="de">
                        <GermanText text={c} />
                      </span>
                    ))}
                  </div>
                  <div className="example-list">
                    {w.examples.map((ex) => (
                      <div key={ex.de}>
                        <p lang="de">
                          <GermanText text={ex.de} />
                        </p>
                        <small>{ex.en}</small>
                      </div>
                    ))}
                  </div>
                  <button
                    className="button primary"
                    onClick={() => editWord({ introduced: true })}
                  >
                    I have explored the word <ArrowRight size={16} />
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <h2>
                    Your turn to use <em>{w.word}</em>.
                  </h2>
                  <p>
                    Play the scenario, then say or write a complete sentence.
                    Use a target noun form and at least five words.
                  </p>
                  <ListenButton text={w.scenario} />
                  <details className="prompt-transcript">
                    <summary>Read the German scenario</summary>
                    <p lang="de">
                      <GermanText text={w.scenario} />
                    </p>
                    <NativeHint text={w.scenario} />
                  </details>
                  <label className="field-label">
                    Your German sentence
                    <textarea
                      value={r.response}
                      maxLength={1500}
                      onChange={(e) => {
                        editWord({
                          response: e.target.value,
                          feedback: null,
                          review: null,
                        });
                        setReviewed(false);
                        setError("");
                      }}
                      placeholder={`Use ${w.article} ${w.word} in a realistic sentence…`}
                      lang="de"
                    />
                  </label>
                  <Dictation
                    onText={(text) => {
                      editWord({
                        response: text,
                        feedback: null,
                        review: null,
                      });
                      setReviewed(false);
                    }}
                  />
                  <div className="response-checks">
                    <span className={hasTarget(r.response, w) ? "met" : ""}>
                      Target word {hasTarget(r.response, w) ? "✓" : "required"}
                    </span>
                    <span>{wordCount(r.response)} words</span>
                  </div>
                  <button
                    className="button secondary"
                    disabled={!activeReady || busy || !aiEnabled}
                    onClick={() => void assess()}
                  >
                    {busy ? "Assessing…" : "Get AI feedback"}
                  </button>
                  {!aiEnabled && (
                    <p className="notice">
                      AI assessment is not connected yet. Self-review is
                      available as unscored practice.
                    </p>
                  )}
                  {r.feedback && <FeedbackView feedback={r.feedback} />}
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={reviewed}
                      onChange={(e) => setReviewed(e.target.checked)}
                    />{" "}
                    {r.feedback
                      ? "I have reviewed the corrections and usage advice."
                      : "Self-review: I checked noun capitalization, article/case, verb position, and a natural collocation."}
                  </label>
                  <button
                    className="button primary"
                    disabled={!activeReady || !reviewed || busy}
                    onClick={() =>
                      editWord({
                        produced: true,
                        review: r.feedback ? "ai" : "self",
                      })
                    }
                  >
                    {r.feedback
                      ? "Continue to listening"
                      : "Continue with unscored self-review"}
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
              {step === 3 && (
                <>
                  <h2>Find the word in context.</h2>
                  <p>
                    Listen to a native-speaker clip, then type the noun you
                    hear. Singular or plural is accepted. Spelling and umlauts
                    matter.
                  </p>
                  <NativeClip
                    key={w.id}
                    onReady={(ready, source) => {
                      setNativeReady(ready);
                      setNativeSource(source);
                    }}
                  />
                  <details>
                    <summary>
                      Synthetic warm-up (not the native assessment)
                    </summary>
                    <ListenButton text={w.clue} label="Play context clue" />
                    <button
                      className="button subtle"
                      onClick={() => setShowClue(!showClue)}
                    >
                      Toggle clue transcript
                    </button>
                    {showClue && (
                      <p lang="de">
                        <GermanText text={w.clue} />
                      </p>
                    )}
                  </details>
                  <label className="field-label">
                    Which noun fits?
                    <input
                      lang="de"
                      value={r.guess}
                      maxLength={100}
                      onChange={(e) => {
                        editWord({ guess: e.target.value });
                        setError("");
                      }}
                      autoComplete="off"
                      placeholder="Type the German noun"
                    />
                  </label>
                  {!nativeReady && (
                    <p className="notice">
                      Add, attribute, confirm, and play a native clip to unlock
                      this step. Synthetic warm-up alone does not complete
                      native listening.
                    </p>
                  )}
                  <button
                    className="button primary"
                    disabled={!nativeReady || !r.guess.trim()}
                    onClick={() => {
                      if (
                        w.forms.some(
                          (f) =>
                            normalize(f) ===
                            normalize(
                              r.guess.replace(/^(der|die|das)\s+/i, ""),
                            ),
                        )
                      ) {
                        editWord({ solved: true, nativeSource });
                      } else
                        setError(
                          "Not quite. Listen again and check the noun form and umlauts.",
                        );
                    }}
                  >
                    {index === 5
                      ? "Unlock visual task"
                      : "Check & meet the next word"}
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
              {step === 4 && (
                <>
                  <h2>Turn six words into a story.</h2>
                  <img
                    className="visual-task"
                    src="./visual-evening.jpg"
                    alt="A rose-toned still life with a music player, a CD, a flip phone, headphones, butterflies and a city photograph."
                  />
                  <p>
                    Plan a nostalgic music evening with friends, inspired by
                    this image. Write 60–180 German words. Use all six target
                    nouns and either <span lang="de">am Ball bleiben</span> or{" "}
                    <span lang="de">unter einen Hut bringen</span> naturally.
                  </p>
                  <label className="field-label">
                    Your scene
                    <textarea
                      className="paragraph-input"
                      value={state.paragraph}
                      maxLength={5000}
                      lang="de"
                      onChange={(e) => {
                        update((s) => ({
                          ...s,
                          paragraph: e.target.value,
                          visualFeedback: null,
                          visualReview: null,
                          completed: false,
                        }));
                        setReviewed(false);
                      }}
                    />
                  </label>
                  <Dictation
                    onText={(text) => {
                      update((s) => ({
                        ...s,
                        paragraph: text,
                        visualFeedback: null,
                        visualReview: null,
                        completed: false,
                      }));
                      setReviewed(false);
                    }}
                  />
                  <div className="chips">
                    {vocabulary.map((v) => (
                      <span
                        className={hasTarget(state.paragraph, v) ? "met" : ""}
                        key={v.id}
                      >
                        {v.word} {hasTarget(state.paragraph, v) ? "✓" : ""}
                      </span>
                    ))}
                  </div>
                  <p>
                    {wordCount(state.paragraph)} / 60–180 words · {used.length}
                    /6 target nouns detected
                  </p>
                  <button
                    className="button secondary"
                    disabled={!visualReady || busy || !aiEnabled}
                    onClick={() => void assess(true)}
                  >
                    {busy ? "Assessing…" : "Get paragraph feedback"}
                  </button>
                  {state.visualFeedback && (
                    <FeedbackView feedback={state.visualFeedback} />
                  )}
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={reviewed}
                      onChange={(e) => setReviewed(e.target.checked)}
                    />{" "}
                    I reviewed the grammar, checked the idiom meaning, and
                    connected my story to the image.
                  </label>
                  <button
                    className="button primary"
                    disabled={!visualReady || !reviewed || busy}
                    onClick={() =>
                      update((s) => ({
                        ...s,
                        completed: true,
                        visualReview: s.visualFeedback ? "ai" : "self",
                      }))
                    }
                  >
                    Complete{" "}
                    {state.visualFeedback ? "assessed" : "self-reviewed"} batch{" "}
                    <Check size={16} />
                  </button>
                  {state.completed && (
                    <div role="status" className="success">
                      <h3>One batch. Six words you can use.</h3>
                      <p>
                        {state.visualReview === "ai"
                          ? "AI-assisted text practice completed."
                          : "Unscored self-reviewed practice completed."}{" "}
                        Your work has been saved.
                      </p>
                    </div>
                  )}
                </>
              )}
              {error && (
                <p role="alert" className="notice">
                  {error}
                </p>
              )}
            </div>
            <aside className="studio-sidebar">
              <section className="card">
                <span className="eyebrow">YOUR SIX WORDS</span>
                <h3>Plans & possibilities</h3>
                <ul className="batch-word-list">
                  {vocabulary.map((v, i) => (
                    <li
                      key={v.id}
                      className={i === index && step !== 4 ? "active" : ""}
                    >
                      <span>
                        {state.records[i].solved ? (
                          <Check size={15} />
                        ) : (
                          String(i + 1).padStart(2, "0")
                        )}
                      </span>
                      <div>
                        <strong lang="de">
                          {v.article} {v.word}
                        </strong>
                        <small>{v.meaning}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="card">
                <span className="eyebrow">A LITTLE MORE NATURAL</span>
                {idioms.map((x) => (
                  <div className="idiom-note" key={x.de}>
                    <strong lang="de">{x.de}</strong>
                    <p>{x.en}</p>
                    <small>
                      {x.register} · {x.note}
                    </small>
                  </div>
                ))}
              </section>
              <p className="micro">
                Sequence is saved per account or guest device. Native source
                files are session-only. AI feedback requires a configured server
                endpoint.
              </p>
            </aside>
          </div>
        </>
      }
    </Localized>
  );
}
