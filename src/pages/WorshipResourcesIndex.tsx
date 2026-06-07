import { Link } from "react-router-dom";
import { getWorshipResources, formatDate } from "~/lib/content";
import { MEDITATION_RESOURCE_SLUGS } from "~/pages/Meditations";
import PageHead from "~/components/PageHead";

export default function WorshipResourcesIndex() {
  const items = getWorshipResources().filter(
    (p) => !MEDITATION_RESOURCE_SLUGS.has(p.slug)
  );
  return (
    <>
      <div className="w-full overflow-hidden" style={{ maxHeight: "380px" }}>
        <img
          src="/images/red-rock-desert.jpg"
          alt="A sweeping red rock desert landscape with layered canyon formations"
          className="w-full object-cover object-center"
          style={{ maxHeight: "380px" }}
        />
      </div>
    <div className="max-w-5xl mx-auto px-6 py-12">
      <PageHead
        title="Worship Resources"
        description="Service orders, Lessons & Carols, pastoral prayers, and other liturgical materials from Hope and Truth Ministry — available for use, adaptation, and gathering."
        path="/worship-resources/"
      />
      <h1 className="font-serif text-4xl mb-2">Worship Resources</h1>
      <p className="text-ink/70 mb-10 max-w-prose">
        Service orders, Lessons &amp; Carols, pastoral prayers, and other
        liturgical materials &mdash; available for use, adaptation, and
        gathering.
      </p>
      <ul className="divide-y divide-ink/10">
        {items.map((p) => (
          <li key={p.slug} className="py-4">
            <Link
              to={`/worship-resources/${p.slug}`}
              className="block group"
            >
              <p className="text-xs text-ink/60 uppercase tracking-wide">
                {formatDate(p.published_date)}
              </p>
              <h3 className="font-serif text-xl mt-1 group-hover:text-accent">
                {p.title}
              </h3>
              <p className="text-sm text-ink/70 mt-1 max-w-prose">
                {p.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
