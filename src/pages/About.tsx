import PageHead from "~/components/PageHead";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="About"
        description="Hope and Truth Ministry is an open and affirming online ministry — a gathering place for the wandering, the doubting, the hurting, and the hopeful. Wherever you are on the journey, there is space for you."
        path="/about/"
      />
      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Hope &amp; Truth Ministry
      </p>
      <h1 className="font-serif text-5xl mb-8 leading-tight">
        A congregation of the whole internet.
      </h1>

      <div className="space-y-6 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          Are you in a wilderness? Unsure what path to take? You are welcome
          here.
        </p>
        <p>
          Hope and Truth Ministry is an open and affirming ministry &mdash; a
          gathering place for the wandering, the doubting, the questioning, the
          hurting, and the hopeful. For people without a congregation, for
          people who have left one, for people who are looking for one, and for
          people who simply want to think faithfully alongside someone else.
          Wherever you are on the journey, there is space for you in this
          gathering.
        </p>
      </div>

      <h2 className="font-serif text-2xl mt-16 mb-4">What we believe matters</h2>
      <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
        <p>
          That the Gospel meets us where we are, not where we&apos;re told to
          be. That divine wisdom is wider than any one tradition. That the
          questions you carry are welcome &mdash; even the hard ones, even the
          ones the church has historically refused to hear.
        </p>
        <p>
          We are committed to a theology of <em>welcome</em>, not gatekeeping.
          One that affirms equity and access, that honors how different people
          come to the Creator through different paths, that leaves judgment to
          the One who made us, and that takes seriously the call to love our
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
          The full archive &mdash; sixteen years of work and counting &mdash;
          is freely available. Browse the{" "}
          <a className="text-accent underline" href="/sermons">sermons</a>,
          drop in on{" "}
          <a className="text-accent underline" href="/worship-resources">
            worship resources
          </a>
          , or simply{" "}
          <a className="text-accent underline" href="/subscribe">
            join the gathering
          </a>{" "}
          and let new reflections arrive in your inbox.
        </p>
      </div>

      <div className="mt-16 pt-8 border-t border-ink/10">
        <p className="text-ink/60 italic">
          May the peace that passes understanding be with you on the road.
        </p>
      </div>
    </div>
  );
}
