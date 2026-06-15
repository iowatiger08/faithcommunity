import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

export default function FourNobleTruths() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="The Four Noble Truths and Eightfold Path"
        description="The foundational teachings of the Buddha — the Four Noble Truths and the Eightfold Path — with reflections on their alignment with Judeo-Christian scripture."
        path="/four-noble-truths/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Wisdom Across Traditions
      </p>
      <h1 className="font-serif text-4xl mb-3 leading-tight">
        The Four Noble Truths<br />and Eightfold Path
      </h1>
      <p className="font-serif text-xl text-ink/60 mb-10 italic">from The Buddha</p>

      <div className="space-y-5 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          The foundation of Buddhism are the Four Noble Truths and the
          Eightfold Path. These were taught by the Buddha (meaning
          &ldquo;Enlightened One&rdquo;) thousands of years ago. As scholar
          Rupert Gethin describes, these teachings form the doctrinal core
          from which all Buddhist thought and practice flows (Gethin, 1998).
          If you consider aspects of the Hebrew Bible and the Gospels, one
          may find some striking alignment. See how similar these are to some
          Judeo-Christian scriptures.
        </p>
      </div>

      {/* Four Noble Truths */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-8">Four Noble Truths</h2>
        <ol className="space-y-6">
          {[
            "All life is suffering and suffering unavoidable.",
            "All suffering is caused by attachment to desire.",
            "For cessation of suffering, one must overcome attachment to the desires.",
            "Walking the Eightfold Path is the way to cessation.",
          ].map((truth, i) => (
            <li key={i} className="flex gap-5">
              <span className="font-serif text-2xl text-accent/50 leading-none mt-0.5 shrink-0 w-6 text-right">
                {i + 1}.
              </span>
              <p className="text-ink/80 leading-relaxed">{truth}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Eightfold Path */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-3">The Eightfold Path</h2>
        <p className="text-ink/60 text-sm mb-8 italic">in Three Basic Divisions</p>

        <div className="space-y-10">

          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50 mb-4">Of Wisdom</p>
            <ul className="space-y-4 pl-1">
              {["Right View", "Right Thinking"].map((item) => (
                <li key={item} className="flex gap-3 items-baseline">
                  <span className="text-accent/60 shrink-0">&bull;</span>
                  <span className="font-serif text-lg text-ink/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50 mb-4">Of Ethics</p>
            <ul className="space-y-4 pl-1">
              {["Right Action", "Right Speech", "Right Livelihood"].map((item) => (
                <li key={item} className="flex gap-3 items-baseline">
                  <span className="text-accent/60 shrink-0">&bull;</span>
                  <span className="font-serif text-lg text-ink/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50 mb-4">Of Mental Discipline</p>
            <ul className="space-y-4 pl-1">
              {["Right Effort", "Right Mindfulness", "Right Concentration"].map((item) => (
                <li key={item} className="flex gap-3 items-baseline">
                  <span className="text-accent/60 shrink-0">&bull;</span>
                  <span className="font-serif text-lg text-ink/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* References */}
      <section className="mt-16 pt-8 border-t border-ink/10">
        <h2 className="font-serif text-lg mb-5 text-ink/70">References</h2>
        <ul className="space-y-3 text-sm text-ink/65 leading-relaxed">
          <li style={{ paddingLeft: "1.5em", textIndent: "-1.5em" }}>
            Gethin, R. (1998). <em>The foundations of Buddhism</em>. Oxford University Press.
          </li>
        </ul>
        <p className="text-xs text-ink/40 mt-4 italic">
          Teaching attributed to the historical Buddha (Siddh&#257;rtha Gautama,
          c.&thinsp;563&ndash;483 BCE); scholarly framing after Gethin (1998).
        </p>
      </section>

      <div className="mt-10 pt-6 border-t border-ink/10 space-y-3">
        <p className="text-ink/70 text-sm leading-relaxed max-w-prose">
          For more contemplative practices across traditions, visit the{" "}
          <Link to="/meditations" className="text-accent underline">
            Meditations
          </Link>{" "}
          page. For community mindfulness practice, see the{" "}
          <Link to="/congregational-sitting" className="text-accent underline">
            Congregational Sitting Practice
          </Link>.
        </p>
        <p className="text-xs text-ink/50">
          Presentation &copy; Tony E Hansen / Hope and Truth Ministry.{" "}
          <Link to="/terms" className="underline hover:text-ink/70">
            Terms of use &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
