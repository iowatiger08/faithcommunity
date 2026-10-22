import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";
import ReflectionList from "~/components/ReflectionList";

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
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Queer Resources"
        description="Affirming faith resources for LGBTQ+ people and families — welcoming organizations, support for coming out, community and youth resources, and further reading."
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

      <section className="mt-12">
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

      </section>

      <section className="mt-14">
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
      </section>

      <section className="mt-16">
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
      </section>

      <section className="mt-14">
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
      </section>

      <section className="mt-14">
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
      </section>

      <section className="mt-14">
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
      </section>

      <section className="mt-14">
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
      </section>

      <div className="mt-16 pt-8 border-t border-ink/10">
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
