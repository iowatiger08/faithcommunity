import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

interface Session {
  num: string;
  title: string;
  desc: string;
}

const sessions: Session[] = [
  {
    num: "Session 1",
    title: "How We Feel: Emotions & Communication",
    desc: "Mapping each other's inner weather — what you do with your strongest feelings, and how you respond when your partner carries theirs.",
  },
  {
    num: "Session 2",
    title: "Where We Come From: Values, Faith & Expectations",
    desc: "Every marriage contains two family traditions and two pictures of “normal.” Spoken aloud, those pictures become choices you make together.",
  },
  {
    num: "Session 3",
    title: "Oh — Have You Thought About…?",
    desc: "The practical covenant: money, children, work, home, in-laws — and the rules for how you will fight, decided while you still like each other.",
  },
];

export default function Counseling() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Marriage &amp; Couples Conversations"
        description="Premarital and marriage counseling sessions in the pastoral tradition — three honest conversations about emotions, values, faith, and the practical covenant of a shared life. Open to all couples."
        path="/counseling/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Marriage &amp; Couples
      </p>
      <h1 className="font-serif text-4xl mb-8 leading-tight">
        Three conversations before (or during) a shared life.
      </h1>

      <div className="space-y-6 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          Love decides to marry; logistics decide how the marriage feels on a
          Wednesday in February. These sessions are honest, unhurried
          conversations with a minister &mdash; for couples preparing to marry,
          and for couples already married who want to tend what they have
          built. Every couple is welcome here, whatever your traditions,
          backgrounds, or story.
        </p>
        <p>
          This is pastoral conversation, not licensed therapy. If something
          surfaces that needs clinical care, we will help you find the right
          professional support &mdash; see our{" "}
          <Link to="/care" className="text-accent underline underline-offset-2 hover:no-underline">
            care &amp; support resources
          </Link>
          .
        </p>
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-2xl mb-6">The three sessions</h2>
        <ul className="space-y-6">
          {sessions.map((s) => (
            <li key={s.num} className="rounded-lg border border-ink/10 p-6">
              <p className="text-xs uppercase tracking-widest text-accent mb-1">
                {s.num}
              </p>
              <h3 className="font-serif text-xl mb-2">{s.title}</h3>
              <p className="text-ink/70">{s.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl mb-4">How it works</h2>
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
          <p>
            Sessions run about an hour each, in person in central Iowa or by
            video, spaced a few weeks apart. Each session comes with a
            worksheet you complete separately and then discuss together.
            Sessions are offered freely; couples who wish to support the
            ministry may{" "}
            <Link to="/give" className="text-accent underline underline-offset-2 hover:no-underline">
              offer a gift
            </Link>
            , and no one is ever turned away.
          </p>
          <p>
            Planning a wedding as well? We are glad to talk about officiating
            &mdash; reach out and tell us your story.
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/contact"
            className="inline-block rounded-md bg-accent text-white px-6 py-3 hover:opacity-90"
          >
            Start the conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
