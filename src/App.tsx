import { lazy, Suspense, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Headphones,
  Layers,
  LayoutDashboard,
  Route,
  Sparkles,
  Clock3,
  Check,
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
import Leaderboard, { RankCard } from "./features/studio/Leaderboard";
import {
  CurriculumProvider,
  useCurriculum,
} from "./features/curriculum/CurriculumProgress";
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
const nav = [
  { id: "home", label: "Overview", icon: LayoutDashboard },
  { id: "vocabulary", label: "Vocabulary studio", icon: Layers },
  { id: "books", label: "Books & exam practice", icon: BookOpen },
  { id: "reading", label: "Reading & dialogue", icon: BookOpen },
  { id: "listening", label: "Listening studio", icon: Headphones },
  { id: "grammar", label: "Grammar practice", icon: Sparkles },
  { id: "plan", label: "Learning plan", icon: Route },
  { id: "review", label: "Spaced review", icon: RotateCcw },
  { id: "leaderboard", label: "Practice ranks", icon: Trophy },
];
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
  const daily = useCurriculum();
  const openDay = (n: number) => {
    if (n >= 1 && n <= 30) {
      setDay(n);
      setPage("day");
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };
  const [page, setPage] = useState("home"),
    [day, setDay] = useState(1);
  const label =
    page === "day"
      ? "Daily lesson"
      : page === "resources"
        ? "Listening resources"
        : (nav.find((n) => n.id === page)?.label ?? "Overview");
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
                page === n.id || (page === "resources" && n.id === "listening")
                  ? "active"
                  : ""
              }
              onClick={() => setPage(n.id)}
            >
              <n.icon size={19} />
              <span>{n.label}</span>
              {n.id === "vocabulary" && <small>NEW</small>}
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
              {page === "home" && (
                <>
                  <div className="page-heading">
                    <span className="eyebrow">
                      <span className="rose-dot" /> A LITTLE GERMAN, EVERY DAY
                    </span>
                    <h1>
                      Your next chapter starts here<span>.</span>
                    </h1>
                    <p>
                      You are not starting from zero. You are finding your
                      rhythm again.
                    </p>
                  </div>
                  <section className="hero">
                    <div className="hero-copy">
                      <span className="pill">A PERSONAL PATH · B1 → B2</span>
                      <h2>
                        A world of words.
                        <br />
                        <em>Make it yours.</em>
                      </h2>
                      <p>
                        Less memorizing. More meaning.
                        <br />
                        Read, listen, and use German in your own voice.
                      </p>
                      <button
                        className="button primary"
                        onClick={() => setPage("vocabulary")}
                      >
                        Enter vocabulary studio <ArrowRight size={17} />
                      </button>
                      <small>
                        <Clock3 size={14} /> One focused batch. Six useful
                        words.
                      </small>
                    </div>
                    <div
                      className="hero-image"
                      role="img"
                      aria-label="A pink-lit planet against a dark star field"
                    >
                      <span className="orbit-label">
                        DEIN NÄCHSTER SCHRITT.
                      </span>
                    </div>
                  </section>
                  <section className="stats-grid">
                    <div className="card">
                      <span className="stat-icon">
                        <Route size={19} />
                      </span>
                      <div>
                        <small>Learning days</small>
                        <strong>
                          {daily.completed.length}
                          <em> / 30</em>
                        </strong>
                      </div>
                      <span
                        className="mini-progress"
                        style={{
                          background: `conic-gradient(var(--accent) ${(daily.completed.length / 30) * 360}deg, var(--border) 0deg)`,
                        }}
                      />
                    </div>
                    <div className="card">
                      <span className="stat-icon">
                        <Clock3 size={19} />
                      </span>
                      <div>
                        <small>Your daily intention</small>
                        <strong>
                          30<em> minutes</em>
                        </strong>
                      </div>
                    </div>
                    <div className="card">
                      <span className="stat-icon">
                        <BookOpen size={19} />
                      </span>
                      <div>
                        <small>A fresh vocabulary batch</small>
                        <strong>
                          06<em> words in context</em>
                        </strong>
                      </div>
                    </div>
                  </section>
                  <div className="merge-feature-row">
                    <RankCard onReview={() => setPage("review")} />
                    <section className="card merge-feature-intro">
                      <span className="eyebrow">
                        LISTEN DEEPER. REMEMBER LONGER.
                      </span>
                      <h2>One story. Three ways to hear it.</h2>
                      <p>
                        Listen without the transcript, follow the German, then
                        connect it to English. Your study notes and completed
                        passes stay on this device.
                      </p>
                      <button
                        className="button primary"
                        onClick={() => setPage("listening")}
                      >
                        Open three-pass listening <ArrowRight size={16} />
                      </button>
                      <button
                        className="button subtle"
                        onClick={() => setPage("leaderboard")}
                      >
                        Explore practice ranks <Trophy size={16} />
                      </button>
                    </section>
                  </div>
                  <div className="dashboard-grid">
                    <section className="card">
                      <div className="section-heading">
                        <h2>Make room for a little progress.</h2>
                        <span className="muted">Today’s focus</span>
                      </div>
                      {[
                        {
                          id: "vocabulary",
                          num: "01",
                          title: "Meet six useful words",
                          description:
                            "Grammar, collocations, and your own sentences",
                          icon: Layers,
                          time: "10 min",
                        },
                        {
                          id: "reading",
                          num: "02",
                          title: "Read between the lines",
                          description:
                            "Word lookup, idioms, and grammar insights",
                          icon: BookOpen,
                          time: "10 min",
                        },
                        {
                          id: "listening",
                          num: "03",
                          title: "Listen to real German",
                          description:
                            "A short native-speaker video or course resource",
                          icon: Headphones,
                          time: "10 min",
                        },
                      ].map((t) => (
                        <button
                          className="daily-task"
                          key={t.id}
                          onClick={() => setPage(t.id)}
                        >
                          <small>{t.num}</small>
                          <span className="task-icon">
                            <t.icon size={20} />
                          </span>
                          <div>
                            <strong>{t.title}</strong>
                            <span>{t.description}</span>
                          </div>
                          <em>{t.time}</em>
                          <ArrowUpRight size={17} />
                        </button>
                      ))}
                    </section>
                    <section className="card expression-card">
                      <span className="eyebrow">
                        ONE EXPRESSION TO TAKE WITH YOU
                      </span>
                      <h2 lang="de">
                        Am Ball
                        <br />
                        <em>bleiben.</em>
                      </h2>
                      <p>Keep at it. Stay with it.</p>
                      <blockquote lang="de">
                        „Auch wenn es schwierig wird,
                        <br />
                        bleibe ich am Ball.“
                      </blockquote>
                      <small>Even when it gets difficult, I keep at it.</small>
                      <button
                        className="button subtle"
                        onClick={() => setPage("reading")}
                      >
                        Find it in context <ArrowUpRight size={15} />
                      </button>
                    </section>
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
                  onListening={() => setPage("listening")}
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
                <ListeningStudio onResources={() => setPage("resources")} />
              )}
              {page === "leaderboard" && (
                <Leaderboard onReview={() => setPage("review")} />
              )}
              {page === "review" && <Review />}
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
