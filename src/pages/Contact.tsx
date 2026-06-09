import { useState } from "react";
import type { FormEvent } from "react";
import PageHead from "~/components/PageHead";

const CATEGORIES = [
  "Prayer Request",
  "General Question",
  "Feedback / Reflection",
  "Other",
];

const API_URL = import.meta.env.VITE_CONTACT_API_URL;

export default function Contact() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!API_URL) throw new Error("Contact endpoint not configured.");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, category, message, website: honeypot }),
      });
      if (!res.ok) throw new Error("submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or check back later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <PageHead
        title="Contact"
        description="Send a prayer request, ask a question, or share a reflection. Every message is received with care."
        path="/contact/"
      />
      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Get in touch
      </p>
      <h1 className="font-serif text-4xl mb-6 leading-tight">
        We&apos;d love to hear from you.
      </h1>

      <div className="space-y-4 text-lg text-ink/80 max-w-prose leading-relaxed mb-10">
        <p>
          Send a prayer request, ask a question, or share a reflection on
          something you&apos;ve read here. Every message is received with care.
        </p>
      </div>

      {submitted ? (
        <div className="border border-accent/40 bg-accent/5 rounded p-6">
          <p className="font-serif text-xl mb-2">Thank you.</p>
          <p className="text-ink/80">
            Your message has been received. If you submitted a prayer request,
            know that you are held in care. We will be in touch if a response
            is needed.
          </p>
          <p className="text-sm text-ink/60 mt-4 italic">
            Subscription notifications are coming soon.
          </p>
        </div>
      ) : (
        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-5 max-w-md">
          {/* Honeypot — hidden from humans, bots fill it in */}
          <div style={{ display: "none" }} aria-hidden="true">
            <label>
              Website
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-ink/70">Your email *</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full border border-ink/20 rounded px-3 py-2 focus:outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="text-sm text-ink/70">Category *</span>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border border-ink/20 rounded px-3 py-2 focus:outline-none focus:border-accent bg-paper"
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-ink/70">Message *</span>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Your message…"
              className="mt-1 block w-full border border-ink/20 rounded px-3 py-2 focus:outline-none focus:border-accent resize-y"
            />
          </label>

          <label className="flex items-start gap-3 text-sm text-ink/50 cursor-not-allowed select-none">
            <input
              type="checkbox"
              disabled
              className="mt-0.5 opacity-40"
            />
            <span>
              Send me new sermons and reflections by email{" "}
              <span className="italic">(coming soon)</span>
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-accent text-paper rounded font-medium hover:bg-accent/90 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send message"}
          </button>
        </form>
      )}

      <div className="mt-16 pt-8 border-t border-ink/10 text-sm text-ink/60">
        <p>
          The full archive is freely browsable without contacting us &mdash;
          visit the{" "}
          <a href="/sermons" className="text-accent underline">
            sermons
          </a>{" "}
          or{" "}
          <a href="/worship-resources" className="text-accent underline">
            worship resources
          </a>
          .
        </p>
      </div>
    </div>
  );
}
