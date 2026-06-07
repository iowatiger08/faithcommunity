import PageHead from "~/components/PageHead";
import { VANDERBILT_RCL } from "~/components/SeasonBadge";

export default function About() {
  return (
    <>
      <div className="w-full overflow-hidden" style={{ maxHeight: "380px" }}>
        <img
          src="/images/iowa-gravel-path.jpg"
          alt="A gravel path winding through the Iowa countryside alongside yellow wildflowers"
          className="w-full object-cover object-center"
          style={{ maxHeight: "380px" }}
        />
      </div>
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="About"
        description="Hope and Truth Ministry is a spiritual home and a launchpad — a place to find inspiration, gather practical resources, and discover how to build your own ministry or nonprofit organization."
        path="/about/"
      />
      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Hope &amp; Truth Ministry
      </p>
      <h1 className="font-serif text-5xl mb-8 leading-tight">
        A ministry without walls.
      </h1>

      <div className="space-y-6 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          Hope and Truth Ministry is a spiritual home and a launchpad. A place
          to find inspiration, gather practical resources, and discover how to
          build something of your own &mdash; a congregation, a nonprofit, an
          organization rooted in your calling.
        </p>
        <p>
          It is open and affirming, interfaith and without walls. For the
          wandering, the doubting, the questioning, the hurting, and the
          hopeful. For those whose church is online. For those finding their
          way back. For those still seeking. And for those who are ready to
          begin building.
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
          neighbors &mdash; as ourselves.
        </p>
      </div>

      <h2 className="font-serif text-2xl mt-16 mb-4">The mission</h2>
      <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
        <p>
          Hope and Truth Ministry exists to provide a truly welcoming,
          open and affirming community to all people seeking meaning, purpose,
          and connection &mdash; no matter where they are on life&apos;s journey.
        </p>
        <p>
          Beyond the congregation, this ministry serves as a resource for
          anyone called to build &mdash; a church, a nonprofit, or a
          mission-driven organization of any kind. The resources here are
          offered to help inspire the vision with tools to sustain
          the work, and guidance for those just beginning to plant something
          new.
        </p>
      </div>

      <h2 className="font-serif text-2xl mt-16 mb-4">Our guiding posts</h2>
      <ul className="space-y-3 text-ink/80 max-w-prose leading-relaxed list-disc pl-6">
        <li>Growing in love of the Holy Presence and of all our neighbors.</li>
        <li>
          Providing a safe and sacred space for the many ways faith manifests in
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
        <li>
          Volunteering with community outreach in central Iowa, including the{" "}
          <a
            className="text-accent underline"
            href="https://ubfmdesmoines.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Urban Bicycle Food Ministry &mdash; Des Moines (UBFM-DSM)
          </a>{" "}
          and area food pantries.
        </li>
        <li>
          Connecting with broader voices for
          interfaith cooperation, including{" "}
          <a
            className="text-accent underline"
            href="https://interfaithalliance.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Interfaith Alliance
          </a>
          ,{" "}
          <a
            className="text-accent underline"
            href="https://www.ctschicago.edu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chicago Theological Seminary
          </a>
          ,{" "}
          <a
            className="text-accent underline"
            href="https://www.luthersem.edu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Luther Seminary
          </a>
          , and the{" "}
          <a
            className="text-accent underline"
            href="https://cac.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Center for Action and Contemplation
          </a>
          .
        </li>
      </ul>

      <h2 className="font-serif text-2xl mt-16 mb-4">Find your way in</h2>
      <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
        <p>
          Start wherever you are. The{" "}
          <a className="text-accent underline" href="/sermons">sermons</a>{" "}
          follow the rhythm of the{" "}
          <a
            href={VANDERBILT_RCL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:no-underline"
          >
            Revised Common Lectionary
          </a>{" "}
          &mdash; new writing arrives most weeks. The{" "}
          <a className="text-accent underline" href="/meditations">
            meditations
          </a>{" "}
          are there for those who want to be still. The{" "}
          <a className="text-accent underline" href="/publications">
            Publications hub
          </a>{" "}
          gathers inspiration, resources, and work ideation for those called
          to build something. And the{" "}
          <a className="text-accent underline" href="/contact">
            contact page
          </a>{" "}
          is always open &mdash; for a question, a prayer request, or an
          idea you are ready to explore.
        </p>
      </div>

      <div className="mt-16 pt-8 border-t border-ink/10">
        <p className="font-serif text-2xl text-ink/80">
          <i>Jesus came and stood among them and said, "Peace be with you." (John 20:19b)</i>
        </p>
      </div>
    </div>
    </>
  );
}
