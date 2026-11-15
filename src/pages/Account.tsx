import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";
import DisplayNameForm from "~/components/comments/DisplayNameForm";
import { createAccount, forgetUser, signIn, signOut, useAuth } from "~/lib/auth";
import { api, errorMessage } from "~/lib/commentsApi";
import type { Me } from "~/lib/commentsApi";

const primaryClass = "px-4 py-2 rounded bg-accent text-white text-sm hover:opacity-90 disabled:opacity-50";

export default function Account() {
  const auth = useAuth();
  const [me, setMe] = useState<Me | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth.token === null) return;
    api.me(auth.token).then(setMe, (err: unknown) => setError(errorMessage(err)));
  }, [auth.token]);

  async function deleteAccount() {
    setError("");
    try {
      await api.deleteAccount(auth.token!);
      await forgetUser();
      setDeleted(true);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <PageHead title="Your account" path="/account/" noindex />
      <h1 className="font-serif text-4xl mb-6">Your account</h1>

      {deleted ? (
        <p className="text-ink/80">
          Your account, comments and reactions have been deleted.
        </p>
      ) : auth.loading ? null : auth.token === null ? (
        <>
          <p className="text-ink/80 mb-4">Sign in to change your display name, see your comments, or delete your account.</p>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className={primaryClass} onClick={() => void signIn()}>
              Sign in
            </button>
            <button type="button" className="text-sm text-accent hover:underline" onClick={() => void createAccount()}>
              Create an account
            </button>
          </div>
        </>
      ) : !me ? (
        error !== "" ? <p className="text-red-700">{error}</p> : <p className="text-ink/70">Loading…</p>
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-2xl mb-3">Display name</h2>
            <DisplayNameForm
              token={auth.token}
              initial={me.displayName ?? ""}
              onSaved={(displayName) => setMe({ ...me, displayName })}
            />
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-3">Your comments</h2>
            {me.comments.length === 0 ? (
              <p className="text-ink/60">You haven&apos;t commented yet.</p>
            ) : (
              <ul className="space-y-4">
                {me.comments.map((c) => (
                  <li key={c.commentId}>
                    <Link to={`/${c.section}/${c.postSlug}/`} className="text-sm text-accent hover:underline">
                      View post
                    </Link>
                    {c.status === "held" && <span className="text-xs text-ink/60"> · awaiting review</span>}
                    <p className="whitespace-pre-line text-ink/90">{c.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-3">Delete your account</h2>
            <p className="text-ink/80 mb-3">
              This deletes your account, every comment you have written and every reaction you have
              added. It can&apos;t be undone.
            </p>
            {confirming ? (
              <div className="flex gap-4 items-center">
                <button type="button" className={primaryClass} onClick={() => void deleteAccount()}>
                  Yes, delete everything
                </button>
                <button type="button" className="text-sm text-accent hover:underline" onClick={() => setConfirming(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" className="text-sm text-accent hover:underline" onClick={() => setConfirming(true)}>
                Delete my account
              </button>
            )}
            {error !== "" && <p className="text-red-700 mt-2">{error}</p>}
          </section>

          <button type="button" className="text-sm text-accent hover:underline" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
