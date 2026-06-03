import PageHead from "~/components/PageHead";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="About"
        description="Hope and Truth Ministry is a congregation of people here and now — an open and affirming gathering for the wandering, the doubting, the questioning, the hurting, and the hopeful. Wherever you are on the journey, there is space for you."
        path="/about/"
      />
      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Hope &amp; Truth Ministry
      </p>
      <h1 className="font-serif text-5xl mb-8 leading-tight">
        A congregation of the whole.
      </h1>

      <div className="space-y-6 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          Are you in a wilderness? Looking for a path? You are welcome here.
        </p>
        <p>
          This gathering is a congregation of people here and now &mdash; an
          open and affirming community for the wandering, the doubting, the
          questioning, the hurting, and the hopeful. For those whose church is
          online. For those finding their way back. For those still seeking.
          For those who want to think faithfully alongside others. Wherever
          you are on the journey, there is space for you in this gathering.
        </p>
      </div>

      <h2 className="font-serif text-2xl mt-16 mb-4">What we believe matters</h2>
      <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
        <p>
          That the Gospel meets us right where we are. That divine wisdom is
          wider than any one tradition. That the questions you carry are
          welcome &mdash; including the hard ones, including the ones we are
          still learning to hear together.
        </p>
        <p>
          We are committed to a theology of <em>welcome</em>. One that affirms
          equity and access, that honors how different people come to the
          Creator through different paths, that leaves judgment to the One
          who made us, and that takes seriously the call to love our
          neighbors &mdash; all of them.
        </p>
      </div>

      <h2 className="font-serif text-2xl mt-16 mb-4">What we&apos;re for</h2>
      <ul className="space-y-3 text-ink/80 max-w-prose leading-relaxed list-disc pl-6">
        <li>Growing in love of the Holy Presence and of all our neighbors.</li>
        <li>
          Providing a safe and sacred space for the many ways faith shows up in
          our lives.
        </li>
        <li>
          Advocacy and education on issues of equity, civil rights, justice,
          and the dignity of every person.
        </li>
        <li>
          Honoring interfaith wisdom and the truth that emerges across
          traditions.
        </li>
        <li>
          Building coalitions with others who pursue justice, the Gospels, and
          good citizenship.
        </li>
      </ul>

      <h2 className="font-serif text-2xl mt-16 mb-4">How this gathering works</h2>
      <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
        <p>
          Sermons and reflections are posted in keeping with the Revised Common
          Lectionary, the three-year cycle that mainline Protestant
          congregations use to read through the Scriptures together. A new
          piece typically arrives weekly.
        </p>
        <p>
          Browse the{" "}
          <a className="text-accent underline" href="/sermons">sermons</a>,
          drop in on{" "}
          <a className="text-accent underline" href="/worship-resources">
            worship resources
          </a>
          , or{" "}
          <a className="text-accent underline" href="/subscribe">
            join the gathering
          </a>{" "}
          and let new reflections arrive in your inbox.
        </p>
      </div>

      <div className="mt-16 pt-8 border-t border-ink/10">
        <p className="font-serif text-2xl text-ink/80">
          Peace be with you.
        </p>
      </div>
    </div>
  );
}
