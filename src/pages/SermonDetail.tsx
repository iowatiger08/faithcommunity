import { Link, useParams } from "react-router-dom";
import { getPostBySlug, formatDate } from "~/lib/content";
import PageHead from "~/components/PageHead";

export default function SermonDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug !== undefined ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <PageHead
          title="Not found"
          description="That sermon doesn't appear in the archive."
          path="/sermons/"
        />
        <h1 className="font-serif text-3xl mb-4">Not found</h1>
        <p>That sermon doesn&apos;t appear in the archive.</p>
        <Link to="/sermons" className="text-accent underline mt-4 inline-block">
          Back to sermons
        </Link>
      </div>
    );
  }

  const sectionSlug = post.section.replace("_", "-");
  const path = `/${sectionSlug}/${post.slug}/`;
  // For sermons, build a richer description: summary + lectionary/scripture context.
  const meta = [
    post.summary,
    post.scripture_in_title.length > 0 &&
      `Scripture: ${post.scripture_in_title.join(", ")}.`,
    post.lectionary_code &&
      `${post.lectionary_code.raw}${post.lectionary_year ? `, Year ${post.lectionary_year}` : ""}.`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <PageHead
        title={post.title}
        description={meta || post.title}
        path={path}
        type="article"
        publishedTime={post.published_date}
      />
      <header className="mb-8 pb-6 border-b border-ink/10">
        <Link to="/sermons" className="text-sm text-accent hover:underline">
          &larr; All sermons
        </Link>
        <p className="text-xs text-ink/60 uppercase tracking-wide mt-4">
          {formatDate(post.published_date)}
          {post.lectionary_code && ` · ${post.lectionary_code.raw}`}
          {post.liturgical_season && ` · ${post.liturgical_season.season}`}
          {post.lectionary_year && ` · Year ${post.lectionary_year}`}
        </p>
        <h1 className="font-serif text-4xl mt-2 leading-tight">{post.title}</h1>
        {post.summary && (
          <p className="text-lg text-ink/80 mt-4 max-w-prose">{post.summary}</p>
        )}
        {post.scripture_refs.length > 0 && (
          <p className="text-sm text-ink/60 mt-4">
            <span className="uppercase tracking-wide text-xs mr-2">
              Scripture:
            </span>
            {post.scripture_refs
              .slice(0, 5)
              .map((s) => s.ref)
              .join(" · ")}
          </p>
        )}
        {post.themes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.themes.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-xs border border-ink/20 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="sermon-body"
        dangerouslySetInnerHTML={{ __html: post.html_content }}
      />
    </article>
  );
}
