import { useEffect, useRef, useState } from "react";
import { addRange, coveredSeconds, type Cue } from "./model";
export default function FilePlayer({
  url,
  cues,
  onCue,
  onComplete,
}: {
  url: string;
  cues: Cue[];
  onCue: (n: number) => void;
  onComplete: (seconds: number) => void;
}) {
  const ref = useRef<HTMLAudioElement>(null),
    ranges = useRef<[number, number][]>([]),
    last = useRef<{ position: number; wall: number } | null>(null),
    seconds = useRef(0),
    reported = useRef(false),
    [progress, setProgress] = useState(0),
    [error, setError] = useState("");
  useEffect(
    () => () => {
      ref.current?.pause();
    },
    [],
  );
  const track = (final = false) => {
    const a = ref.current;
    if (!a) return;
    const position = a.currentTime,
      now = performance.now(),
      start = cues[0].start,
      end = cues.at(-1)!.end;
    onCue(cues.findIndex((c) => position >= c.start && position < c.end));
    if ((!a.paused || final) && last.current) {
      const delta = position - last.current.position,
        wall = (now - last.current.wall) / 1000;
      if (
        wall > 0 &&
        wall < 2 &&
        delta > 0 &&
        delta <= wall * a.playbackRate + 0.5
      ) {
        const left = Math.max(start, last.current.position),
          right = Math.min(end, position);
        if (right > left) {
          ranges.current = addRange(ranges.current, left, right);
          seconds.current += Math.min(wall, (right - left) / a.playbackRate);
        }
      }
    }
    last.current = a.paused ? null : { position, wall: now };
    const fraction = coveredSeconds(ranges.current) / (end - start);
    setProgress(Math.min(100, Math.round(fraction * 100)));
    if (!reported.current && fraction >= 0.98) {
      reported.current = true;
      onComplete(Math.max(1, seconds.current));
    }
    if (position >= end && !a.paused) a.pause();
  };
  return (
    <div className="file-study-player">
      <audio
        controls
        ref={ref}
        src={url}
        onLoadedMetadata={() => {
          const a = ref.current;
          if (a && a.duration + 0.5 < cues.at(-1)!.end)
            setError(
              "This recording is shorter than the transcript. Check the selected file and timings.",
            );
        }}
        onTimeUpdate={() => track(true)}
        onPlay={() => {
          if (ref.current)
            last.current = {
              position: ref.current.currentTime,
              wall: performance.now(),
            };
        }}
        onPause={() => {
          track(true);
          last.current = null;
        }}
        onEnded={() => track(true)}
        onSeeking={() => {
          last.current = null;
        }}
        onSeeked={() => {
          const a = ref.current;
          if (a && !a.paused)
            last.current = { position: a.currentTime, wall: performance.now() };
        }}
        onError={() =>
          setError(
            "The recording cannot be played. Try a supported MP3, WAV or M4A file.",
          )
        }
      />
      <label className="micro">
        Recording speed
        <select
          aria-label="Recording speed"
          defaultValue="1"
          onChange={(e) => {
            if (ref.current) ref.current.playbackRate = Number(e.target.value);
          }}
        >
          <option value=".75">0.75×</option>
          <option value="1">1×</option>
          <option value="1.25">1.25×</option>
        </select>
      </label>
      <p className="micro">
        {progress}% of the transcript segment played. Seeking ahead does not
        complete a pass.
      </p>
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
