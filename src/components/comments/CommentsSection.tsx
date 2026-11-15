import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { createAccount, signIn, signOut, useAuth } from "~/lib/auth";
import { api, errorMessage } from "~/lib/commentsApi";
import DisplayNameForm from "./DisplayNameForm";
import type { Comment, PostThread, ReactionKind, Reactions } from "~/lib/commentsApi";

export const REACTIONS: { kind: ReactionKind; emoji: string; label: string }[] = [
  { kind: "pray", emoji: "🙏", label: "Praying" },
  { kind: "heart", emoji: "❤️", label: "Love" },
  { kind: "amen", emoji: "🙌", label: "Amen" },
  { kind: "thanks", emoji: "💐", label: "Thank you" },
];

const buttonClass = "text-sm text-accent hover:underline disabled:opacity-50";
const primaryClass =
  "px-4 py-2 rounded bg-accent text-white text-sm hover:opacity-90 disabled:opacity-50";

interface Props {
  slug: string;
  section: string;
}

export default function CommentsSection({ slug, section }: Props) {
  const auth = useAuth();
  const [thread, setThread] = useState<PostThread | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [version, setVersion] = useState(0);

  // Bumping the version re-reads the thread after any change.
  const load = useCallback(() => {
    setVersion((v) => v + 1);
    return Promise.resolve();
  }, []);

  useEffect(() => {
    if (auth.loading) return;
    api.thread(slug, auth.token).then(
      (t) => {
        setThread(t);
        setLoadError(false);
      },
      () => setLoadError(true),
    );
  }, [auth.loading, auth.token, slug, version]);

  useEffect(() => {
    if (auth.token === null) return;
    api.me(auth.token).then((me) => setDisplayName(me.displayName), () => setDisplayName(null));
  }, [auth.token]);

  const setReactions = (reactions: Reactions) =>
    setThread((t) => (t ? { ...t, reactions } : t));

  if (loadError) {
    return (
      <section className="comments mt-12 pt-8 border-t border-ink/10 lg:col-start-1">
        <p className="text-ink/70">Comments couldn&apos;t be loaded. Please refresh the page to try again.</p>
      </section>
    );
  }
  if (!thread) return null;

  const top = thread.comments.filter((c) => c.parentId === null);
  const topIds = new Set(top.map((c) => c.commentId));
  const repliesTo = (id: string) => thread.comments.filter((c) => c.parentId === id);
  // Replies whose parent was deleted are grouped under a placeholder.
  const orphanParents = [
    ...new Set(
      thread.comments
        .map((c) => c.parentId)
        .filter((id): id is string => id !== null && !topIds.has(id)),
    ),
  ];

  return (
    <section className="comments mt-12 pt-8 border-t border-ink/10 lg:col-start-1" aria-label="Responses">
      <ReactionBar
        reactions={thread.reactions}
        token={auth.token}
        slug={slug}
        section={section}
        onChange={setReactions}
      />

      <h2 className="font-serif text-2xl mt-10 mb-4">
        Comments{thread.comments.length > 0 && ` (${thread.comments.length})`}
      </h2>

      {auth.token === null ? (
        <div className="mb-8 p-4 border border-ink/10 rounded">
          <p className="text-ink/80 mb-3">
            Sign in with your email to comment or react. Your email address is never shown.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className={primaryClass} onClick={() => void signIn()}>
              Sign in
            </button>
            <button type="button" className="text-sm text-accent hover:underline" onClick={() => void createAccount()}>
              Create an account
            </button>
          </div>
        </div>
      ) : displayName === null ? (
        <DisplayNameForm token={auth.token} onSaved={setDisplayName} />
      ) : (
        <div className="mb-8">
          <CommentForm
            label={`Comment as ${displayName}`}
            onSubmit={async (body) => {
              await api.post(auth.token!, slug, section, body);
              await load();
            }}
          />
          <p className="text-xs text-ink/60 mt-2">
            <Link to="/account/" className="hover:underline">
              Account settings
            </Link>
            {" · "}
            <button type="button" className="hover:underline" onClick={() => void signOut()}>
              Sign out
            </button>
          </p>
        </div>
      )}

      {thread.comments.length === 0 && <p className="text-ink/60">No comments yet.</p>}

      <ol className="space-y-6">
        {top.map((c) => (
          <li key={c.commentId}>
            <CommentItem
              comment={c}
              token={auth.token}
              canReply={displayName !== null}
              onChanged={load}
              onReply={async (body) => {
                await api.post(auth.token!, slug, section, body, c.commentId);
                await load();
              }}
            />
            <Replies replies={repliesTo(c.commentId)} token={auth.token} onChanged={load} />
          </li>
        ))}
        {orphanParents.map((id) => (
          <li key={id}>
            <p className="text-sm text-ink/50 italic">This comment was deleted.</p>
            <Replies replies={repliesTo(id)} token={auth.token} onChanged={load} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function Replies({
  replies,
  token,
  onChanged,
}: {
  replies: Comment[];
  token: string | null;
  onChanged: () => Promise<void>;
}) {
  if (replies.length === 0) return null;
  return (
    <ol className="mt-4 ml-6 pl-4 border-l border-ink/10 space-y-4">
      {replies.map((r) => (
        <li key={r.commentId}>
          <CommentItem comment={r} token={token} canReply={false} onChanged={onChanged} />
        </li>
      ))}
    </ol>
  );
}

function ReactionBar({
  reactions,
  token,
  slug,
  section,
  onChange,
}: {
  reactions: Reactions;
  token: string | null;
  slug: string;
  section: string;
  onChange: (r: Reactions) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggle(kind: ReactionKind) {
    if (token === null) return void signIn();
    setBusy(true);
    setError("");
    try {
      const on = !reactions.mine.includes(kind);
      onChange((await api.react(token, slug, section, kind, on)).reactions);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Reactions">
        {REACTIONS.map(({ kind, emoji, label }) => {
          const pressed = reactions.mine.includes(kind);
          return (
            <button
              key={kind}
              type="button"
              aria-pressed={pressed}
              disabled={busy}
              onClick={() => void toggle(kind)}
              className={`px-3 py-1 rounded-full border text-sm ${
                pressed ? "border-accent bg-accent/10" : "border-ink/20"
              }`}
            >
              <span aria-hidden="true">{emoji}</span> {label}{" "}
              <span className="text-ink/60">{reactions.counts[kind]}</span>
            </button>
          );
        })}
      </div>
      {error !== "" && <p className="text-sm text-red-700 mt-2">{error}</p>}
    </div>
  );
}

function CommentItem({
  comment,
  token,
  canReply,
  onChanged,
  onReply,
}: {
  comment: Comment;
  token: string | null;
  canReply: boolean;
  onChanged: () => Promise<void>;
  onReply?: (body: string) => Promise<void>;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "reply" | "confirmDelete">("view");
  const [reported, setReported] = useState(false);
  const [error, setError] = useState("");

  async function run(action: () => Promise<unknown>) {
    setError("");
    try {
      await action();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <article>
      <p className="text-sm">
        <span className="font-semibold">{comment.displayName}</span>{" "}
        <time className="text-ink/60" dateTime={comment.createdAt}>
          {new Date(comment.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
        </time>
        {comment.editedAt !== null && <span className="text-ink/60"> · edited</span>}
      </p>
      {comment.status === "held" && (
        <p className="text-xs text-ink/70 mt-1">Your comment is awaiting review.</p>
      )}

      {mode === "edit" ? (
        <CommentForm
          label="Edit comment"
          initial={comment.body}
          submitLabel="Save"
          onCancel={() => setMode("view")}
          onSubmit={async (body) => {
            await api.edit(token!, comment.commentId, body);
            setMode("view");
            await onChanged();
          }}
        />
      ) : (
        // Rendered as text, never as HTML.
        <p className="mt-1 whitespace-pre-line text-ink/90">{comment.body}</p>
      )}

      {token !== null && mode !== "edit" && (
        <div className="flex gap-4 mt-1">
          {canReply && onReply !== undefined && mode === "view" && (
            <button type="button" className={buttonClass} onClick={() => setMode("reply")}>
              Reply
            </button>
          )}
          {comment.mine && mode === "view" && (
            <>
              <button type="button" className={buttonClass} onClick={() => setMode("edit")}>
                Edit
              </button>
              <button type="button" className={buttonClass} onClick={() => setMode("confirmDelete")}>
                Delete
              </button>
            </>
          )}
          {mode === "confirmDelete" && (
            <>
              <span className="text-sm">Delete this comment?</span>
              <button
                type="button"
                className={buttonClass}
                onClick={() => void run(async () => {
                  await api.remove(token, comment.commentId);
                  await onChanged();
                })}
              >
                Yes, delete
              </button>
              <button type="button" className={buttonClass} onClick={() => setMode("view")}>
                Cancel
              </button>
            </>
          )}
          {!comment.mine && mode === "view" &&
            (reported ? (
              <span className="text-sm text-ink/60">Reported. Thank you.</span>
            ) : (
              <button
                type="button"
                className={buttonClass}
                onClick={() => void run(async () => {
                  await api.report(token, comment.commentId);
                  setReported(true);
                })}
              >
                Report
              </button>
            ))}
        </div>
      )}
      {error !== "" && <p className="text-sm text-red-700 mt-1">{error}</p>}

      {mode === "reply" && onReply !== undefined && (
        <div className="mt-3 ml-6">
          <CommentForm
            label={`Reply to ${comment.displayName}`}
            submitLabel="Reply"
            onCancel={() => setMode("view")}
            onSubmit={async (body) => {
              await onReply(body);
              setMode("view");
            }}
          />
        </div>
      )}
    </article>
  );
}

function CommentForm({
  label,
  initial = "",
  submitLabel = "Post comment",
  onSubmit,
  onCancel,
}: {
  label: string;
  initial?: string;
  submitLabel?: string;
  onSubmit: (body: string) => Promise<void>;
  onCancel?: () => void;
}) {
  const [body, setBody] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSubmit(body);
      setBody("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="mt-2">
      <label className="block text-sm text-ink/80 mb-1">
        {label}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={2000}
          rows={4}
          required
          className="mt-1 block w-full rounded border border-ink/20 bg-paper p-2 text-base"
        />
      </label>
      {error !== "" && <p className="text-sm text-red-700 mt-1">{error}</p>}
      <div className="flex gap-3 mt-2">
        <button type="submit" disabled={busy || !body.trim()} className={primaryClass}>
          {submitLabel}
        </button>
        {onCancel !== undefined && (
          <button type="button" className={buttonClass} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
