import { Localized } from "../language/Language";
import { useState } from "react";
import { Flame, ShieldCheck, Trophy } from "lucide-react";
import { vocabulary } from "../../content/course";
import { dateKey, DAY, getRank, ranks, streak } from "./model";
import { useStudio } from "./StudioProgress";
export function RankCard({ onReview }: { onReview: () => void }) {
  const { state: s, now, due } = useStudio(),
    { current, next } = getRank(s.xp),
    percent = next ? ((s.xp - current.xp) / (next.xp - current.xp)) * 100 : 100;
  const remaining = Math.max(0, s.lastReview + 2 * DAY - now);
  return (
    <Localized>
      {
        <section className="card local-rank">
          <span className="eyebrow">YOUR PRACTICE RANK · DEVICE DATA</span>
          <div className="rank-title">
            <ShieldCheck size={35} />
            <div>
              <h2>{current.name}</h2>
              <strong>{s.xp.toLocaleString()} XP</strong>
            </div>
          </div>
          <div
            className="rank-track"
            role="progressbar"
            aria-label="Progress to next practice rank"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${percent}%` }} />
          </div>
          <p>
            {next
              ? `${next.xp - s.xp} XP to ${next.name}`
              : "Highest practice rank reached."}
          </p>
          <div className="decay-callout">
            <strong>
              {s.lastPenalty
                ? `Rank decay: −${s.lastPenalty} XP`
                : "Keep your momentum."}
            </strong>
            <p>
              After 48 hours without vocabulary review, lose 50 rank XP for each
              overdue day. Points never fall below zero.
            </p>
            <small>
              {remaining > 0
                ? `Next decay in about ${Math.ceil(remaining / 3600000)} hours.`
                : "Your review window has expired. Review to reset it."}
            </small>
          </div>
          <button className="button primary" onClick={onReview}>
            Review {due.length} due words
          </button>
          <p className="micro">
            Ranks measure practice activity, not CEFR proficiency. These points
            are stored on this device and are not part of a shared competition.
          </p>
        </section>
      }
    </Localized>
  );
}
export default function Leaderboard({ onReview }: { onReview: () => void }) {
  const { state: s, now } = useStudio(),
    [period, setPeriod] = useState<"today" | "week" | "all">("week");
  const own =
    period === "all"
      ? s.xp
      : Object.entries(s.activities)
          .filter(([day]) =>
            period === "today"
              ? day === dateKey(now)
              : day >= dateKey(now - 6 * DAY) && day <= dateKey(now),
          )
          .reduce((sum, [, a]) => sum + a.xp, 0);
  const peers = [
    {
      name: "Mia",
      xp: period === "today" ? 120 : period === "week" ? 680 : 1800,
    },
    {
      name: "Jonas",
      xp: period === "today" ? 80 : period === "week" ? 400 : 1200,
    },
    {
      name: "Clara",
      xp: period === "today" ? 40 : period === "week" ? 240 : 700,
    },
  ];
  const rows = [
    ...peers.map((p) => ({ ...p, own: false })),
    { name: "You", xp: own, own: true },
  ].sort((a, b) => b.xp - a.xp || Number(b.own) - Number(a.own));
  return (
    <Localized>
      {
        <>
          <div className="page-heading">
            <span className="eyebrow">A LITTLE FRIENDLY MOMENTUM</span>
            <h1>
              Keep showing up<span>.</span>
            </h1>
            <p>
              Earn practice XP through review and three-pass listening. Your
              progress is real; the companion profiles below are illustrative.
            </p>
          </div>
          <div className="gamification-grid">
            <RankCard onReview={onReview} />
            <section className="card">
              <div className="section-heading">
                <h2>
                  <Trophy size={20} /> Practice leaderboard
                </h2>
                <span className="pill">SAMPLE PEERS</span>
              </div>
              <div className="tab-row" aria-label="Leaderboard period">
                {(["today", "week", "all"] as const).map((p) => (
                  <button
                    key={p}
                    aria-pressed={period === p}
                    className={period === p ? "selected" : ""}
                    onClick={() => setPeriod(p)}
                  >
                    {p === "today"
                      ? "Today"
                      : p === "week"
                        ? "This week"
                        : "All-time rank XP"}
                  </button>
                ))}
              </div>
              <p className="micro">
                {period === "all"
                  ? "Rank XP includes inactivity deductions."
                  : "Period totals show earned XP before rank-decay deductions."}{" "}
                Calendar days use Vietnam time (UTC+7).
              </p>
              <ol className="leaderboard-rows">
                {rows.map((p, i) => (
                  <li key={p.name} className={p.own ? "is-you" : ""}>
                    <span>{i + 1}</span>
                    <span className="avatar">{p.name[0]}</span>
                    <div>
                      <strong>{p.name}</strong>
                      <small>
                        {p.own
                          ? "Your device progress"
                          : "Illustrative profile"}
                      </small>
                    </div>
                    <strong>
                      {p.xp} <small>XP</small>
                    </strong>
                  </li>
                ))}
              </ol>
              <div className="section-heading">
                <span>
                  <Flame size={15} /> {streak(s.activities, now)}-day activity
                  streak
                </span>
                <span>
                  {
                    vocabulary.filter(
                      (w) => (s.reviews[w.id]?.interval ?? 0) >= 7,
                    ).length
                  }
                  /6 words on a 7+ day interval
                </span>
              </div>
              <p className="micro">
                A shared, tamper-resistant leaderboard requires a server. No
                other learner’s private progress is displayed.
              </p>
            </section>
          </div>
          <div className="rank-ladder">
            {ranks.map((r) => (
              <div
                key={r.name}
                className={
                  getRank(s.xp).current.name === r.name ? "current" : ""
                }
              >
                <ShieldCheck size={22} />
                <strong>{r.name}</strong>
                <small>{r.xp} XP</small>
              </div>
            ))}
          </div>
        </>
      }
    </Localized>
  );
}
