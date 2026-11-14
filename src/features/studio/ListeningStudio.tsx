import { GermanText } from "../dictionary/Dictionary";
import { berlinLesson } from "../../content/berlin";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Lock, Plus, Volume2 } from "lucide-react";
import { passages } from "../../content/course";
import {
  canOpenPass,
  emptyPass,
  getYouTubeId,
  lessonId,
  parseVtt,
  type Lesson,
} from "./model";
import { useStudio } from "./StudioProgress";
import NarrationPlayer from "./NarrationPlayer";
import YouTubePlayer from "./YouTubePlayer";
import FilePlayer from "./FilePlayer";
const demo: Lesson = {
  id: "plans-original-v1",
  title: "A little planning, a good evening",
  type: "narration",
  source: "Original app teaching text · synthetic narration",
  cues: passages[0].sentences.map((sentence, i) => ({
    start: i * 10,
    end: (i + 1) * 10,
    ...sentence,
    grammar:
      passages[0].insights.find((g) => sentence.de.includes(g.quote))
        ?.explanation ??
      "Notice the position of the conjugated verb and the noun collocations in this sentence.",
  })),
};
export default function ListeningStudio({
  onResources,
}: {
  onResources: () => void;
}) {
  const studio = useStudio(),
    { state, lessons, storageError } = studio;
  const [selected, setSelected] = useState(demo.id),
    [importing, setImporting] = useState(false),
    [kind, setKind] = useState<"youtube" | "audio">("youtube"),
    [title, setTitle] = useState(""),
    [source, setSource] = useState(""),
    [url, setUrl] = useState(""),
    [vtt, setVtt] = useState(""),
    [file, setFile] = useState<File | null>(null),
    [error, setError] = useState(""),
    [heard, setHeard] = useState(false),
    [seconds, setSeconds] = useState(0),
    [cue, setCue] = useState(-1),
    [insight, setInsight] = useState<number | null>(null),
    [consent, setConsent] = useState(false),
    [blobUrls, setBlobUrls] = useState<Record<string, string>>({});
  const objectUrls = useRef(new Set<string>());
  useEffect(
    () => () => {
      objectUrls.current.forEach((u) => URL.revokeObjectURL(u));
    },
    [],
  );
  const library = useMemo(() => [demo, berlinLesson, ...lessons], [lessons]),
    lesson = library.find((l) => l.id === selected) ?? demo,
    progress = state.listening[lesson.id] ?? emptyPass(),
    pass = progress.pass;
  useEffect(() => {
    setHeard(false);
    setSeconds(0);
    setCue(-1);
    setInsight(null);
    setConsent(false);
    setError("");
  }, [lesson.id, pass]);
  const end = (duration: number) => {
    setHeard(true);
    setSeconds(duration);
  };
  const attach = (f: File, id: string) => {
    const previous = blobUrls[id];
    if (previous) {
      URL.revokeObjectURL(previous);
      objectUrls.current.delete(previous);
    }
    const blob = URL.createObjectURL(f);
    objectUrls.current.add(blob);
    setBlobUrls((old) => ({ ...old, [id]: blob }));
  };
  function importLesson(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const cues = parseVtt(vtt);
    if (!cues.length) {
      setError(
        "Provide valid, non-overlapping WebVTT cues with German text. Add an English translation after | for bilingual mode. Maximum transcript length: 64,000 characters.",
      );
      return;
    }
    if (!source.trim()) {
      setError("Identify the publisher, video or recording source.");
      return;
    }
    let lesson: Lesson;
    if (kind === "youtube") {
      const id = getYouTubeId(url);
      if (!id) {
        setError("Use a valid HTTPS YouTube URL.");
        return;
      }
      lesson = {
        id: lessonId("youtube", id, cues),
        title: title.trim() || "My YouTube lesson",
        source: source.trim(),
        type: "youtube",
        videoId: id,
        cues,
      };
    } else {
      if (
        !file ||
        !file.type.startsWith("audio/") ||
        file.size > 50 * 1024 * 1024
      ) {
        setError("Choose an audio recording under 50 MB.");
        return;
      }
      lesson = {
        id: lessonId(
          "audio",
          `${file.name}:${file.size}:${file.lastModified}`,
          cues,
        ),
        title: title.trim() || "My course recording",
        type: "audio",
        source: source.trim(),
        fileName: file.name,
        cues,
      };
    }
    if (!studio.addLesson(lesson)) {
      setError(
        "The device library is full (30 imported lessons), or the lesson is invalid.",
      );
      return;
    }
    if (file && kind === "audio") attach(file, lesson.id);
    setSelected(lesson.id);
    setImporting(false);
    setTitle("");
    setSource("");
    setUrl("");
    setVtt("");
    setFile(null);
  }
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">LISTEN · DISCOVER · UNDERSTAND</span>
        <h1>
          Three passes. A deeper connection<span>.</span>
        </h1>
        <p>
          Start with the story. Notice the German. Then connect it to meaning.
        </p>
      </div>
      <div className="studio-library-toolbar">
        <label className="field-label">
          Your study library
          <select
            aria-label="Study lesson"
            value={lesson.id}
            onChange={(e) => setSelected(e.target.value)}
          >
            {library.map((l) => (
              <option value={l.id} key={l.id}>
                {l.title} ·{" "}
                {l.type === "narration"
                  ? "Synthetic narration"
                  : l.type === "youtube"
                    ? "YouTube"
                    : "Recording"}
              </option>
            ))}
          </select>
        </label>
        <button
          className="button secondary"
          onClick={() => {
            setImporting(!importing);
            setError("");
          }}
          aria-expanded={importing}
        >
          <Plus size={16} />
          {importing ? "Close import" : "Add YouTube / audio"}
        </button>
        <button className="button subtle" onClick={onResources}>
          Existing source library ↗
        </button>
      </div>
      {storageError && (
        <p className="notice" role="alert">
          {storageError}
        </p>
      )}
      {importing && (
        <form className="card studio-import" onSubmit={importLesson}>
          <div className="section-heading">
            <h2>Add a three-pass lesson</h2>
            <span className="pill">DEVICE LIBRARY</span>
          </div>
          <p className="micro">
            Use material you may access. Import matching captions manually; the
            app does not download videos, scrape captions or generate
            translations. Notes and transcripts stay on this device.
          </p>
          <div className="import-fields">
            <label className="field-label">
              Media type
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as "youtube" | "audio")}
              >
                <option value="youtube">YouTube video</option>
                <option value="audio">Audio recording</option>
              </select>
            </label>
            <label className="field-label">
              Lesson title
              <input
                value={title}
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>
          <label className="field-label">
            Source / book, edition, unit and track
            <input
              required
              maxLength={300}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Source name and a reference you can identify"
            />
          </label>
          {kind === "youtube" ? (
            <label className="field-label">
              YouTube URL
              <input
                type="url"
                required
                value={url}
                maxLength={500}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
              />
            </label>
          ) : (
            <label className="field-label">
              Audio file (session-only)
              <input
                type="file"
                accept="audio/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          )}
          <label className="field-label">
            Matching WebVTT transcript
            <textarea
              required
              maxLength={64000}
              className="vtt-editor"
              value={vtt}
              onChange={(e) => setVtt(e.target.value)}
              placeholder={
                "WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nGuten Morgen! | Good morning!"
              }
            />
          </label>
          <button className="button primary" type="submit">
            Add to my library <ArrowRight size={16} />
          </button>
        </form>
      )}
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
      <article className="card three-pass-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {lesson.type === "narration"
                ? "ORIGINAL SYNTHETIC PRACTICE"
                : lesson.type === "audio"
                  ? "YOUR COURSE RECORDING"
                  : "YOUTUBE CONTEXT"}
            </span>
            <h2>{lesson.title}</h2>
            <p className="micro">Source: {lesson.source}</p>
          </div>
          <span className="pill">{progress.completed.length}/3 passes</span>
        </div>
        <div className="pass-tabs" aria-label="Listening passes">
          {["Listen & feel", "Listen & discover", "Listen & understand"].map(
            (label, i) => (
              <button
                key={label}
                className={pass === i ? "selected" : ""}
                aria-current={pass === i ? "step" : undefined}
                disabled={!canOpenPass(progress, i)}
                onClick={() => studio.selectPass(lesson.id, i)}
              >
                <span>
                  {progress.completed.includes(i) ? (
                    <Check size={16} />
                  ) : canOpenPass(progress, i) ? (
                    String(i + 1).padStart(2, "0")
                  ) : (
                    <Lock size={14} />
                  )}
                </span>
                <div>
                  <strong>{label}</strong>
                  <small>
                    {
                      [
                        "No app transcript",
                        "German transcript",
                        "German + English",
                      ][i]
                    }
                  </small>
                </div>
              </button>
            ),
          )}
        </div>
        <div className="study-player">
          <div className="player-banner">
            <Volume2 size={22} />
            <p>
              {lesson.type === "narration"
                ? "Synthetic voices are useful practice, not a native-speaker recording."
                : "Listen to the transcript segment before completing this pass."}
            </p>
          </div>
          {lesson.type === "narration" ? (
            <NarrationPlayer
              key={`${lesson.id}-${pass}`}
              cues={lesson.cues}
              onCue={setCue}
              onComplete={end}
            />
          ) : lesson.type === "youtube" ? (
            consent ? (
              <YouTubePlayer
                key={`${lesson.id}-${pass}`}
                videoId={lesson.videoId!}
                cues={lesson.cues}
                onCue={setCue}
                onComplete={end}
              />
            ) : (
              <div className="video-prompt">
                <h3>Ready for a real voice?</h3>
                <p>
                  Loading this player connects to YouTube. Choose a video
                  without burned-in subtitles for the first pass.
                </p>
                <button
                  className="button primary"
                  onClick={() => setConsent(true)}
                >
                  Load YouTube study player
                </button>
              </div>
            )
          ) : blobUrls[lesson.id] ? (
            <FilePlayer
              key={`${lesson.id}-${pass}`}
              url={blobUrls[lesson.id]}
              cues={lesson.cues}
              onCue={setCue}
              onComplete={end}
            />
          ) : (
            <label className="field-label">
              Reattach the recording: {lesson.fileName}
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (
                    !f ||
                    !f.type.startsWith("audio/") ||
                    f.size > 50 * 1024 * 1024
                  ) {
                    setError("Choose an audio file under 50 MB.");
                    return;
                  }
                  attach(f, lesson.id);
                }}
              />
              <small>
                The transcript and progress were saved. Audio files must be
                reselected after a page reload.
              </small>
            </label>
          )}
        </div>
        {pass === 0 ? (
          <label className="field-label listening-notes">
            What did you hear?
            <textarea
              value={progress.notes}
              maxLength={5000}
              onChange={(e) => studio.notes(lesson.id, e.target.value)}
              placeholder="Note the situation, keywords and main ideas. You do not need every word."
            />
            <small>
              Notes are saved on this device, separately for each account.
            </small>
          </label>
        ) : (
          <section className="study-transcript">
            <div className="section-heading">
              <h3>
                {pass === 1
                  ? "Follow the German."
                  : "Connect sound and meaning."}
              </h3>
              <span className="micro">
                Click a word for its meaning. Use Grammar insight for the
                sentence note.
              </span>
            </div>
            {lesson.cues.map((c, i) => (
              <div
                key={i}
                className={"study-cue " + (i === cue ? "current" : "")}
              >
                <p className="cue-german">
                  <GermanText text={c.de} />
                </p>
                <button
                  type="button"
                  className="button subtle cue-insight"
                  aria-label={`Grammar insight for sentence ${i + 1}`}
                  onClick={() => setInsight(insight === i ? null : i)}
                >
                  Grammar insight
                </button>
                {pass === 2 && (
                  <p lang="en">
                    {c.en || "No translation supplied for this cue."}
                  </p>
                )}
                {insight === i && (
                  <div className="cue-grammar">
                    <span className="eyebrow">WRITING & SPEAKING INSIGHT</span>
                    <p>
                      {c.grammar ||
                        "No authored grammar note is available for this imported cue. The original reading studio remains available for curated grammar and word lookup."}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
        <div className="pass-completion">
          <p role="status">
            {progress.completed.includes(pass)
              ? "This pass is complete."
              : heard
                ? "Playback complete. You can finish this pass."
                : "Play the full segment to unlock completion."}
          </p>
          <button
            className="button primary"
            disabled={!heard || progress.completed.includes(pass)}
            onClick={() => studio.complete(lesson.id, pass, heard, seconds)}
          >
            {progress.completed.includes(pass)
              ? "Completed"
              : pass === 2
                ? "Complete lesson · +50 XP once"
                : "Complete pass & continue"}{" "}
            <Check size={16} />
          </button>
        </div>
        {state.rewarded.includes(lesson.id) && (
          <p className="success">
            All three passes completed. This lesson’s 50 XP reward has already
            been recorded.
          </p>
        )}
        <p className="micro">
          After switching passes or reloading, playback starts again. Completed
          passes can be replayed without earning duplicate XP. Three-pass
          progress does not replace your separate four-step vocabulary workflow.
        </p>
      </article>
    </>
  );
}
