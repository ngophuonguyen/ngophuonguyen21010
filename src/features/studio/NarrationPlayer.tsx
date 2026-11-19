import { Localized } from "../language/Language";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { useGermanAudio } from "./useGermanAudio";
import type { Cue } from "./model";
export default function NarrationPlayer({
  cues,
  onCue,
  onComplete,
}: {
  cues: Cue[];
  onCue: (n: number) => void;
  onComplete: (seconds: number) => void;
}) {
  const audio = useGermanAudio(),
    [index, setIndex] = useState(0),
    [ended, setEnded] = useState(false),
    heard = useRef(new Set<number>()),
    alive = useRef(true),
    callbacks = useRef({ onCue, onComplete }),
    playRef = useRef<(n: number) => void>(() => {}),
    elapsed = useRef(0),
    started = useRef<number | null>(null);
  callbacks.current = { onCue, onComplete };
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      audio.stop();
    };
  }, [audio.stop]);
  useEffect(() => {
    if (audio.status === "playing") {
      started.current = performance.now();
    } else if (started.current !== null) {
      elapsed.current += (performance.now() - started.current) / 1000;
      started.current = null;
    }
    return () => {
      if (started.current !== null) {
        elapsed.current += (performance.now() - started.current) / 1000;
        started.current = null;
      }
    };
  }, [audio.status]);
  const playAt = (n: number) => {
    if (!cues[n]) return;
    setIndex(n);
    setEnded(false);
    callbacks.current.onCue(n);
    void audio.speak(cues[n].de, () => {
      if (!alive.current) return;
      heard.current.add(n);
      if (n + 1 < cues.length) playRef.current(n + 1);
      else {
        setEnded(true);
        const total =
          elapsed.current +
          (started.current === null
            ? 0
            : (performance.now() - started.current) / 1000);
        if (heard.current.size === cues.length)
          callbacks.current.onComplete(Math.max(1, total));
      }
    });
  };
  playRef.current = playAt;
  return (
    <Localized>
      {
        <div className="narration-player">
          <div className="player-controls">
            <button
              className="button primary"
              disabled={audio.status === "loading"}
              onClick={() => {
                if (audio.status === "playing") audio.pause();
                else if (audio.status === "paused")
                  void audio.resume().then((ok) => {
                    if (!ok) playAt(index);
                  });
                else if (ended) {
                  heard.current.clear();
                  elapsed.current = 0;
                  playAt(0);
                } else playAt(index);
              }}
            >
              {audio.status === "playing" ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )}{" "}
              {audio.status === "loading"
                ? "Loading neural audio…"
                : audio.status === "playing"
                  ? "Pause narration"
                  : audio.status === "paused"
                    ? "Resume narration"
                    : "Play narration"}
            </button>
            <button
              className="button secondary"
              aria-label="Restart narration"
              onClick={() => {
                audio.stop();
                heard.current.clear();
                elapsed.current = 0;
                setIndex(0);
                setEnded(false);
                onCue(0);
              }}
            >
              <RotateCcw size={16} />
            </button>
            <label>
              Speed
              <select
                aria-label="Narration speed"
                value={audio.rate}
                onChange={(e) => {
                  audio.setRate(Number(e.target.value));
                  if (audio.status !== "idle") {
                    audio.stop();
                  }
                }}
              >
                <option value="0.75">0.75×</option>
                <option value="1">1×</option>
                <option value="1.25">1.25×</option>
              </select>
            </label>
            <label className="volume-slider">
              <Volume2 size={16} />
              <input
                aria-label="Narration volume"
                type="range"
                min="0"
                max="1"
                step=".05"
                value={audio.volume}
                onChange={(e) => audio.setVolume(Number(e.target.value))}
              />
            </label>
          </div>
          <p className="micro">
            {audio.mode} · sentence {index + 1}/{cues.length}. Sentence timing
            is approximate; completion follows actual audio events.
          </p>
          {audio.error && (
            <p className="notice" role="alert">
              {audio.error}
            </p>
          )}
        </div>
      }
    </Localized>
  );
}
