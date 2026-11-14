import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { vocabulary } from "../../content/course";
import {
  applyDecay,
  canOpenPass,
  emptyPass,
  finishPass,
  initialGame,
  readGame,
  practiceWord,
  reviewWord,
  validLesson,
  type GameState,
  type Lesson,
} from "./model";
function useController(scope: string) {
  const key = `deutsch-extras-v1:${scope}`;
  const [state, setState] = useState<GameState>(() => {
      try {
        return readGame(localStorage.getItem(key));
      } catch {
        return initialGame();
      }
    }),
    [lessons, setLessons] = useState<Lesson[]>(() => {
      try {
        const x = JSON.parse(localStorage.getItem(`${key}:lessons`) ?? "[]");
        return Array.isArray(x) ? x.filter(validLesson).slice(0, 30) : [];
      } catch {
        return [];
      }
    }),
    [storageError, setStorageError] = useState(""),
    [now, setNow] = useState(Date.now());
  useEffect(() => {
    const tick = () => {
      const time = Date.now();
      setNow(time);
      setState((s) => applyDecay(s, time));
    };
    const timer = setInterval(tick, 30000);
    window.addEventListener("focus", tick);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", tick);
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
      localStorage.setItem(`${key}:lessons`, JSON.stringify(lessons));
      setStorageError("");
    } catch {
      setStorageError(
        "Device storage is unavailable or full. New studio progress may not survive a reload.",
      );
    }
  }, [state, lessons, key]);
  return {
    practice: (id: string) => {
      if (vocabulary.some((w) => w.id === id))
        setState((s) => practiceWord(s, id, Date.now()));
    },
    state,
    now,
    lessons,
    storageError,
    due: vocabulary.filter((w) => (state.reviews[w.id]?.due ?? 0) <= now),
    review: (id: string, remembered: boolean) => {
      if (vocabulary.some((w) => w.id === id))
        setState((s) => reviewWord(s, id, remembered, Date.now()));
    },
    notes: (id: string, notes: string) =>
      setState((s) => ({
        ...s,
        listening: {
          ...s.listening,
          [id]: {
            ...(s.listening[id] ?? emptyPass()),
            notes: notes.slice(0, 5000),
          },
        },
      })),
    selectPass: (id: string, pass: number) =>
      setState((s) => {
        const p = s.listening[id] ?? emptyPass();
        return canOpenPass(p, pass)
          ? { ...s, listening: { ...s.listening, [id]: { ...p, pass } } }
          : s;
      }),
    complete: (id: string, pass: number, heard: boolean, seconds: number) =>
      setState((s) => finishPass(s, id, pass, heard, seconds, Date.now())),
    addLesson: (lesson: Lesson) => {
      if (!validLesson(lesson)) return false;
      if (lessons.some((l) => l.id === lesson.id)) return true;
      if (lessons.length >= 30) return false;
      setLessons((old) =>
        old.some((l) => l.id === lesson.id) ? old : [...old, lesson],
      );
      return true;
    },
  };
}
const Context = createContext<ReturnType<typeof useController> | null>(null);
export function StudioProvider({
  scope,
  children,
}: {
  scope: string;
  children: ReactNode;
}) {
  const value = useController(scope);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useStudio() {
  const c = useContext(Context);
  if (!c) throw new Error("StudioProvider is required.");
  return c;
}
