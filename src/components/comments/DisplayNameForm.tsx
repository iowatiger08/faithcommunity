import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "~/lib/commentsApi";

const primaryClass =
  "px-4 py-2 rounded bg-accent text-white text-sm hover:opacity-90 disabled:opacity-50";

export default function DisplayNameForm({
  token,
  initial = "",
  onSaved,
}: {
  token: string;
  initial?: string;
  onSaved: (name: string) => void;
}) {
  const [name, setName] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onSaved((await api.setName(token, name)).displayName);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="mb-8 p-4 border border-ink/10 rounded">
      {initial === "" && <CommunityGuidelines />}
      <label className="block text-sm text-ink/80 mb-1">
        Display name, shown with your comments
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          required
          className="mt-1 block w-full rounded border border-ink/20 bg-paper p-2 text-base"
        />
      </label>
      <p className="text-xs text-ink/60">
        A first name or a nickname is fine. Your email address is never shown.
      </p>
      {error !== "" && <p className="text-sm text-red-700 mt-1">{error}</p>}
      <button type="submit" disabled={busy || !name.trim()} className={`${primaryClass} mt-3`}>
        Save name
      </button>
    </form>
  );
}

function CommunityGuidelines() {
  return (
    <div className="text-sm text-ink/80 mb-4">
      <p className="font-semibold mb-1">Before your first comment</p>
      <p>
        Comments here are public. Please be kind and stay on the subject of the post. Comments with
        harassment, threats, hate, explicit content, spam, or private details about other people,
        including whether someone is out, are held or removed. See the{" "}
        <Link to="/terms/" className="text-accent hover:underline">
          terms
        </Link>{" "}
        and{" "}
        <Link to="/privacy/" className="text-accent hover:underline">
          privacy notice
        </Link>
        .
      </p>
    </div>
  );
}
