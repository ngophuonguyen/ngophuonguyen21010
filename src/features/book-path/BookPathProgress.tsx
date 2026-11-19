import { auditBookUnits } from "./quality";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { bookUnits, getBookUnit } from "../../content/book-path/units";
import {
  freshUnit,
  hydrateUnits,
  unitReady,
  type BookUnitProgress,
} from "./progress";
export const bookPathAudit = auditBookUnits(bookUnits);
function useController(scope: string) {
  const key = `deutsch-book-path-v1:${scope}`;
  const [units, setUnits] = useState(() => {
      try {
        return hydrateUnits(localStorage.getItem(key), bookUnits);
      } catch {
        return {};
      }
    }),
    [error, setError] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(units));
      setError("");
    } catch {
      setError(
        "Book-practice drafts could not be saved on this device. Keep a copy before leaving.",
      );
    }
  }, [key, units]);
  return {
    units,
    error,
    completed: bookUnits
      .filter(
        (u) =>
          bookPathAudit.valid &&
          units[u.id]?.completed &&
          unitReady(u, units[u.id]),
      )
      .map((u) => u.day),
    edit: (day: number, patch: Partial<BookUnitProgress>) => {
      const u = getBookUnit(day);
      if (!u) return;
      setUnits((old) => {
        const p = { ...(old[u.id] ?? freshUnit(u)), ...patch };
        p.completed = bookPathAudit.valid && p.completed && unitReady(u, p);
        return { ...old, [u.id]: p };
      });
    },
    finish: (day: number) => {
      const u = getBookUnit(day);
      if (!u) return;
      setUnits((old) => {
        const p = old[u.id] ?? freshUnit(u);
        return bookPathAudit.valid && unitReady(u, p)
          ? { ...old, [u.id]: { ...p, completed: true } }
          : old;
      });
    },
  };
}
const Context = createContext<ReturnType<typeof useController> | null>(null);
export function BookPathProvider({
  scope,
  children,
}: {
  scope: string;
  children: ReactNode;
}) {
  const value = useController(scope);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useBookPath() {
  const c = useContext(Context);
  if (!c) throw Error("BookPathProvider required");
  return c;
}
