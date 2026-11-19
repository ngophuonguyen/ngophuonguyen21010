import { lazy, Suspense, useState, useEffect } from "react";
import {
  BookOpen,
  Headphones,
  Layers,
  LayoutDashboard,
  Route,
  Sparkles,
  Globe2,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { useLearning } from "./useLearning";
import { AccountPanel } from "./AccountPanel";
import {
  DictionaryProvider,
  DictionaryButton,
} from "./features/dictionary/Dictionary";
import BrandLogo from "./features/BrandLogo";
import { StudioProvider } from "./features/studio/StudioProgress";
import Leaderboard from "./features/studio/Leaderboard";
import { CurriculumProvider } from "./features/curriculum/CurriculumProgress";
import { CurriculumPlan } from "./features/curriculum/CurriculumPlan";
const DailyLesson = lazy(() => import("./features/curriculum/Curriculum"));
const Books = lazy(() => import("./features/books/Books"));
const ListeningStudio = lazy(() => import("./features/studio/ListeningStudio"));
const Review = lazy(() => import("./features/studio/Review"));
const Vocabulary = lazy(() => import("./features/Vocabulary"));
const Reading = lazy(() => import("./features/Reading"));
const Listening = lazy(() =>
  import("./ListeningLibrary").then((m) => ({ default: m.ListeningLibrary })),
);
const Grammar = lazy(() => import("./features/Grammar"));
import StudyHome from "./features/journey/StudyHome";
import CourseReview from "./features/journey/CourseReview";
import {
  readLocation,
  locationUrl,
  type Page,
} from "./features/journey/navigation";
const nav = [
  { id: "home", label: "Today", icon: LayoutDashboard },
  { id: "plan", label: "30-day course", icon: Route },
  { id: "books", label: "My library", icon: BookOpen },
  { id: "review", label: "Review my lessons", icon: RotateCcw },
  { id: "practice", label: "Practice tools", icon: Layers },
] as const;
const tools = [
  {
    id: "vocabulary",
    label: "Four-step vocabulary",
    description:
      "One independent six-word batch: introduction, sentence production, listening and a visual task.",
    icon: Layers,
  },
  {
    id: "listening",
    label: "Three-pass listening",
    description:
      "Practise a studio story or bring a recording and captions. Studio progress is separate from daily lessons.",
    icon: Headphones,
  },
  {
    id: "reading",
    label: "Interactive reading",
    description:
      "Two additional passages with word lookup, sentence translations and grammar insights.",
    icon: BookOpen,
  },
  {
    id: "grammar",
    label: "Foundation grammar",
    description:
      "An independent revision quiz. Its result does not complete a course day.",
    icon: Sparkles,
  },
  {
    id: "spaced",
    label: "Studio flashcards",
    description:
      "Spaced recall for the vocabulary studio’s original six words.",
    icon: RotateCcw,
  },
  {
    id: "leaderboard",
    label: "Practice ranks",
    description:
      "Your device’s studio XP, rank and decay rules, alongside labelled sample peers.",
    icon: Trophy,
  },
] as const;
export default function App() {
  const l = useLearning();
  return (
    <StudioProvider key={l.user?.id ?? "guest"} scope={l.user?.id ?? "guest"}>
      <DictionaryProvider>
        <CurriculumProvider scope={l.user?.id ?? "guest"}>
          <Workspace learning={l} />
        </CurriculumProvider>
      </DictionaryProvider>
    </StudioProvider>
  );
}
function Workspace({
  learning: l,
}: {
  learning: ReturnType<typeof useLearning>;
}) {
  const [location, setLocation] = useState(() =>
    readLocation(window.location.search),
  );
  const { page, day } = location;
  const scope = l.user?.id ?? "guest";
  const [last, setLast] = useState(() => {
    try {
      return Number(localStorage.getItem(`deutsch-last-day:${scope}`)) || 1;
    } catch {
      return 1;
    }
  });
  useEffect(() => {
    const back = () => setLocation(readLocation(window.location.search));
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);
  function navigate(next: Page, n = day, from?: "books" | "practice") {
    const target = { page: next, day: n, from };
    window.history.pushState(
      null,
      "",
      locationUrl(window.location.href, target),
    );
    setLocation(target);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const setPage = (next: Page) => navigate(next);
  useEffect(() => {
    if (page !== "day") return;
    setLast(day);
    try {
      localStorage.setItem(`deutsch-last-day:${scope}`, String(day));
    } catch {
      /* Course drafts have their own storage notice. */
    }
  }, [page, day, scope]);
  const openDay = (n: number) => {
    if (!Number.isInteger(n) || n < 1 || n > 30) return;
    navigate("day", n);
  };
  const optional = tools.some((t) => t.id === page) || page === "resources";
  const label =
    page === "day"
      ? `Day ${day}`
      : page === "resources"
        ? "Listening resources"
        : ([...nav, ...tools].find((n) => n.id === page)?.label ?? "Today");
  function complete(score: number) {
    l.recordAttempt(day, score, 5);
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to lesson
      </a>
      <aside className="main-sidebar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPage("home");
          }}
        >
          <BrandLogo />
        </a>
        <span className="nav-caption">YOUR LEARNING SPACE</span>
        <nav aria-label="Main navigation">
          {nav.map((n) => (
            <button
              key={n.id}
              className={
                page === n.id ||
                (page === "day" && n.id === "plan") ||
                (optional && n.id === "practice")
                  ? "active"
                  : ""
              }
              aria-current={
                page === n.id ||
                (page === "day" && n.id === "plan") ||
                (optional && n.id === "practice")
                  ? "page"
                  : undefined
              }
              onClick={() => setPage(n.id)}
            >
              <n.icon size={19} />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span>✧</span>
          <p lang="de">
            Kleine Schritte.
            <br />
            Große Möglichkeiten.
          </p>
          <small>Small steps. New possibilities.</small>
        </div>
        <div className="sidebar-profile">
          <span className="avatar">
            {l.user?.user_metadata.full_name?.[0] || "U"}
          </span>
          <div>
            <strong>{l.user ? "Your workspace" : "Uyên’s workspace"}</strong>
            <small>B1 → B2 · keep going</small>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span className="mobile-brand">
            <BrandLogo />
          </span>
          <div>
            <Globe2 size={15} />
            <span>Your space</span>
            <span>/</span>
            <strong>{label}</strong>
          </div>
          <DictionaryButton />
          <span className="pill level-pill">GERMAN · B1–B2</span>
        </header>
        <main id="main">
          <AccountPanel learning={l} />
          <Suspense
            fallback={
              <div className="card" role="status">
                Opening your studio…
              </div>
            }
          >
            <div inert={l.blocked}>
              {optional && (
                <div className="journey-context">
                  <button
                    className="button subtle"
                    onClick={() =>
                      page === "resources"
                        ? navigate("listening", day, location.from)
                        : setPage(
                            location.from === "books" ? "books" : "practice",
                          )
                    }
                  >
                    {page === "resources"
                      ? "Back to Listening studio"
                      : location.from === "books"
                        ? "Back to My library"
                        : "Back to Practice tools"}
                  </button>
                  <span>
                    Optional practice · Separate from course completion
                  </span>
                </div>
              )}
              {page === "home" && (
                <StudyHome
                  last={last}
                  onDay={openDay}
                  onCourse={() => setPage("plan")}
                  onBooks={() => setPage("books")}
                />
              )}
              {page === "review" && (
                <CourseReview
                  onDay={openDay}
                  onCourse={() => setPage("plan")}
                />
              )}
              {page === "practice" && (
                <>
                  <div className="page-heading">
                    <span className="eyebrow">OPTIONAL PRACTICE</span>
                    <h1>
                      Choose a skill to strengthen<span>.</span>
                    </h1>
                    <p>
                      These independent tools support your course. Start your
                      daily lesson from Today; studio practice does not mark a
                      course day complete.
                    </p>
                  </div>
                  <div className="plan-grid">
                    {tools.map((t) => (
                      <section className="card" key={t.id}>
                        <t.icon size={24} />
                        <h2>{t.label}</h2>
                        <p>{t.description}</p>
                        <button
                          className="button secondary"
                          onClick={() => navigate(t.id, day, "practice")}
                        >
                          Open {t.label}
                        </button>
                      </section>
                    ))}
                  </div>
                </>
              )}
              {page === "vocabulary" && (
                <Vocabulary
                  key={l.user?.id ?? "guest"}
                  userId={l.user?.id ?? null}
                  authLoading={l.loading}
                />
              )}{" "}
              {page === "books" && (
                <Books
                  key={l.user?.id ?? "guest"}
                  scope={l.user?.id ?? "guest"}
                  onListening={() => navigate("listening", day, "books")}
                />
              )}
              {page === "reading" && <Reading />}
              {page === "resources" && (
                <Listening
                  listened={l.listened}
                  mark={l.markListening}
                  blocked={l.blocked}
                />
              )}{" "}
              {page === "listening" && (
                <ListeningStudio
                  onResources={() => navigate("resources", day, location.from)}
                />
              )}
              {page === "leaderboard" && (
                <Leaderboard
                  onReview={() => navigate("spaced", day, location.from)}
                />
              )}
              {page === "spaced" && <Review />}
              {page === "grammar" && (
                <Grammar
                  key={`${day}:${l.user?.id ?? "guest"}`}
                  day={day}
                  onComplete={complete}
                />
              )}{" "}
              {page === "plan" && <CurriculumPlan onOpen={openDay} />}
              {page === "day" && (
                <DailyLesson
                  key={`${l.user?.id ?? "guest"}-${day}`}
                  day={day}
                  onOpen={openDay}
                  onPlan={() => setPage("plan")}
                />
              )}
            </div>
          </Suspense>
          <footer>
            <strong>
              deutsch<span>·</span>
            </strong>
            <p>A little every day. A world of possibility.</p>
            <span>
              Made for Uyên ✧ ·{" "}
              <a href="https://ngophuonguyen.github.io/ngophuonguyen21010/">
                Latest live app ↗
              </a>{" "}
              · Build {import.meta.env.VITE_BUILD_SHA?.slice(0, 7) || "local"}
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
