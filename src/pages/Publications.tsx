import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

export default function Publications() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHead
        title="Publications"
        description="Sermons, worship resources, newsletters, and congregation materials from Hope and Truth Ministry — freely offered for the gathered and the wandering alike."
        path="/publications/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Publications &amp; Resources
      </p>
      <h1 className="font-serif text-5xl mb-4 leading-tight">
        Words for the journey.
      </h1>
      <p className="text-lg text-ink/70 max-w-prose leading-relaxed mb-16">
        Sermons and liturgical materials offered freely, with newsletters and
        congregation resources on the way. All of it made to be used, shared,
        and adapted.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Sermons */}
        <Link
          to="/sermons"
          className="group block border border-ink/10 rounded-lg p-8 hover:border-accent/40 hover:bg-accent/5 transition-colors"
        >
          <p className="text-xs uppercase tracking-widest text-accent mb-3">Archive</p>
          <h2 className="font-serif text-2xl mb-3 group-hover:text-accent">Sermons</h2>
          <p className="text-ink/70 text-sm leading-relaxed">
            Hundreds of sermons across the Revised Common Lectionary &mdash;
            grouped by year, searchable by season and scripture.
          </p>
          <p className="mt-4 text-sm text-accent font-medium">Browse sermons &rarr;</p>
        </Link>

        {/* Worship Resources */}
        <Link
          to="/worship-resources"
          className="group block border border-ink/10 rounded-lg p-8 hover:border-accent/40 hover:bg-accent/5 transition-colors"
        >
          <p className="text-xs uppercase tracking-widest text-accent mb-3">Liturgy</p>
          <h2 className="font-serif text-2xl mb-3 group-hover:text-accent">Worship Resources</h2>
          <p className="text-ink/70 text-sm leading-relaxed">
            Service orders, Lessons &amp; Carols, pastoral prayers, and other
            liturgical materials available for use and adaptation.
          </p>
          <p className="mt-4 text-sm text-accent font-medium">Browse resources &rarr;</p>
        </Link>

        {/* Newsletters — coming soon */}
        <div className="border border-ink/10 rounded-lg p-8 opacity-70">
          <p className="text-xs uppercase tracking-widest text-ink/50 mb-3">Coming soon</p>
          <h2 className="font-serif text-2xl mb-3 text-ink/60">Newsletters</h2>
          <p className="text-ink/60 text-sm leading-relaxed">
            Periodic letters from this ministry to the gathered &mdash; seasonal
            reflections, announcements, and notes from the community.
          </p>
          <p className="mt-4 text-sm text-ink/40 font-medium">Coming soon</p>
        </div>

        {/* Congregation Resources — coming soon */}
        <div className="border border-ink/10 rounded-lg p-8 opacity-70">
          <p className="text-xs uppercase tracking-widest text-ink/50 mb-3">Coming soon</p>
          <h2 className="font-serif text-2xl mb-3 text-ink/60">Congregation Resources</h2>
          <p className="text-ink/60 text-sm leading-relaxed">
            Study guides, devotional materials, liturgical planning tools, and
            other resources for congregations and small groups.
          </p>
          <p className="mt-4 text-sm text-ink/40 font-medium">Coming soon</p>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-ink/10">
        <p className="text-ink/70 max-w-prose leading-relaxed">
          Are you a minister, church, or ministry leader looking to grow your
          congregation&apos;s resources?{" "}
          <Link to="/ordination" className="text-accent underline">
            Explore ordination and ministry resources
          </Link>{" "}
          or visit our{" "}
          <Link to="/give" className="text-accent underline">
            stewardship resources
          </Link>{" "}
          for tools to strengthen your ministry&apos;s financial foundation.
        </p>
        <p className="text-xs text-ink/50 mt-6">
          Content on this site is &copy; Tony E Hansen / Hope and Truth Ministry.
          Free to share with attribution.{" "}
          <Link to="/terms" className="underline hover:text-ink/70">Terms of use &rarr;</Link>
        </p>
      </div>
    </div>
  );
}
