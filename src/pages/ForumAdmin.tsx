import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

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
 * The admin code is held in React state only and never written to
 * localStorage or sessionStorage: it reads every disclosure in the table, and
 * saving a few keystrokes is not worth persisting that.
 */
export default function ForumAdmin() {
  const [code, setCode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [held, setHeld] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json().catch(() => ({}))) as ListResponse;
      if (res.ok && data.ok === true) {
        setQuestions(data.questions ?? []);
        setHeld(data.held ?? []);
        setAuthed(true);
        setCode("");
      } else {
        setError(data.error ?? "That code didn't work.");
      }
    } catch {
      setError("Something went wrong reaching the server. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <form onSubmit={(e) => { void load(e); }} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="admin-code" className="block text-sm text-ink/70 mb-1">
              Admin code
            </label>
            <input
              id="admin-code"
              type="password"
              required
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded border border-ink/20 bg-paper px-3 py-2"
            />
          </div>
          {error !== "" && <p className="text-sm text-accent">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-accent px-5 py-2 text-paper disabled:opacity-60"
          >
            {loading ? "Loading…" : "Show questions"}
          </button>
          <p className="text-xs text-ink/50">
            This code is not saved anywhere in the browser. Reloading means
            entering it again.
          </p>
        </form>
      ) : (
        <>
          <p className="text-sm text-ink/60 mb-6">
            {questions.length === 0
              ? "No questions yet."
              : `${questions.length} ${plural(questions.length)}, newest first.`}
          </p>

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
