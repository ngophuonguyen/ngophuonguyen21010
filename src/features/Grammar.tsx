import { useState } from "react";
export const quiz = [
  {
    q: "Wenn ich mehr Zeit hätte, ___ ich jeden Tag Deutsch lernen.",
    options: ["werde", "würde", "wurde", "bin"],
    answer: 1,
    explanation:
      "Use würde + infinitive for a hypothetical situation: If I had more time, I would study German every day.",
  },
  {
    q: "Das ist die Kollegin, ___ mir gestern geholfen hat.",
    options: ["die", "der", "den", "das"],
    answer: 0,
    explanation:
      "Die refers to feminine Kollegin and is the subject of the relative clause.",
  },
  {
    q: "Ich interessiere mich ___ deutsche Kultur.",
    options: ["an", "über", "für", "mit"],
    answer: 2,
    explanation: "Sich interessieren für takes the accusative.",
  },
  {
    q: "Je mehr ich übe, ___ sicherer spreche ich.",
    options: ["weil", "desto", "obwohl", "dass"],
    answer: 1,
    explanation:
      "Je … desto … expresses a proportional comparison: The more I practice, the more confidently I speak.",
  },
  {
    q: "Die Rechnung ___ gestern bezahlt.",
    options: ["wird", "hat", "wurde", "ist"],
    answer: 2,
    explanation: "Passive in the past: wurde + past participle.",
  },
];
export default function Grammar({
  day = 1,
  onComplete,
}: {
  day?: number;
  onComplete: (score: number) => void;
}) {
  const [index, setIndex] = useState(0),
    [choice, setChoice] = useState<number | null>(null),
    [checked, setChecked] = useState(false),
    [score, setScore] = useState(0),
    [finished, setFinished] = useState(false);
  const q = quiz[index];
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">STRUCTURE LAB · FOUNDATION PRACTICE</span>
        <h1>
          A little structure. More freedom<span>.</span>
        </h1>
        <p>
          Five foundation checks shared across the learning plan. Explore
          contextual grammar in the reading studio.
        </p>
      </div>
      <section className="card quiz-card">
        {finished ? (
          <>
            <span className="eyebrow">SESSION COMPLETE</span>
            <h2>
              {score} / {quiz.length}
            </h2>
            <p>
              {score >= 3
                ? "Your foundation practice attempt has been recorded."
                : "Review the explanations and try again. This foundation quiz does not complete a curriculum day."}
            </p>
            <button
              className="button primary"
              onClick={() => {
                setIndex(0);
                setChoice(null);
                setChecked(false);
                setScore(0);
                setFinished(false);
              }}
            >
              Practice again
            </button>
          </>
        ) : (
          <>
            <div className="section-heading">
              <span className="pill">
                Question {index + 1} / {quiz.length}
              </span>
              <span>{score} correct</span>
            </div>
            <h2 lang="de">{q.q}</h2>
            <div className="quiz-options">
              {q.options.map((o, i) => (
                <button
                  key={o}
                  disabled={checked}
                  className={
                    (choice === i ? "selected " : "") +
                    (checked && q.answer === i ? "correct" : "")
                  }
                  onClick={() => setChoice(i)}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  {o}
                </button>
              ))}
            </div>
            {checked && (
              <div className="feedback" role="status">
                <strong>
                  {choice === q.answer ? "Exactly." : "Take another look."}
                </strong>
                <p>{q.explanation}</p>
              </div>
            )}
            <button
              className="button primary"
              disabled={choice === null}
              onClick={() => {
                if (!checked) {
                  setChecked(true);
                  if (choice === q.answer) setScore((s) => s + 1);
                } else if (index === quiz.length - 1) {
                  setFinished(true);
                  onComplete(score);
                } else {
                  setIndex((i) => i + 1);
                  setChoice(null);
                  setChecked(false);
                }
              }}
            >
              {checked
                ? index === quiz.length - 1
                  ? "Finish session"
                  : "Next question"
                : "Check answer"}
            </button>
          </>
        )}
      </section>
    </>
  );
}
