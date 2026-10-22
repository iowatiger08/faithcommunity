import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import PageHead from "~/components/PageHead";
import { signIn, signOut, getIdToken, currentAllowedUser } from "~/lib/auth";

const API_BASE = import.meta.env.VITE_FORUM_API_BASE;

// Repeated on every inline link; named so the JSX stays readable.
const linkClass = "text-accent underline underline-offset-2 hover:no-underline";


interface Question {
  questionId: string;
  /** The item's DynamoDB sort key, which the delete route takes. */
  sk: string;
  submittedAt: string;
  anonymous: boolean;
  question: string;
  name?: string;
  email?: string;
  status: string;
  flagReason?: string;
  allowName?: boolean;
}

interface ListResponse {
  ok?: boolean;
  count?: number;
  questions?: Question[];
  held?: Question[];
  error?: string;
}

interface DeleteResponse {
  ok?: boolean;
  deleted?: string;
  error?: string;
}

const plural = (n: number) => (n === 1 ? "question" : "questions");

function formatWhen(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function QuestionCard({
  q,
  onDelete,
  busy,
}: {
  q: Question;
  onDelete: (q: Question) => void;
  busy: boolean;
}) {
  // Confirmation lives on the card rather than in a window.confirm, which
  // blocks the page and reads as a browser warning rather than a decision
  // about someone's words.
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="border border-ink/10 rounded-lg p-6">
      <div
        className="flex flex-wrap gap-x-3 gap-y-1 items-baseline text-sm text-ink/60"
      >
        <span>{formatWhen(q.submittedAt)}</span>
        <span aria-hidden="true">&middot;</span>
        {q.anonymous ? (
          <span className="italic">Anonymous</span>
        ) : (
          <span>
            {q.name}
            {q.email !== undefined && q.email !== "" && (
              <>
                {" "}
                &mdash;{" "}
                <a
                  href={`mailto:${q.email}`}
                  className={linkClass}
                >
                  {q.email}
                </a>
              </>
            )}
          </span>
        )}
        {!q.anonymous &&
          (q.allowName === true ? (
            <span className="text-accent">name may be used</span>
          ) : (
            <span className="font-semibold text-ink/70">do not use name</span>
          ))}
        <span className="text-ink/40">#{q.questionId}</span>
      </div>
      <p className="text-ink/85 mt-3 leading-relaxed whitespace-pre-wrap break-words">
        {q.question}
      </p>
      {q.flagReason !== undefined && q.flagReason !== "" && (
        <p className="text-xs text-accent mt-3">
          Automated screening flagged this ({q.flagReason}). It is stored in full
          and may well be a legitimate account of harm &mdash; read it before
          deciding.
        </p>
      )}
      {confirming ? (
        <div className="mt-4 pt-4 border-t border-ink/10">
          <p className="text-sm text-ink/70 leading-relaxed">
            This removes the question from the table. It cannot be undone, and
            there is no copy anywhere else.
          </p>
          <div className="flex gap-4 mt-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => { onDelete(q); }}
              className="rounded bg-accent px-4 py-1.5 text-sm text-paper disabled:opacity-60"
            >
              {busy ? "Deleting…" : "Delete for good"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className={`text-sm ${linkClass}`}
            >
              Keep it
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="text-sm text-ink/50 hover:text-accent mt-4"
        >
          Delete
        </button>
      )}
    </li>
  );
}

/**
 * Read-only view of submitted forum questions. Unlisted and noindex.
 *
 * The gate is Cognito: email and password go straight to Cognito by SRP, and
 * the ID token that comes back is sent to the listing API, which verifies it
 * and checks that the identity is the owner's. The password is never held in
 * state after sign-in and never reaches this site's API.
 *
 * Cognito's SDK does cache the session in localStorage, so the phone at church
 * stays signed in — hence the sign-out button, which is the way to end a
 * session that can read every disclosure in the table.
 *
 * The form itself says nothing about which identity provider is behind it,
 * which account to use, or what else shares that account. Anyone can reach
 * this path; a signed-out visitor should learn nothing from it.
 */
export default function ForumAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [held, setHeld] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // The sk of the question being deleted, so only that card shows progress.
  const [deleting, setDeleting] = useState<string | null>(null);

  /** Fetch the listing with the cached ID token. Returns to the form on 401. */
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getIdToken();
      if (token === null) {
        setAuthed(false);
        setError("Your session has expired. Sign in again.");
        return;
      }
      const res = await fetch(`${API_BASE}/admin/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: "{}",
      });
      const data = (await res.json().catch(() => ({}))) as ListResponse;
      if (res.ok && data.ok === true) {
        setQuestions(data.questions ?? []);
        setHeld(data.held ?? []);
        setAuthed(true);
      } else {
        // 401 (token no longer passes) and 403 (wrong account) both mean this
        // session is no good, so end it. Any other status leaves it alone, so a
        // server hiccup doesn't force a re-login.
        if (res.status === 401 || res.status === 403) {
          signOut();
          setAuthed(false);
        }
        setError(data.error ?? "Couldn't load the questions.");
      }
    } catch {
      setError("Something went wrong reaching the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Resume a session cached by Cognito rather than asking again on every visit.
  useEffect(() => {
    void (async () => {
      if (await currentAllowedUser()) await load();
    })();
  }, [load]);

  async function onSignIn(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      setPassword("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That sign-in didn't work.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Remove one question: hostile submissions, tests, and the second of two
   * near-identical questions do not belong in the stack being read aloud. A
   * 404 means it has already gone, so the page drops it either way rather than
   * keep showing something the table no longer holds.
   */
  async function onDelete(q: Question) {
    setDeleting(q.sk);
    setError("");
    try {
      const token = await getIdToken();
      if (token === null) {
        signOut();
        setAuthed(false);
        setError("Your session has expired. Sign in again.");
        return;
      }
      const res = await fetch(`${API_BASE}/admin/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sk: q.sk }),
      });
      const data = (await res.json().catch(() => ({}))) as DeleteResponse;
      if ((res.ok && data.ok === true) || res.status === 404) {
        const drop = (list: Question[]) => list.filter((x) => x.sk !== q.sk);
        setQuestions(drop);
        setHeld(drop);
        if (res.status === 404) setError(data.error ?? "That question was already gone.");
      } else {
        setError(data.error ?? "Couldn't delete that question.");
      }
    } catch {
      setError("Something went wrong reaching the server. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  function onSignOut() {
    signOut();
    setAuthed(false);
    setQuestions([]);
    setHeld([]);
    setError("");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Forum Questions — Admin"
        description="Private view of questions submitted for the forum."
        path="/forum-admin/"
        noindex
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">Private</p>
      <h1 className="font-serif text-4xl mb-6 leading-tight">Submitted questions</h1>

      {!authed ? (
        <form onSubmit={(e) => { void onSignIn(e); }} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="admin-email" className="block text-sm text-ink/70 mb-1">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-ink/20 bg-paper px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm text-ink/70 mb-1">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-ink/20 bg-paper px-3 py-2"
            />
          </div>
          {error !== "" && <p className="text-sm text-accent">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-accent px-5 py-2 text-paper disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
            <p className="text-sm text-ink/60">
              {questions.length === 0
                ? "No questions yet."
                : `${questions.length} ${plural(questions.length)}, newest first.`}
            </p>
            <button
              type="button"
              onClick={onSignOut}
              className={`text-sm ${linkClass}`}
            >
              Sign out
            </button>
          </div>
          {error !== "" && <p className="text-sm text-accent mb-6">{error}</p>}

          {questions.length > 0 && (
            <ul className="space-y-6">
              {questions.map((q) => (
                <QuestionCard
                  key={q.questionId}
                  q={q}
                  onDelete={(x) => { void onDelete(x); }}
                  busy={deleting === q.sk}
                />
              ))}
            </ul>
          )}

          {held.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-2xl mb-2">Held for review</h2>
              <p className="text-sm text-ink/70 mb-6 max-w-prose leading-relaxed">
                Automated screening flagged these for threatening or harassing
                language and kept them out of the list above, so they stay clear of the stack you
                read aloud. The screening is narrow and it is often wrong
                &mdash; a first-person account of being threatened looks much
                like a threat to a classifier. Read each one and decide.
              </p>
              <ul className="space-y-6">
                {held.map((q) => (
                  <QuestionCard
                    key={q.questionId}
                    q={q}
                    onDelete={(x) => { void onDelete(x); }}
                    busy={deleting === q.sk}
                  />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
