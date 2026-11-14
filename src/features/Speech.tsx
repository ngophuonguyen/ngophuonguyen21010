import { useGermanAudio } from "./studio/useGermanAudio";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Volume2 } from "lucide-react";
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult:
    ((e: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
export function ListenButton({
  text,
  label = "Play audio prompt",
}: {
  text: string;
  label?: string;
}) {
  const audio = useGermanAudio();
  return (
    <>
      <button
        className="button secondary"
        disabled={audio.status === "loading"}
        onClick={() => {
          if (audio.status === "playing") audio.pause();
          else if (audio.status === "paused") void audio.resume();
          else void audio.speak(text);
        }}
      >
        <Volume2 size={16} />
        {audio.status === "loading"
          ? "Loading audio…"
          : audio.status === "playing"
            ? "Pause audio"
            : audio.status === "paused"
              ? "Resume audio"
              : label}
      </button>
      <small role="status">{audio.error || audio.mode}</small>
    </>
  );
}
export function Dictation({ onText }: { onText: (s: string) => void }) {
  const [recording, setRecording] = useState(false),
    [error, setError] = useState(""),
    ref = useRef<Recognition | null>(null);
  useEffect(() => () => ref.current?.abort(), []);
  return (
    <div>
      <button
        className="button secondary"
        onClick={() => {
          if (recording) {
            ref.current?.stop();
            return;
          }
          const C =
            (
              window as unknown as {
                SpeechRecognition?: new () => Recognition;
                webkitSpeechRecognition?: new () => Recognition;
              }
            ).SpeechRecognition ||
            (
              window as unknown as {
                webkitSpeechRecognition?: new () => Recognition;
              }
            ).webkitSpeechRecognition;
          if (!C) {
            setError(
              "Speech recognition is unavailable. Type your response instead.",
            );
            return;
          }
          const r = new C();
          ref.current = r;
          r.lang = "de-DE";
          r.interimResults = false;
          r.continuous = false;
          r.onresult = (e) =>
            onText(
              Array.from(e.results)
                .map((x) => x[0].transcript)
                .join(" "),
            );
          r.onerror = (e) => {
            setError(
              `Microphone or recognition error: ${e.error}. You can type instead.`,
            );
            setRecording(false);
          };
          r.onend = () => setRecording(false);
          try {
            r.start();
            setRecording(true);
            setError("");
          } catch {
            setError("Could not start speech recognition.");
          }
        }}
      >
        {recording ? <Square size={16} /> : <Mic size={16} />}{" "}
        {recording ? "Stop dictation" : "Speak in German"}
      </button>
      <p className="micro">
        Dictation may use your browser’s speech service. Check the transcript
        before submitting. Pronunciation is not scored.
      </p>
      {error && (
        <p role="status" className="notice">
          {error}
        </p>
      )}
    </div>
  );
}
