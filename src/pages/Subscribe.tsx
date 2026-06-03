import { useState } from "react";
import type { FormEvent } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: wire up real backend (Lambda + SES or Buttondown).
    // For now this is a UI shell that records intent locally.
    if (!email.includes("@")) return;
    setSubmitted(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Join the gathering
      </p>
      <h1 className="font-serif text-4xl mb-6 leading-tight">
        Sermons and reflections, delivered when they arrive.
      </h1>

      <div className="space-y-4 text-lg text-ink/80 max-w-prose leading-relaxed mb-10">
        <p>
          Drop your email below and new sermons, reflections, and worship
          resources will arrive in your inbox &mdash; usually once a week,
          tied to the Sunday lectionary.
        </p>
        <p>
          No tracking, no sales pitches, no recommended-for-you algorithms.
          Just the writing, when it&apos;s ready.
        </p>
      </div>

      {submitted ? (
        <div className="border border-accent/40 bg-accent/5 rounded p-6">
          <p className="font-serif text-xl mb-2">Thank you.</p>
          <p className="text-ink/80">
            We&apos;ll be in touch when the next reflection is published.
          </p>
          <p className="text-sm text-ink/60 mt-4 italic">
            (Note: the subscription backend is not yet live. Your email was
            captured locally only; we&apos;ll be wiring up real delivery
            shortly. Check back, or visit the{" "}
            <a href="/sermons" className="text-accent underline">
              sermons archive
            </a>{" "}
            in the meantime.)
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <label className="block">
            <span className="text-sm text-ink/70">Your email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full border border-ink/20 rounded px-3 py-2 focus:outline-none focus:border-accent"
            />
          </label>
          <button
            type="submit"
            className="px-5 py-3 bg-accent text-paper rounded font-medium hover:bg-accent/90"
          >
            Subscribe
          </button>
        </form>
      )}

      <div className="mt-16 pt-8 border-t border-ink/10 text-sm text-ink/60">
        <p>
          The full archive is also freely browsable without an email &mdash;
          visit the{" "}
          <a href="/sermons" className="text-accent underline">sermons</a> or{" "}
          <a href="/worship-resources" className="text-accent underline">
            worship resources
          </a>
          .
        </p>
      </div>
    </div>
  );
}
