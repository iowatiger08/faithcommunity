import { Link } from "react-router-dom";
import { getSermons, formatDate } from "~/lib/content";

export default function SermonsIndex() {
  const sermons = getSermons();
  // Group by year
  const byYear = new Map<string, typeof sermons>();
  for (const s of sermons) {
    const y = (s.published_date || "unknown").slice(0, 4);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(s);
  }
  const years = [...byYear.keys()].sort().reverse();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl mb-2">Sermons</h1>
      <p className="text-ink/70 mb-10">
        Recent and past sermons across the years.
      </p>

      {years.map((year) => (
        <section key={year} className="mb-12">
          <h2 className="font-serif text-2xl text-accent mb-4">{year}</h2>
          <ul className="divide-y divide-ink/10">
            {byYear.get(year)!.map((s) => (
              <li key={s.slug} className="py-3">
                <Link to={`/sermons/${s.slug}`} className="block group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="text-xs text-ink/60 uppercase tracking-wide sm:w-32 shrink-0">
                      {formatDate(s.published_date)}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg group-hover:text-accent">
                        {s.title}
                      </h3>
                      {s.scripture_in_title.length > 0 && (
                        <p className="text-xs text-ink/50 mt-0.5">
                          {s.scripture_in_title.join(" · ")}
                          {s.lectionary_code && ` · ${s.lectionary_code.raw}`}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
