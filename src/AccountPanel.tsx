import { useState } from "react";
import type { useLearning } from "./useLearning";
export function AccountPanel({
  learning: l,
}: {
  learning: ReturnType<typeof useLearning>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="account-strip">
      <div>
        <span className="live-dot" />
        <strong>
          {l.user
            ? l.user.user_metadata.full_name || "Your account"
            : "Guest workspace"}
        </strong>
        <small role="status">
          {l.loading ? "Loading progress…" : l.status}
        </small>
      </div>
      <button
        className="button subtle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open ? "Close account" : "Account & sync"}
      </button>
      {l.error && <p role="alert">{l.error}</p>}
      {open && (
        <div className="account-details">
          {l.user ? (
            <>
              <p>{l.user.email}</p>
              <button
                className="button secondary"
                onClick={() => void l.flush()}
              >
                Sync progress
              </button>
              <button className="button secondary" onClick={l.importGuest}>
                Import my guest progress
              </button>
              <button className="button subtle" onClick={() => void l.logout()}>
                Sign out
              </button>
              <p className="micro">
                Import only guest work that belongs to you. Vocabulary-studio
                drafts are stored separately for each account.
              </p>
            </>
          ) : (
            <>
              <p>
                Keep learning as a guest, or connect your account to sync
                supported learning progress.
              </p>
              <button
                className="button secondary"
                onClick={() => void l.login()}
                disabled={l.loading || !l.configured}
              >
                Continue with Google
              </button>
              {!l.configured && (
                <p className="micro">
                  Google sign-in is awaiting backend setup. Device practice
                  remains available.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
