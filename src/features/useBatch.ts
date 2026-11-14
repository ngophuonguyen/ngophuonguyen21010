import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { freshBatch, validBatch, type BatchState } from "./batchState";
export function useBatch(userId: string | null, authLoading: boolean) {
  const [state, setState] = useState<BatchState>(freshBatch),
    [readyScope, setReadyScope] = useState(""),
    [dirty, setDirty] = useState(false),
    [status, setStatus] = useState("Loading practice…"),
    [retry, setRetry] = useState(0);
  const scope = `deutsch-batch-v3:${userId || "guest"}:evening-01`;
  const ready = readyScope === scope && !authLoading;
  useEffect(() => {
    let alive = true;
    setReadyScope("");
    setDirty(false);
    let cached = freshBatch(),
      pending = false;
    try {
      const x = JSON.parse(localStorage.getItem(scope) || "null");
      if (x && validBatch(x.state)) {
        cached = x.state;
        pending = x.dirty === true;
      }
    } catch {}
    setState(cached);
    if (authLoading) return;
    const load = async () => {
      if (userId && supabase) {
        const { data, error } = await supabase
          .from("batch_progress")
          .select("state")
          .eq("user_id", userId)
          .eq("batch_id", "evening-01")
          .maybeSingle();
        if (!alive) return;
        if (error) {
          setStatus("Saved on this device. Cloud connection unavailable.");
        } else if (!pending && data && validBatch(data.state)) {
          cached = data.state;
          setState(cached);
          setStatus("Practice loaded from your account.");
        } else setStatus("Practice ready.");
      } else setStatus("Saved on this device.");
      if (alive) {
        setDirty(pending);
        setReadyScope(scope);
      }
    };
    void load().catch(() => {
      if (alive) {
        setStatus("Cloud unavailable. Device practice is available.");
        setReadyScope(scope);
      }
    });
    return () => {
      alive = false;
    };
  }, [scope, authLoading]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(scope, JSON.stringify({ state, dirty }));
    } catch {
      setStatus("Device storage unavailable. Keep this page open.");
    }
  }, [state, dirty, scope, ready]);
  useEffect(() => {
    if (!ready || !dirty || !userId || !supabase) return;
    let active = true;
    const timer = setTimeout(async () => {
      setStatus("Saving practice…");
      try {
        const { error } = await supabase!
          .from("batch_progress")
          .upsert(
            { user_id: userId, batch_id: "evening-01", state },
            { onConflict: "user_id,batch_id" },
          );
        if (!active) return;
        if (error) throw error;
        setDirty(false);
        setStatus("Practice saved to your account.");
      } catch {
        if (active) setStatus("Saved on this device. Cloud save pending.");
      }
    }, 700);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [state, ready, dirty, userId, retry]);
  useEffect(() => {
    const online = () => setRetry((n) => n + 1);
    window.addEventListener("online", online);
    return () => window.removeEventListener("online", online);
  }, []);
  function update(fn: (s: BatchState) => BatchState) {
    if (!ready) return;
    setState((s) => {
      const next = fn(s);
      return validBatch(next) ? next : s;
    });
    setDirty(true);
    setStatus(userId ? "Cloud save pending." : "Saved on this device.");
  }
  return { state, update, ready, status, retry: () => setRetry((n) => n + 1) };
}
