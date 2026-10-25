import { Link } from "react-router-dom";
import { getComingOutReflections } from "~/lib/content";

/**
 * The two coming-out reflections — title, byline, teaser — as listed on the
 * queer resources page.
 */
export default function ReflectionList() {
  return (
    <ul className="space-y-6">
      {getComingOutReflections().map((r) => (
        <li key={r.slug} className="border border-ink/10 rounded-lg p-6">
          <Link
            to={`/reflections/${r.slug}`}
            className="font-serif text-xl text-accent underline underline-offset-2 hover:no-underline"
          >
            {r.title}
          </Link>
          {r.author !== null && r.author !== "" && (
            <p className="text-sm text-ink/60 mt-1">By {r.author}</p>
          )}
          <p className="text-sm text-ink/70 mt-2 leading-relaxed">{r.summary}</p>
        </li>
      ))}
    </ul>
  );
}
