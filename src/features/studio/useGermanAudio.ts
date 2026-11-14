import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase";
export type AudioStatus = "idle" | "loading" | "playing" | "paused";
export function useGermanAudio() {
  const [status, setStatus] = useState<AudioStatus>("idle"),
    [error, setError] = useState(""),
    [rate, setRate] = useState(1),
    [volume, setVolume] = useState(0.8),
    [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const current = useRef<{
      generation: number;
      utterance: SpeechSynthesisUtterance | null;
      media: HTMLAudioElement | null;
      request: AbortController | null;
      url: string;
    }>({ generation: 0, utterance: null, media: null, request: null, url: "" }),
    owner = useRef(Symbol("german-audio")),
    settings = useRef({ rate, volume });
  settings.current = { rate, volume };
  const stop = useCallback(() => {
    const c = current.current;
    c.generation++;
    c.request?.abort();
    c.request = null;
    if (c.utterance) window.speechSynthesis?.cancel();
    c.utterance = null;
    if (c.media) {
      c.media.onended = null;
      c.media.pause();
      c.media.src = "";
      c.media = null;
    }
    if (c.url) {
      URL.revokeObjectURL(c.url);
      c.url = "";
    }
    setStatus("idle");
  }, []);
  useEffect(() => {
    const update = () =>
      setVoices(
        window.speechSynthesis
          ?.getVoices()
          .filter((v) => v.lang.toLowerCase().startsWith("de")) ?? [],
      );
    update();
    window.speechSynthesis?.addEventListener("voiceschanged", update);
    const interrupt = (e: Event) => {
      if ((e as CustomEvent).detail !== owner.current) stop();
    };
    window.addEventListener("deutsch-audio-start", interrupt);
    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", update);
      window.removeEventListener("deutsch-audio-start", interrupt);
      stop();
    };
  }, [stop]);
  useEffect(() => {
    if (current.current.media) {
      current.current.media.volume = volume;
      current.current.media.playbackRate = rate;
    }
  }, [rate, volume]);
  const speak = useCallback(
    async (text: string, onEnded?: () => void) => {
      stop();
      setError("");
      if (!text.trim() || text.length > 5000) {
        setError("Choose a German text of 1–5,000 characters.");
        return;
      }
      window.dispatchEvent(
        new CustomEvent("deutsch-audio-start", { detail: owner.current }),
      );
      const c = current.current,
        ticket = c.generation;
      const finish = () => {
        if (c.generation !== ticket) return;
        c.utterance = null;
        setStatus("idle");
        onEnded?.();
      };
      const endpoint = import.meta.env.VITE_TTS_ENDPOINT?.trim();
      if (endpoint) {
        try {
          const url = new URL(endpoint, window.location.origin);
          const local = ["localhost", "127.0.0.1"].includes(url.hostname);
          if (
            (url.protocol !== "https:" && !local) ||
            url.username ||
            url.password
          )
            throw new Error(
              "Use an HTTPS TTS endpoint without embedded credentials.",
            );
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };
          const configuredOrigin = import.meta.env.VITE_SUPABASE_URL
            ? new URL(import.meta.env.VITE_SUPABASE_URL).origin
            : null;
          // Forward a Supabase token only to the configured Supabase project, never an arbitrary host.
          if (supabase && url.origin === configuredOrigin) {
            const {
              data: { session },
            } = await supabase.auth.getSession();
            if (c.generation !== ticket) return;
            if (!session) throw new Error("Sign in to use neural audio.");
            headers.Authorization = `Bearer ${session.access_token}`;
            headers.apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
          }
          const controller = new AbortController();
          c.request = controller;
          const timeout = setTimeout(() => controller.abort(), 30000);
          setStatus("loading");
          let blob: Blob;
          try {
            const response = await fetch(url, {
              method: "POST",
              credentials: "same-origin",
              headers,
              signal: controller.signal,
              body: JSON.stringify({
                text,
                language: "de-DE",
                voice: import.meta.env.VITE_TTS_VOICE || "de-DE-KatjaNeural",
              }),
            });
            if (!response.ok)
              throw new Error(
                "Neural audio service is unavailable. Check its authentication or switch to device speech in the deployment configuration.",
              );
            if (
              !response.headers
                .get("content-type")
                ?.toLowerCase()
                .startsWith("audio/")
            )
              throw new Error("The TTS service did not return audio.");
            blob = await response.blob();
          } finally {
            clearTimeout(timeout);
          }
          if (c.generation !== ticket) return;
          if (!blob.size || blob.size > 15 * 1024 * 1024)
            throw new Error("Audio response is empty or too large.");
          c.url = URL.createObjectURL(blob);
          const media = new Audio(c.url);
          c.media = media;
          media.volume = settings.current.volume;
          media.playbackRate = settings.current.rate;
          media.onended = finish;
          media.onerror = () => {
            if (c.generation === ticket) {
              setError("Neural audio could not be played.");
              setStatus("idle");
            }
          };
          await media.play();
          if (c.generation === ticket) setStatus("playing");
        } catch (e) {
          if (c.generation === ticket) {
            setError(
              e instanceof Error && e.name !== "AbortError"
                ? e.message
                : "The audio request timed out or was interrupted.",
            );
            setStatus("idle");
          }
        }
        return;
      }
      if (!window.speechSynthesis) {
        setError(
          "Speech playback is unavailable. Use a recording or type/read the prompt.",
        );
        return;
      }
      const available = window.speechSynthesis
        .getVoices()
        .filter((v) => v.lang.toLowerCase().startsWith("de"));
      const voice =
        available.find((v) => /neural|natural|online|google/i.test(v.name)) ??
        available[0];
      if (!voice) {
        setError(
          "No German device voice is installed. Install a de-DE voice or connect the neural audio endpoint.",
        );
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "de-DE";
      u.voice = voice;
      u.rate = settings.current.rate;
      u.volume = settings.current.volume;
      u.onend = finish;
      u.onerror = (e) => {
        if (c.generation === ticket) {
          setStatus("idle");
          if (!["canceled", "interrupted"].includes(e.error))
            setError("Device speech playback failed.");
        }
      };
      c.utterance = u;
      setStatus("playing");
      window.speechSynthesis.speak(u);
    },
    [stop],
  );
  const pause = () => {
    const c = current.current;
    if (c.media) c.media.pause();
    else window.speechSynthesis?.pause();
    setStatus("paused");
  };
  const resume = async () => {
    const c = current.current;
    try {
      if (c.media && !c.media.ended) {
        await c.media.play();
        setStatus("playing");
        return true;
      }
      if (c.utterance) {
        window.speechSynthesis?.resume();
        setStatus("playing");
        return true;
      }
    } catch {
      setError("Playback could not resume. Try restarting the audio.");
    }
    return false;
  };
  return {
    status,
    error,
    rate,
    setRate,
    volume,
    setVolume,
    voices,
    speak,
    stop,
    pause,
    resume,
    mode: import.meta.env.VITE_TTS_ENDPOINT
      ? "Neural service · synthetic audio"
      : "German device voice · synthetic audio",
  };
}
