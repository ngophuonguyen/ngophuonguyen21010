import { Localized } from "../language/Language";
import { useEffect, useRef, useState } from "react";
import { addRange, coveredSeconds, formatTime, type Cue } from "./model";
type Player = {
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  getPlaybackRate: () => number;
  pauseVideo: () => void;
  unloadModule: (name: string) => void;
  destroy: () => void;
};
type Api = {
  Player: new (
    el: HTMLElement,
    options: {
      videoId: string;
      host: string;
      playerVars: Record<string, string | number>;
      events: Record<string, (event: { target: Player; data: number }) => void>;
    },
  ) => Player;
};
let apiPromise: Promise<Api> | null = null;
function loadApi(): Promise<Api> {
  const win = window as unknown as {
    YT?: Api;
    onYouTubeIframeAPIReady?: () => void;
  };
  if (win.YT?.Player) return Promise.resolve(win.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    let finished = false;
    const previous = win.onYouTubeIframeAPIReady;
    const timeout = setTimeout(() => fail(), 15000);
    function fail() {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      apiPromise = null;
      document
        .querySelector('script[src="https://www.youtube.com/iframe_api"]')
        ?.remove();
      reject(
        new Error(
          "YouTube player could not load. Open the source link or retry.",
        ),
      );
    }
    win.onYouTubeIframeAPIReady = () => {
      try {
        previous?.();
      } finally {
        if (finished || !win.YT) return;
        finished = true;
        clearTimeout(timeout);
        resolve(win.YT);
      }
    };
    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener(
      "error",
      () => {
        script?.remove();
        fail();
      },
      { once: true },
    );
  });
  return apiPromise;
}
export default function YouTubePlayer({
  videoId,
  cues,
  onCue,
  onComplete,
}: {
  videoId: string;
  cues: Cue[];
  onCue: (n: number) => void;
  onComplete: (seconds: number) => void;
}) {
  const host = useRef<HTMLDivElement>(null),
    callbacks = useRef({ onCue, onComplete }),
    [error, setError] = useState(""),
    [ready, setReady] = useState(false),
    [coverage, setCoverage] = useState(0),
    [retry, setRetry] = useState(0);
  callbacks.current = { onCue, onComplete };
  useEffect(() => {
    let disposed = false,
      player: Player | null = null,
      timer: ReturnType<typeof setInterval> | undefined,
      last: {
        position: number;
        wall: number;
      } | null = null,
      ranges: [number, number][] = [];
    let actualSeconds = 0,
      reported = false;
    const start = cues[0].start,
      end = cues.at(-1)!.end;
    setReady(false);
    setError("");
    setCoverage(0);
    const sample = (final = false) => {
      if (!player) return;
      try {
        const position = player.getCurrentTime(),
          wall = performance.now();
        const playing = player.getPlayerState() === 1;
        const index = cues.findIndex(
          (c) => position >= c.start && position < c.end,
        );
        callbacks.current.onCue(index);
        if ((playing || final) && last) {
          const delta = position - last.position,
            seconds = (wall - last.wall) / 1000,
            rate = player.getPlaybackRate() || 1;
          if (
            seconds > 0 &&
            seconds < 2 &&
            delta > 0 &&
            delta <= seconds * rate + 0.8
          ) {
            const a = Math.max(start, last.position),
              b = Math.min(end, position);
            if (b > a) {
              ranges = addRange(ranges, a, b);
              actualSeconds += Math.min(seconds, (b - a) / rate);
            }
          }
        }
        last = playing ? { position, wall } : null;
        const covered = coveredSeconds(ranges),
          needed = end - start;
        setCoverage(Math.min(100, Math.round((covered / needed) * 100)));
        if (!reported && covered >= needed * 0.98) {
          reported = true;
          player.pauseVideo();
          callbacks.current.onComplete(Math.max(1, actualSeconds));
        }
        if (position >= end && playing) {
          player.pauseVideo();
          if (!reported)
            setError(
              "The transcript segment ended before enough audio was played. Replay the missed section to finish this pass.",
            );
        }
      } catch {
        last = null;
      }
    };
    void loadApi()
      .then((api) => {
        if (disposed || !host.current) return;
        const el = document.createElement("div");
        host.current.replaceChildren(el);
        player = new api.Player(el, {
          host: "https://www.youtube-nocookie.com",
          videoId,
          playerVars: {
            controls: 1,
            playsinline: 1,
            rel: 0,
            cc_load_policy: 0,
            start: Math.floor(start),
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (disposed) return;
              setReady(true);
              try {
                event.target.unloadModule("captions");
              } catch {}
              timer = setInterval(() => sample(), 250);
            },
            onApiChange: (event) => {
              try {
                event.target.unloadModule("captions");
              } catch {}
            },
            onStateChange: () => {
              sample(true);
            },
            onError: () => {
              if (!disposed) {
                setError(
                  "YouTube cannot play this video here. The source may block embedding or require sign-in.",
                );
                setReady(false);
              }
            },
          },
        });
      })
      .catch((e) => {
        if (!disposed) setError(e.message);
      });
    return () => {
      disposed = true;
      if (timer) clearInterval(timer);
      player?.destroy();
    };
  }, [videoId, cues, retry]);
  return (
    <Localized>
      {
        <section className="youtube-study-player">
          <div ref={host} className="youtube-study-stage" />
          {!ready && !error && <p role="status">Loading YouTube player…</p>}
          <div className="section-heading">
            <span className="micro">
              Transcript segment: {formatTime(cues[0].start)}–
              {formatTime(cues.at(-1)!.end)} · {coverage}% played
            </span>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on YouTube ↗
            </a>
          </div>
          {error && (
            <div className="notice" role="alert">
              <p>{error}</p>
              <button
                className="button secondary"
                onClick={() => setRetry((n) => n + 1)}
              >
                Reload player
              </button>
            </div>
          )}
          <p className="micro">
            The app hides its transcript in pass 1. Platform captions or
            subtitles burned into the video may still appear. Seeking ahead does
            not count as listening.
          </p>
        </section>
      }
    </Localized>
  );
}
