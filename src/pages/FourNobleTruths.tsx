import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

const PATH: {
  division: string;
  sanskrit: string;
  elements: { name: string; details: string[] }[];
}[] = [
  {
    division: "Wisdom",
    sanskrit: "prajñā",
    elements: [
      {
        name: "Right View",
        details: ["Seeing the four truths"],
      },
      {
        name: "Right Intention",
        details: ["Desirelessness", "Friendliness", "Compassion"],
      },
    ],
  },
  {
    division: "Conduct",
    sanskrit: "śīla",
    elements: [
      {
        name: "Right Speech",
        details: [
          "Refraining from false speech",
          "Refraining from divisive speech",
          "Refraining from hurtful speech",
          "Refraining from idle chatter",
        ],
      },
      {
        name: "Right Action",
        details: [
          "Refraining from harming living beings",
          "Refraining from taking what is not given",
          "Refraining from sexual misconduct",
        ],
      },
      {
        name: "Right Livelihood",
        details: ["Not based on wrong speech and action"],
      },
    ],
  },
  {
    division: "Meditation",
    sanskrit: "samādhi",
    elements: [
      {
        name: "Right Effort",
        details: [
          "To prevent unarisen unwholesome states",
          "To abandon arisen unwholesome states",
          "To arouse unarisen wholesome states",
          "To develop arisen wholesome states",
        ],
      },
      {
        name: "Right Mindfulness",
        details: [
          "Contemplation of body",
          "Contemplation of feeling",
          "Contemplation of mind",
          "Contemplation of dharma",
        ],
      },
      {
        name: "Right Concentration",
        details: ["Practice of the four dhyānas"],
      },
    ],
  },
];

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
        <h2 className="font-serif text-2xl mb-2">The Noble Eightfold Path</h2>
        <p className="text-ink/50 text-xs mb-10 italic">
          After Gethin (1998, p. 81), Table 1
        </p>

        <div className="space-y-12">
          {PATH.map((division) => (
            <div key={division.division}>
              {/* Division header */}
              <div className="flex items-baseline gap-3 mb-6 pb-2 border-b border-ink/10">
                <h3 className="font-serif text-xl text-ink/90">{division.division}</h3>
                <span className="text-sm italic text-ink/40">({division.sanskrit})</span>
              </div>

              {/* Elements */}
              <div className="space-y-6">
                {division.elements.map((el) => (
                  <div key={el.name} className="grid sm:grid-cols-[10rem_1fr] gap-2 sm:gap-6">
                    <p className="font-medium text-ink/80 text-sm pt-0.5">{el.name}</p>
                    <ul className="space-y-1">
                      {el.details.map((d) => (
                        <li key={d} className="text-sm text-ink/65 leading-relaxed flex gap-2">
                          <span className="text-accent/40 shrink-0 mt-1">&bull;</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* References */}
      <section className="mt-16 pt-8 border-t border-ink/10">
        <h2 className="font-serif text-lg mb-5 text-ink/70">References</h2>
        <ul className="space-y-3 text-sm text-ink/65 leading-relaxed">
          <li style={{ paddingLeft: "1.5em", textIndent: "-1.5em" }}>
            Gethin, R. (1998). <em>The Foundations of Buddhism</em>. Oxford University Press.
          </li>
        </ul>
        <p className="text-xs text-ink/40 mt-4 italic">
          Teaching attributed to the historical Buddha (Siddh&#257;rtha Gautama,
          c.&thinsp;563&ndash;483 BCE); scholarly framing and table after Gethin (1998).
        </p>
      </section>

      <div className="mt-10 pt-6 border-t border-ink/10 space-y-3">
        <p className="text-ink/70 text-sm leading-relaxed max-w-prose">
          For more contemplative practices across traditions, visit the{" "}
          <Link to="/meditations" className="text-accent underline">
            Meditations
          </Link>{" "}
          page. For community mindfulness practice, see the{" "}
          <Link to="/community-sitting" className="text-accent underline">
            Community Sitting Practice
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
