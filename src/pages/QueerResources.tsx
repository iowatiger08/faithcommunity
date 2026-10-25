import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";
import ReflectionList from "~/components/ReflectionList";
import { StatList, StatSection } from "~/components/research/StatList";
import {
  acceptance,
  church,
  comingOut,
  faith,
  marriage,
  older,
  rejection,
  scale,
  work,
} from "~/components/research/stats";

// Repeated on every inline link; named so the JSX stays readable.
const linkClass = "text-accent underline underline-offset-2 hover:no-underline";

// Section anchors, in page order. Used for the jump list at the top and to
// give every section an id to return to.
const SECTIONS: Array<{ id: string; label: string }> = [
  { id: "meaning", label: "What it means" },
  { id: "coming-out", label: "Coming out" },
  { id: "research", label: "What the research says" },
  { id: "risk", label: "Acceptance and risk" },
  { id: "lifetime", label: "Across a lifetime" },
  { id: "church-faith", label: "Church, faith, and marriage" },
  { id: "organizations", label: "Affirming organizations" },
  { id: "community", label: "Community resources" },
  { id: "iowa", label: "In Iowa" },
  { id: "youth", label: "Youth resources" },
  { id: "reading", label: "Further reading" },
];

function JumpList() {
  return (
    <nav aria-label="On this page" className="mt-10 border-t border-ink/10 pt-6">
      <p className="text-xs uppercase tracking-widest text-ink/50 mb-3">
        On this page
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {SECTIONS.map((sec) => (
          <li key={sec.id}>
            <a href={`#${sec.id}`} className={linkClass}>
              {sec.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Anchors back to the jump list rather than the raw top of the document, so
 *  the reader lands somewhere they can navigate from. */
function BackToTop() {
  return (
    <p className="mt-6 text-xs">
      <a href="#top" className="text-ink/50 hover:text-accent">
        &uarr; Return to top
      </a>
    </p>
  );
}

export default function QueerResources() {
  return (
    <>
      <div className="w-full overflow-hidden" style={{ maxHeight: "380px" }}>
        <img
          src="/images/stockPrideFlag.jpeg"
          alt="A rainbow pride flag"
          className="w-full object-cover object-center"
          style={{ maxHeight: "380px" }}
        />
      </div>
    <div id="top" className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Queer Resources"
        description="Affirming faith resources for LGBTQ+ people and families — support for coming out, sourced research on acceptance and risk, welcoming organizations, community and youth resources, and further reading."
        path="/queer-resources/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Welcome &amp; Belonging
      </p>
      <h1 className="font-serif text-4xl mb-6 leading-tight">
        Beloved, You are welcome, You are love
      </h1>

      <div className="space-y-5 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          Hope and Truth Ministry is welcoming and affirming. If you are LGBTQ+, queer,
          transgender, or questioning, you are welcome
          here &mdash; fully, with Spirit, as you are. You are a child of God.
          God is love, and God calls you to be love (1 John 4:7-8).
        </p>
        <p>
          These resources share a few organizations for support, along with
          readings for LGBTQ+ people, their families, and those seeking a
          faith that makes room for you as a person. While some have used verses to clobber and
          condemn people, there are verses that invite us to live into our
          being as children of God. As Paul writes in Galatians 3:28, in Christ
          the old dividing lines fall away &mdash; we are all one; and in
          1 Corinthians 12:27, Paul writes that we are all parts of the same
          body. Some have erroneously used scripture and religion to inflict pain and harm,
          but God made us just beautiful the way we are.{" "}
          &ldquo;Love never ends&rdquo; (1 Corinthians 13:8).
        </p>
      </div>

      <JumpList />

      <section id="meaning" className="mt-12">
        <h2 className="font-serif text-2xl mb-3">
          What does it mean to be LGBTQ+?
        </h2>
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
          <p>
            Queer, or LGBTQ+, is an umbrella &mdash; lesbian, gay, bisexual,
            transgender, questioning (queer), and more &mdash; that describes the many ways
            people experience attraction, love, gender, and identity.
            Each one of the &quot;letters&quot; represent also a spectrum in of themselves.
            These are part of the natural, beautiful diversity of life.
          </p>
          <p>
            It is more than labels. It is who we are.
            If you identify as queer, you can be yourself and a person of
            faith. A growing community of churches, ministers, and many more
            affirm that queer people are made in the image of God and called,
            like everyone, to lives of love and integrity (Genesis 1:26-27a).
            If you are just beginning to wonder what that means for you,
            take your time. Coming to terms with the self &mdash; that needs no hurry.
          </p>
        </div>
        <BackToTop />
      </section>

      <section id="coming-out" className="mt-14">
        <h2 className="font-serif text-2xl mb-3">Coming out</h2>
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
          <p>
            For a queer person, coming out &mdash; is sharing who you are with others and with self &mdash;
            This is deeply personal. There is no single right way and no schedule one
            needs to declare. First we have to come to terms with the self and be
            honest. Then, for people around us, there is a process and there are
            decisions. The path varies, but being true to the self is what matters.
          </p>
          <p>
            For some it is a joyful announcement; for some there are doubts;
            for others it is quiet, gradual, and shared only where it feels
            safe. Most times, there is release from the shackles of silence and
            fear. It is the first step to a new life of being true to the self.
          </p>
          <p>
            We quickly realize that this is not a single,
            one-and-done event. It happens over a lifetime. Each time one meets
            new people or goes to a new place, there are choices.
          </p>
          <p>
            Safety and well-being come first. We choose when, how,
            and with whom to share our story, because it is from you. It is okay to wait until we
            are ready or until circumstances feel safe. if you are questioning, wherever you are in that
            journey, you are not alone, and you are worthy of love and support at
            every step.
          </p>
        </div>
        <p className="mt-8 font-medium text-ink/90 max-w-prose">
          Nearly all LGBTQ adults have told someone. Fewer than half say all of
          their parents are accepting.
        </p>
        <StatList items={comingOut} />
        <BackToTop />
      </section>

      {/* ── Research ───────────────────────────────────────────────────────────── */}
      <section id="research" className="mt-16">
        <h2 className="font-serif text-2xl mb-3">What the research says</h2>
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
          <p>
            One consideration before these statistics: LGBTQ+ young people are not at
            higher risk because of who they are. They are at higher risk because of
            how they are treated. That is the framing the researchers themselves
            use, and it matters, because it means the risk can change. People and
            environment can change.
          </p>

          <p>
            Coming out happens over a lifetime rather than in a single moment: a
            teenager deciding whether to tell their parents, an adult deciding
            whether to tell a manager, someone in their eighties deciding whether
            it is safe to be known in a care home.
          </p>
        </div>
        <BackToTop />
      </section>

      <section id="risk" className="mt-14">
        <h3 className="font-serif text-xl border-b border-ink/10 pb-2">
          Acceptance and risk
        </h3>
        <StatSection
          id="acceptance"
          title="What acceptance does"
          takeaway="One accepting adult is linked to 40% lower odds of a suicide attempt."
          items={acceptance}
        />
        <StatSection
          id="rejection"
          title="What rejection does"
          takeaway="Family rejection is linked to much higher rates of suicide attempts, depression, and drug use."
          items={rejection}
        />
        <StatSection
          id="reality"
          title="Reality is"
          takeaway="More than a third of LGBTQ+ young people seriously considered suicide in the past year, nationally and in Iowa."
          items={scale}
        />

        {/* Crisis resources sit in the same part of the page as the risk figures,
            deliberately — not buried at the bottom. */}
        <div className="mt-10 rounded-lg border-2 border-accent/40 bg-accent/5 p-6">
          <h4 className="font-serif text-lg mb-2">
            If you or someone you love is in crisis
          </h4>
          <ul className="space-y-2 text-ink/80">
            <li>
              <span className="font-semibold">Call or text 988</span> &mdash; Suicide
              &amp; Crisis Lifeline, 24/7, free and confidential.
            </li>
            <li>
              <span className="font-semibold">The Trevor Project</span> &mdash; for LGBTQ+
              young people. Call 1-866-488-7386 or text START to 678-678.
            </li>
            <li>
              <span className="font-semibold">LGBT National Youth Talkline</span> &mdash;
              1-800-246-7743.
            </li>
          </ul>
          <p className="text-sm text-ink/70 mt-4">
            More, including recovery and family support, on the{" "}
            <Link to="/care#crisis" className={linkClass}>
              care &amp; support page
            </Link>
            .
          </p>
        </div>
        <BackToTop />
      </section>

      <section id="lifetime" className="mt-14">
        <h3 className="font-serif text-xl border-b border-ink/10 pb-2">
          Across a lifetime
        </h3>
        <StatSection
          id="work"
          title="At work"
          takeaway="Nearly half of LGBTQ workers have faced discrimination or harassment at work, and those who are out report it more often."
          items={work}
        >
          <p>
            Since 2020 this has been settled federal law. In{" "}
            <em>Bostock v. Clayton County</em> the Supreme Court held that Title
            VII&apos;s ban on sex discrimination covers sexual orientation and
            gender identity, which means firing someone for being gay or
            transgender is illegal employment discrimination nationwide. Every
            figure below was gathered after that ruling.
          </p>
          <p>
            In Iowa, efforts have reversed acceptance gains recently. In February
            2025, the state removed gender identity from the Iowa Civil Rights
            Act, effective that July &mdash; the first state in the country to
            repeal a protection of that kind rather than simply never having had
            one. Sexual orientation remains protected under Iowa law, and the
            federal employment protection still stands. For transgender
            Iowans, the state-level protections covering housing, wages, and
            public accommodations are gone.
          </p>
        </StatSection>
        <StatSection
          id="older"
          title="Growing older"
          takeaway="LGBT adults over 50 are twice as likely to live alone, and more than half report feeling isolated."
          items={older}
        >
          <p>
            Almost all of the research on this subject is about young people. The
            figures below are about adults over 50.
          </p>
        </StatSection>
        <BackToTop />
      </section>

      <section id="church-faith" className="mt-14">
        <h3 className="font-serif text-xl border-b border-ink/10 pb-2">
          Church, faith, and marriage
        </h3>
        <StatSection
          id="church"
          title="What young people say about church"
          takeaway="The Black LGBTQ+ young people surveyed are least likely to be out in their faith community: 20.1%, fewer than are out to family, friends, or people at school."
          items={church}
        >
          <p>
            Two limits on these figures, which matter for how they are used. They come
            from HRC surveys of Black and Latine LGBTQ+ young people, so they
            describe those groups rather than all young people. And the surveys
            asked each respondent about their own religious upbringing without
            recording a denomination or tradition &mdash; so the figures say
            nothing about any particular church, denomination, or community, and
            should not be quoted as though they did.
          </p>
        </StatSection>
        <StatSection
          id="faith"
          title="Faith importance?"
          takeaway="Valuing religion showed no link to suicide risk in either direction."
          items={faith}
        />
        <StatSection
          id="marriage"
          title="Marriage"
          takeaway="Support for same-sex marriage stands at 65%, down from 71% in 2022 and 2023."
          items={marriage}
        />
        <BackToTop />
      </section>

      <section id="organizations" className="mt-16">
        <h2 className="font-serif text-2xl mb-8">Affirming organizations</h2>
        <ul className="space-y-6">
          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://www.reconcilingworks.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              ReconcilingWorks
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              Lutherans for Full Participation &mdash; a national organization
              embracing the full welcome, inclusion, and equality of LGBTQ+
              people in the life of the church, with education and support for
              individuals, families, and congregations.
            </p>
          </li>

          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://openandaffirming.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              Open and Affirming Coalition (UCC)
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              The United Church of Christ&apos;s ministry for the full inclusion
              of LGBTQ+ people. Maintains a directory of Open and Affirming
              congregations and resources for churches on the welcoming journey.
            </p>
          </li>

          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://www.episcopalchurch.org/who-we-are/ministries/gender-justice/lgbtq-in-the-church/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              The Episcopal Church
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              The Episcopal Church offers support and inclusion for
              LGBTQ+ people. One can find resources and directory of affirming Episcopal parishes.
            </p>
          </li>
        </ul>
        <BackToTop />
      </section>

      <section id="community" className="mt-14">
        <h2 className="font-serif text-2xl mb-3">Community resources</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-8">
          Beyond churches, these organizations offer support, connection, and
          advocacy for LGBTQ+ people and those who love them.
        </p>
        <ul className="space-y-6">
          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://pflag.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              PFLAG
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              The nation&apos;s largest organization for LGBTQ+ people, their
              families, and allies, with local chapters offering peer support,
              education, and community.
            </p>
          </li>

          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://www.hrc.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              Human Rights Campaign
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              A leading LGBTQ+ civil rights organization offering research,
              advocacy, and practical resources on workplaces, healthcare,
              families, and religion and faith.
            </p>
          </li>
          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://www.hrc.org/resources/coming-out"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              Human Rights Campaign &mdash; coming out resources
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              Guides written for the person coming out and for the people they
              are coming out to, including workplaces, families, and faith
              communities.
            </p>
          </li>
        </ul>
        <BackToTop />
      </section>

      <section id="iowa" className="mt-14">
        <h2 className="font-serif text-2xl mb-3">In Iowa</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-8">
          Statewide and Des Moines organizations for LGBTQ+ Iowans, their
          families, and students.
        </p>
        <ul className="space-y-6">
          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://oneiowa.org/resources/hotlines-support/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              One Iowa
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              Statewide LGBTQ+ advocacy, health care referrals, and a directory
              of hotlines and support groups.
            </p>
          </li>

          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://iowasafeschools.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              Iowa Safe Schools
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              Safe and affirming spaces for LGBTQ+ youth in Iowa schools since
              2002.
            </p>
          </li>

          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://capitalcitypride.org/resources/lgbtq-organizations/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              Capital City Pride
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              A directory of LGBTQ+ organizations around Des Moines.
            </p>
          </li>

          <li className="border border-ink/10 rounded-lg p-6">
            <p className="font-serif text-xl">Matthew Shepard Scholarship</p>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              College scholarships for LGBTQ+ Iowa students who have served the
              LGBTQ+ community, awarded by the Eychaner Foundation in Des
              Moines.
            </p>
          </li>
        </ul>
        <BackToTop />
      </section>

      <section id="youth" className="mt-14">
        <h2 className="font-serif text-2xl mb-3">Youth resources</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-8">
          For LGBTQ+ youth and their families &mdash; safe, affirming spaces and
          confidential support, including crisis help if you need someone to talk
          to right now.
        </p>
        <ul className="space-y-6">
          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://www.thetrevorproject.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              The Trevor Project
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              Crisis intervention and suicide prevention for LGBTQ+ young people,
              with free, confidential 24/7 support by phone, text, and chat, plus
              a peer community.
            </p>
          </li>

          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://gsanetwork.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              GSA Network
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              A youth-led network connecting school-based Gender and Sexuality
              Alliance clubs, empowering LGBTQ+ students to build community and
              lead change in their schools.
            </p>
          </li>

          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://pflag.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              PFLAG &mdash; for families
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              Support and education for parents, caregivers, and families of
              LGBTQ+ youth learning how to affirm and stand alongside their
              children.
            </p>
          </li>
        </ul>
        <BackToTop />
      </section>

      <section id="reading" className="mt-14">
        <h2 className="font-serif text-2xl mb-8">Further reading</h2>

        <div className="mb-10">
          <ReflectionList />
        </div>
        <ul className="space-y-6">
          <li className="border border-ink/10 rounded-lg p-6">
            <p className="font-serif text-xl">
              Queer Theology{" "}
              <span className="text-base text-ink/60 italic">
                by Linn Marie Tonstad
              </span>
            </p>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              A concise, rigorous introduction that asks what it means to do
              theology queerly &mdash; not merely including LGBTQ+ people in
              existing frameworks, but letting queer experience reshape how we
              think about God, the body, and the church.
            </p>
          </li>

          <li className="border border-ink/10 rounded-lg p-6">
            <p className="font-serif text-xl">
              Radical Love: An Introduction to Queer Theology{" "}
              <span className="text-base text-ink/60 italic">
                by Patrick S. Cheng
              </span>
            </p>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              An accessible, welcoming introduction that frames queer theology
              around the &ldquo;radical love&rdquo; at the heart of the Christian
              story &mdash; a good first book for readers new to the field.
            </p>
          </li>

          <li className="border border-ink/10 rounded-lg p-6">
            <p className="font-serif text-xl">
              Christianity, Social Tolerance, and Homosexuality{" "}
              <span className="text-base text-ink/60 italic">
                by John Boswell
              </span>
            </p>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              A landmark historical study showing that the church&apos;s
              attitudes toward same-sex love have shifted dramatically over the
              centuries &mdash; and were often far more tolerant than many assume
              today.
            </p>
          </li>
        </ul>
        <p className="mt-6 text-ink/80 max-w-prose leading-relaxed">
          For essays, podcasts, and an online community exploring LGBTQ+
          Christian faith, visit{" "}
          <a
            href="https://www.queertheology.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:no-underline"
          >
            QueerTheology.com
          </a>
          .
        </p>
        <BackToTop />
      </section>

      <div className="mt-16 pt-8 border-t border-ink/10 space-y-4">
        <p className="text-ink/70 max-w-prose leading-relaxed text-sm">
          Figures on this page are drawn from The Trevor Project&apos;s national
          and state surveys and research briefs, the Human Rights Campaign
          Foundation&apos;s LGBTQ+ Youth Reports and Community Insights surveys,
          the Family Acceptance Project at San Francisco State University, Pew
          Research Center, the Williams Institute at UCLA School of Law, SAGE and
          the National Resource Center on LGBT Aging, Gallup, and PRRI&apos;s
          American Values Atlas. Each is named with its year beside the figure.
        </p>
        <p className="text-ink/70 max-w-prose leading-relaxed text-sm">
          Looking for someone to talk with? You&apos;ll find pastoral care and
          support on our{" "}
          <Link to="/care" className="text-accent underline">
            Care page
          </Link>
          , or reach out directly through the{" "}
          <Link to="/contact" className="text-accent underline">
            contact page
          </Link>{" "}
          &mdash; you are always welcome here.
        </p>
      </div>
    </div>
    </>
  );
}
