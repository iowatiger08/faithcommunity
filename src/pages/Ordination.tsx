import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

export default function Ordination() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Ordination &amp; Ministry Credentials"
        description="Resources for those called to ministry — ordination services and credentialing through organizations Hope and Truth Ministry is associated with. Legal, free, and recognized in all 50 states."
        path="/ordination/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Ordination &amp; Ministry
      </p>
      <h1 className="font-serif text-5xl mb-6 leading-tight">
        Called to serve?
      </h1>

      <div className="space-y-5 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          A call to ministry is a sacred thing &mdash; and getting ordained
          today is more accessible than many realize. Whether you are ready to
          officiate a wedding, lead a congregation, or simply formalize the
          ministry you are already living, there are trusted paths available
          right now.
        </p>
        <p>
          Hope and Truth Ministry is associated with the following ordaining
          institutions. Both are free, widely recognized, and legal in all
          50 states.
        </p>
      </div>

      <section className="mt-12">
        <ul className="space-y-6">
          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://ulc.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              Universal Life Church (ULC)
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              One of the oldest and most widely recognized online ordaining
              institutions. Free ordination, legal in all 50 states. The ULC
              has ordained millions of ministers since 1962 and offers
              additional credentials, ministerial supplies, and resources.
            </p>
          </li>

          <li className="border border-ink/10 rounded-lg p-6">
            <a
              href="https://open-ministry.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
            >
              Open Ministry
            </a>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              A progressive online ordaining organization with an emphasis on
              interfaith and non-denominational ministry. Free ordination with
              optional legal certificates and ministerial packages available.
            </p>
          </li>
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-3">Already ordained?</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed">
          You&apos;ll find sermon materials, worship resources, and liturgical
          planning tools in our{" "}
          <Link to="/publications" className="text-accent underline">
            Publications section
          </Link>
          , stewardship resources for your ministry or congregation on the{" "}
          <Link to="/give" className="text-accent underline">
            Give page
          </Link>
          , and contemplative practice resources in{" "}
          <Link to="/meditations" className="text-accent underline">
            Meditations
          </Link>
          .
        </p>
      </section>

      <div className="mt-16 pt-8 border-t border-ink/10">
        <p className="text-ink/70 max-w-prose leading-relaxed text-sm">
          Questions about ministry and ordination? Reach us through the{" "}
          <Link to="/subscribe" className="text-accent underline">
            subscribe page
          </Link>{" "}
          and we will be in touch.
        </p>
      </div>
    </div>
  );
}
