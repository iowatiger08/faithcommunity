import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";
import { signIn, signOut, getIdToken, currentAllowedUser } from "~/lib/auth";

const API_BASE = import.meta.env.VITE_FORUM_API_BASE;

// Repeated on every inline link; named so the JSX stays readable.
const linkClass = "text-accent underline underline-offset-2 hover:no-underline";


interface Question {
  questionId: string;
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

const plural = (n: number) => (n === 1 ? "question" : "questions");

function formatWhen(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function QuestionCard({ q }: { q: Question }) {
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
                <QuestionCard key={q.questionId} q={q} />
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
                  <QuestionCard key={q.questionId} q={q} />
                ))}
              </ul>
            </section>
          )}

          <p className="text-xs text-ink/50 mt-16 pt-8 border-t border-ink/10">
            These are confidential. Raise them in the forum without names
            attached, and delete them once the forum is done &mdash;{" "}
            <code className="text-ink/60">
              npx tsx scripts/forum-questions.ts --delete-all
            </code>.{" "}
            <Link to="/forum" className={linkClass}>
              The public page
            </Link>{" "}
            is where people submit.
          </p>
        </>
      )}
    </div>
  );
}
