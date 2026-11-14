import { supabase } from "../supabase";
import { validFeedback, type Feedback } from "./batchState";
export const aiEnabled = import.meta.env.VITE_AI_FEEDBACK_ENABLED === "true";
export async function evaluateGerman(
  text: string,
  task: string,
  targets: string[],
  signal: AbortSignal,
): Promise<Feedback> {
  if (!supabase || !aiEnabled)
    throw new Error(
      "AI assessment is not connected. Use the clearly labeled self-review checklist for unscored practice.",
    );
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Sign in to request AI feedback.");
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const { data, error } = await supabase.functions.invoke("evaluate-german", {
    body: { text, task, targets },
    signal,
  });
  if (error)
    throw new Error(
      "AI assessment is currently unavailable. Your draft is safe; retry or use self-review.",
    );
  if (!validFeedback(data))
    throw new Error(
      "The feedback format was invalid. No score has been saved.",
    );
  return data;
}
