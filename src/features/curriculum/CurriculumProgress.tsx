import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { lessons } from "../../content/curriculum";
import { auditLessons } from "./quality";
import {
  freshDay,
  hydrateDays,
  readyToComplete,
  type DayProgress,
} from "./progress";
export const curriculumAudit = auditLessons(lessons);
function useController(scope: string) {
  const key = `deutsch-curriculum-v1:${scope}`;
  const [days, setDays] = useState(() => {
      try {
        return hydrateDays(
          localStorage.getItem(key),
          lessons,
          curriculumAudit.valid,
        );
      } catch {
        return {};
      }
    }),
    [error, setError] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(days));
      setError("");
    } catch {
      setError(
        "Device storage is unavailable. Daily drafts may not survive a reload.",
      );
    }
  }, [days, key]);
  return {
    days,
    error,
    completed: lessons
      .filter(
        (l) =>
          days[l.id]?.completed &&
          readyToComplete(l, days[l.id], curriculumAudit.valid),
      )
      .map((l) => l.day),
    edit: (day: number, patch: Partial<DayProgress>) => {
      const l = lessons.find((l) => l.day === day);
      if (!l) return;
      setDays((old) => {
        const next = { ...(old[l.id] ?? freshDay(l)), ...patch };
        next.completed =
          readyToComplete(l, next, curriculumAudit.valid) && next.completed;
        return { ...old, [l.id]: next };
      });
    },
    finish: (day: number) => {
      const l = lessons.find((l) => l.day === day);
      if (!l) return;
      setDays((old) => {
        const p = old[l.id] ?? freshDay(l);
        return readyToComplete(l, p, curriculumAudit.valid)
          ? { ...old, [l.id]: { ...p, completed: true } }
          : old;
      });
    },
  };
}
const Context = createContext<ReturnType<typeof useController> | null>(null);
export function CurriculumProvider({
  scope,
  children,
}: {
  scope: string;
  children: ReactNode;
}) {
  const value = useController(scope);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useCurriculum() {
  const c = useContext(Context);
  if (!c) throw Error("CurriculumProvider required");
  return c;
}
