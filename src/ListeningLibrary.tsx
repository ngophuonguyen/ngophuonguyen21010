import { useState } from "react";
const lessons = [
  {
    id: "easy-conversation",
    title: "Starting a conversation",
    level: "B1–B2",
    source: "Easy German",
    url: "https://www.youtube.com/watch?v=yv5ZHXAeN00",
    video: "yv5ZHXAeN00",
    description:
      "Street interviews about meeting people and starting conversations. Suggested study level: B1–B2.",
  },
  {
    id: "easy-life-germany",
    title: "Life and work in Germany",
    level: "B1–B2",
    source: "Easy German",
    url: "https://www.youtube.com/watch?v=OyuXSJ9pG6M",
    video: "OyuXSJ9pG6M",
    description:
      "People who moved to Germany share their experiences. Listen for one opportunity and one challenge.",
  },
  {
    id: "goethe-b1",
    title: "Goethe B1 · listening practice",
    level: "B1",
    source: "Goethe-Institut",
    url: "https://www.goethe.de/de/spr/prf/ueb/pb1.html",
    video: "",
    description:
      "Official exam practice. Open the source for the audio, question booklet and official answers. Revisit Part 4 when needed.",
  },
  {
    id: "goethe-b2",
    title: "Goethe B2 · listening practice",
    level: "B2",
    source: "Goethe-Institut",
    url: "https://www.goethe.de/ins/de/de/prf/gzb2/ue9.html",
    video: "",
    description:
      "Official B2 sample material. Follow the instructions at the source, then compare with the official answers.",
  },
  {
    id: "sicher-hueber",
    title: "Sicher! · course resources",
    level: "B1+–B2",
    source: "Hueber",
    url: "https://www.hueber.de/reihe/sicher/lernen",
    video: "",
    description:
      "Publisher resources for Sicher!. Choose the edition and unit matching your own book. Some resources may require access through the publisher.",
  },
];
export function ListeningLibrary({
  listened,
  mark,
  blocked,
}: {
  listened: string[];
  mark: (id: string, v: boolean) => void;
  blocked: boolean;
}) {
  const [id, setId] = useState(lessons[0].id),
    [filter, setFilter] = useState("All"),
    [play, setPlay] = useState(false);
  const current = lessons.find((x) => x.id === id)!;
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">REAL VOICES · REAL CONTEXT</span>
        <h1>
          Listen beyond the textbook<span>.</span>
        </h1>
        <p>
          Native-speaker video, official exam practice, and publisher resources.
        </p>
      </div>
      <div className="section-heading">
        <span>
          {listened.length} of {lessons.length} sources practiced
        </span>
        <select
          aria-label="Listening level"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>B1</option>
          <option>B2</option>
        </select>
      </div>
      <div className="listening-grid">
        <div className="source-list">
          {lessons
            .filter((l) => filter === "All" || l.level.includes(filter))
            .map((l) => (
              <button
                className={
                  "card source-card " + (l.id === id ? "selected" : "")
                }
                key={l.id}
                onClick={() => {
                  setId(l.id);
                  setPlay(false);
                }}
              >
                <span className="eyebrow">
                  {l.level} ·{" "}
                  {listened.includes(l.id) ? "Practiced" : "Explore"}
                </span>
                <h3>{l.title}</h3>
                <small>{l.source}</small>
              </button>
            ))}
        </div>
        <article className="card source-detail">
          <span className="pill">
            {current.level} · {current.source}
          </span>
          <h2>{current.title}</h2>
          <p>{current.description}</p>
          {current.video &&
            (play ? (
              <iframe
                title={current.title}
                src={"https://www.youtube-nocookie.com/embed/" + current.video}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="video-prompt">
                <span className="orb-play">▶</span>
                <h3>A little listening goes a long way.</h3>
                <p>
                  Loading the player connects to YouTube. You can also open the
                  source directly.
                </p>
                <button
                  className="button primary"
                  onClick={() => setPlay(true)}
                >
                  Load YouTube player
                </button>
              </div>
            ))}
          <a
            className="button secondary"
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open {current.source} ↗
          </a>
          <div className="practice-steps">
            <h3>A focused, ten-minute session.</h3>
            <ol>
              <li>
                Listen to a short section without subtitles. Note the situation
                and two main ideas.
              </li>
              <li>
                Listen again with available captions or the official transcript.
                Collect three useful expressions.
              </li>
              <li>
                Summarize what you heard in German. For exam tasks, check the
                official answers at the source.
              </li>
            </ol>
          </div>
          <label className="check-label">
            <input
              type="checkbox"
              disabled={blocked}
              checked={listened.includes(id)}
              onChange={(e) => mark(id, e.target.checked)}
            />{" "}
            I practiced with this source.
          </label>
          <p className="micro">
            Study prompts are authored for this app. Source content and official
            answers remain with their publishers. If embedding is blocked, use
            the source link.
          </p>
        </article>
      </div>
    </>
  );
}
