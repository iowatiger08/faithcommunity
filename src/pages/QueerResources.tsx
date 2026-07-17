import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

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
        You are beloved, You are welcomed, You are love
      </h1>

      <div className="space-y-5 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          Hope and Truth Ministry is welcoming and affirming. If you are LGBT+, queer,
          transgender, questioning, or somewhere still unfolding, you belong
          here &mdash; not despite who you are, but fully as who you are. There
          is no version of yourself you must leave at the door to be met with
          love.
        </p>
        <p>
          The page below gathers organizations, support, and reading for LGBTQ+
          people, their families, and anyone seeking a faith that makes room for
          the whole of a person. As Paul writes in Galatians 3:28, in Christ the
          old dividing lines fall away &mdash; we are all one.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-2xl mb-3">
          What does it mean to be LGBTQ+?
        </h2>
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
          <p>
            Queer or LGBTQ+ is a broad umbrella &mdash; lesbian, gay, bisexual,
            transgender, queer, and more &mdash; that describes the many ways
            people experience attraction, love, gender, and identity. These are
            not problems to be solved or phases to be outgrown; they are part of
            the ordinary, beautiful diversity of life.
          </p>
          <p>
            Being LGBTQ+ and being a person of faith are not in conflict. A
            growing community of churches, pastors, and theologians affirm that
            queer people are made in the image of God and called, like everyone,
            to lives of love and integrity. If you are just beginning to explore
            what these words mean for you, take your time. There is no deadline
            on self-understanding.
          </p>
        </div>

      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-3">Coming out</h2>
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
          <p>
            Coming out &mdash; sharing who you are with others &mdash; is
            deeply personal. There is no single right way and no schedule you
            owe anyone. For some it is a joyful announcement; for others it is
            quiet, gradual, and made only where it feels safe. All of these are
            valid.
          </p>
          <p>
            Your safety and well-being come first. You get to choose when, how,
            and with whom you share your story, and it is okay to wait until you
            are ready or until your circumstances allow. Wherever you are in that
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
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-3">Community resources</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-8">
          Beyond the church, these organizations offer support, connection, and
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
