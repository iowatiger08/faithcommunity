import { Link } from "react-router-dom";
import { getSermons, getAllPosts, getThemeCounts, formatDate } from "~/lib/content";

export default function Home() {
  const sermons = getSermons();
  const recent = getAllPosts().slice(0, 5);
  const topThemes = getThemeCounts().slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <section className="mb-16">
        <h1 className="font-serif text-5xl mb-4 leading-tight">
          Hope and Truth Ministry
        </h1>
        <p className="font-sans text-lg text-ink/80 max-w-prose">
          Sermons and reflections rooted in the Revised Common Lectionary,
          preached and posted since 2010. Currently {sermons.length} sermons in
          the archive.
        </p>
      </section>

      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-2xl">Recent</h2>
          <Link to="/sermons" className="text-sm text-accent hover:underline">
            All sermons &rarr;
          </Link>
        </div>
        <ul className="divide-y divide-ink/10">
          {recent.map((p) => (
            <li key={p.slug} className="py-4">
              <Link to={`/${p.section.replace("_", "-")}/${p.slug}`}>
                <p className="text-xs text-ink/60 uppercase tracking-wide">
                  {formatDate(p.published_date)}
                  {p.lectionary_code && ` · ${p.lectionary_code.raw}`}
                </p>
                <h3 className="font-serif text-xl mt-1 hover:text-accent">
                  {p.title}
                </h3>
                <p className="text-sm text-ink/70 mt-1 max-w-prose">
                  {p.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-2xl mb-4">Themes</h2>
        <div className="flex flex-wrap gap-2">
          {topThemes.map(([theme, n]) => (
            <span
              key={theme}
              className="px-3 py-1 text-sm border border-ink/20 rounded-full"
            >
              {theme} <span className="text-ink/50">({n})</span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
