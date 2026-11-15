import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";
import { signIn, useAuth } from "~/lib/auth";
import { api, errorMessage } from "~/lib/commentsApi";
import type { HeldComment } from "~/lib/commentsApi";

const REASONS: Record<string, string> = {
  screening: "Flagged by automatic screening",
  links: "Contains several links",
  reports: "Reported by readers",
  moderator: "Held by a moderator",
};

const actionClass = "text-sm text-accent hover:underline";

// The API enforces the admin group on every call; the checks here only decide
// what to show.
export default function Moderation() {
  const auth = useAuth();
  const [held, setHeld] = useState<HeldComment[] | null>(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (auth.token === null || !auth.isAdmin) return;
    api.held(auth.token).then(
      (res) => setHeld(res.comments),
      (err: unknown) => setError(errorMessage(err)),
    );
  }, [auth.token, auth.isAdmin, version]);

  async function act(fn: () => Promise<unknown>) {
    setError("");
    try {
      await fn();
      setVersion((v) => v + 1);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <PageHead title="Moderation" path="/moderation/" noindex />
      <h1 className="font-serif text-4xl mb-6">Held comments</h1>

      {auth.loading ? null : auth.token === null ? (
        <button type="button" className={actionClass} onClick={() => void signIn()}>
          Sign in
        </button>
      ) : !auth.isAdmin ? (
        <p className="text-ink/80">This page is for moderators.</p>
      ) : (
        <>
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
                  <button type="button" className={actionClass} onClick={() => void act(() => api.moderate(auth.token!, c.commentId, "restore"))}>
                    Restore
                  </button>
                  <button type="button" className={actionClass} onClick={() => void act(() => api.moderate(auth.token!, c.commentId, "remove"))}>
                    Remove
                  </button>
                  <button type="button" className={actionClass} onClick={() => void act(() => api.suspend(auth.token!, c.authorSub, true))}>
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
