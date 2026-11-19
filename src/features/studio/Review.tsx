import { Localized } from "../language/Language";
import { GermanText } from "../dictionary/Dictionary";
import { useState } from "react";
import { useStudio } from "./StudioProgress";
import { vocabulary } from "../../content/course";
import { ListenButton } from "../Speech";
export default function Review() {
  const { due, state, review, practice, now, storageError } = useStudio(),
    [revealed, setRevealed] = useState(false);
  const [early, setEarly] = useState(false),
    [earlyIndex, setEarlyIndex] = useState(0);
  const word = due[0] ?? (early ? vocabulary[earlyIndex] : undefined),
    isEarly = !due.length;
  return (
    <Localized>
      {
        <>
          <div className="page-heading">
            <span className="eyebrow">SPACED REVIEW · SIX FAMILIAR WORDS</span>
            <h1>
              Meet them again. Remember longer<span>.</span>
            </h1>
            <p>
              Try to recall the meaning before revealing it. Your response is
              self-rated, not an AI assessment. Reviewing resets the 48-hour
              rank-decay window.
            </p>
          </div>
          {storageError && (
            <p className="notice" role="alert">
              {storageError}
            </p>
          )}
          <section className="card review-session">
            {word ? (
              <>
                <span className="pill">
                  {isEarly ? "Early practice" : `${due.length} words due`}
                </span>
                <h2 lang="de">
                  {word.article} {word.word}
                </h2>
                <p lang="de">
                  <GermanText text={word.examples[0].de} />
                </p>
                <ListenButton
                  text={`${word.article} ${word.word}. ${word.examples[0].de}`}
                  label="Hear review word"
                />
                {!revealed ? (
                  <button
                    className="button primary"
                    onClick={() => setRevealed(true)}
                  >
                    Reveal meaning
                  </button>
                ) : (
                  <>
                    <div className="review-answer">
                      <h3>{word.meaning}</h3>
                      <p>{word.examples[0].en}</p>
                      <p lang="de">Plural: {word.plural}</p>
                    </div>
                    <div className="review-actions">
                      {isEarly ? (
                        <button
                          className="button primary"
                          onClick={() => {
                            practice(word.id);
                            setRevealed(false);
                            setEarlyIndex((i) => (i + 1) % vocabulary.length);
                            setEarly(false);
                          }}
                        >
                          Finish early recall · no XP
                        </button>
                      ) : (
                        <>
                          <button
                            className="button secondary"
                            onClick={() => {
                              review(word.id, false);
                              setRevealed(false);
                            }}
                          >
                            Again · in 10 minutes
                          </button>
                          <button
                            className="button primary"
                            onClick={() => {
                              review(word.id, true);
                              setRevealed(false);
                            }}
                          >
                            Remembered · +10 XP
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <h2>Your review is complete.</h2>
                <button
                  className="button secondary"
                  onClick={() => setEarly(true)}
                >
                  Practice early · protect rank
                </button>
                <p>
                  Early recall resets the inactivity window without XP or a
                  schedule change.
                </p>
                <p>
                  Words return after 1, 3, 7, 15 days and longer intervals. A
                  forgotten word returns after ten minutes.
                </p>
                <p>
                  Next review:{" "}
                  {Math.min(...Object.values(state.reviews).map((r) => r.due)) >
                  now
                    ? new Date(
                        Math.min(
                          ...Object.values(state.reviews).map((r) => r.due),
                        ),
                      ).toLocaleString("en-GB", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                    : "No review scheduled yet."}{" "}
                  (Vietnam time)
                </p>
              </>
            )}
          </section>
        </>
      }
    </Localized>
  );
}
