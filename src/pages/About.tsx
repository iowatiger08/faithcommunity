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
      <h1 className="font-serif text-4xl mb-8 leading-tight">
        Be hope, be love, live with truth.
      </h1>

      <div className="space-y-6 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          Hope and Truth Ministry is a non-denominational spiritual respite. A place
          to find inspiration, collect your thoughts, meditate and find the Spirit working.
        </p>
        <p>
          It is interfaith and without walls (online). For the
          wondering, the doubting, the questioning, the hurting, and the
          hopeful. For those finding their way back. For those still seeking.
        </p>
      </div>

      <h2 className="font-serif text-2xl mt-16 mb-4">What we believe matters</h2>
      <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
        <p>
          That the sacred texts meet us where we are. That divine wisdom is
          wider than any one tradition. That the questions you carry are
          welcome &mdash; including the hard ones - knowing that you are not alone.
        </p>
        <p>
          We are committed to a progressive theology of <em>welcome</em> and <em>liberation</em>.
          One that affirms
          equity and access, that honors how different people come to the
          Creator through different paths, that leaves judgment to the One
          who made us, and that takes seriously the call to love our
          neighbors &mdash; as ourselves.
        </p>
      </div>

      <h2 className="font-serif text-2xl mt-16 mb-4">The mission</h2>
      <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
        <p>
          Hope and Truth Ministry is here to provide a truly welcoming,
          open and interfaith online community to anyone seeking meaning, purpose,
          and connection &mdash; no matter where they are on life&apos;s journey.
          We work to end all bigotry and racism while providing a safe space for contemplation.
        </p>
        <p>
          Beyond a congregation, this ministry serves as a resource for
          those individuals who feel called to &mdash; ministry or a
          mission-driven organization.  Resources here are
          offered to help inspire the vision with tools to sustain
          the work, and guidance for those just beginning to plant something
          new.
        </p>
      </div>

      <h2 className="font-serif text-2xl mt-16 mb-4">Our guiding posts</h2>
      <ul className="space-y-3 text-ink/80 max-w-prose leading-relaxed list-disc pl-6">
        <li>Growing in love of the Holy Presence and neighbors.</li>
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
          Building coalitions with others who pursue justice, and
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

      <h2 className="font-serif text-2xl mt-16 mb-4">You are welcome here</h2>
      <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
        <p>
          The{" "}
          <a className="text-accent underline" href="/sermons">sermons and reflections</a>{" "}
          typically follow the{" "}
          <a
            href={VANDERBILT_RCL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:no-underline"
          >
            Revised Common Lectionary
          </a>{" "}
          &mdash; a new piece arrives most weeks. These along with the{" "}
          <a className="text-accent underline" href="/meditations">
            meditations
          </a>{" "}
          are for contemplation and considerations. The{" "}
          <a className="text-accent underline" href="/publications">
            Publications hub
          </a>{" "}
          helps to gather inspiration, resources, and ideation for those who feel called to something more. The{" "}
          <a className="text-accent underline" href="/contact">
            contact page
          </a>{" "}
          is always open &mdash; for questions or prayer requests.
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
