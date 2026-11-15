import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";
import { getIdToken, signIn, signOut } from "~/lib/ownerAuth";
import { api, ApiError, errorMessage } from "~/lib/commentsApi";
import type { HeldComment } from "~/lib/commentsApi";

const REASONS: Record<string, string> = {
  screening: "Flagged by automatic screening",
  links: "Contains several links",
  reports: "Reported by readers",
  moderator: "Held by a moderator",
};

const actionClass = "text-sm text-accent hover:underline";

const inputClass = "w-full rounded border border-ink/20 bg-paper px-3 py-2";

// Signs in with the owner's existing account. The API checks that account on
// every call; the checks here only decide what to show.
export default function Moderation() {
  // undefined while checking for a cached session.
  const [signedIn, setSignedIn] = useState<boolean | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [held, setHeld] = useState<HeldComment[] | null>(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  function endSession() {
    signOut();
    setSignedIn(false);
    setHeld(null);
  }

  /** Runs fn with a fresh token, or returns to the sign-in form without one. */
  async function withToken(fn: (token: string) => Promise<void>) {
    const token = await getIdToken();
    if (token === null) {
      endSession();
      return;
    }
    setSignedIn(true);
    try {
      await fn(token);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) endSession();
      else setError(errorMessage(err));
    }
  }

  useEffect(() => {
    getIdToken()
      .then(async (token) => {
        if (token === null) return setSignedIn(false);
        setSignedIn(true);
        setHeld((await api.held(token)).comments);
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          signOut();
          setSignedIn(false);
        } else setError(errorMessage(err));
      });
  }, [version]);

  async function act(fn: (token: string) => Promise<unknown>) {
    setError("");
    await withToken(async (token) => {
      await fn(token);
      setVersion((v) => v + 1);
    });
  }

  async function onSignIn(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      setPassword("");
      setVersion((v) => v + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in didn't work. Please try again.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <PageHead title="Moderation" path="/moderation/" noindex />
      <h1 className="font-serif text-4xl mb-6">Held comments</h1>

      {signedIn === undefined ? null : !signedIn ? (
        <form onSubmit={(e) => void onSignIn(e)} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="mod-email" className="block text-sm text-ink/70 mb-1">
              Email
            </label>
            <input
              id="mod-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="mod-password" className="block text-sm text-ink/70 mb-1">
              Password
            </label>
            <input
              id="mod-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          {error !== "" && <p className="text-red-700">{error}</p>}
          <button type="submit" className="rounded bg-accent px-5 py-2 text-paper">
            Sign in
          </button>
        </form>
      ) : (
        <>
          <button type="button" className={`${actionClass} mb-6`} onClick={endSession}>
            Sign out
          </button>
          {error !== "" && <p className="text-red-700 mb-4">{error}</p>}
          {held?.length === 0 && <p className="text-ink/60">Nothing is waiting for review.</p>}
          <ul className="space-y-8">
            {held?.map((c) => (
              <li key={c.commentId} className="border-b border-ink/10 pb-6">
                <p className="text-sm text-ink/60">
                  {REASONS[c.heldReason ?? ""] ?? "Held"}
                  {c.reportCount > 0 && ` · ${c.reportCount} report${c.reportCount === 1 ? "" : "s"}`}
                  {" · "}
                  <Link to={`/${c.section}/${c.postSlug}/`} className="hover:underline">
                    View post
                  </Link>
                </p>
                <p className="font-semibold mt-1">{c.displayName}</p>
                <p className="whitespace-pre-line text-ink/90">{c.body}</p>
                <div className="flex gap-4 mt-2">
                  <button type="button" className={actionClass} onClick={() => void act((t) => api.moderate(t, c.commentId, "restore"))}>
                    Restore
                  </button>
                  <button type="button" className={actionClass} onClick={() => void act((t) => api.moderate(t, c.commentId, "remove"))}>
                    Remove
                  </button>
                  <button type="button" className={actionClass} onClick={() => void act((t) => api.suspend(t, c.authorSub, true))}>
                    Suspend author
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
