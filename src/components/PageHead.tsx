import { Head } from "vite-react-ssg";

const SITE_URL = "https://hopeandtruthministry.com";
const SITE_NAME = "Hope and Truth Ministry";
const DEFAULT_DESCRIPTION =
  "A congregation of the whole internet — sermons, reflections, and worship resources for the wandering, the doubting, and the hopeful.";

interface Props {
  /** Page-specific title. Auto-suffixed with " — Hope and Truth Ministry" unless `isHome`. */
  title: string;
  /** ~155 char meta description; appears in search results + social previews. */
  description?: string;
  /** Page path relative to SITE_URL, e.g. "/sermons/foo/". Used for og:url and canonical. */
  path: string;
  /** og:type — "article" for sermon detail, "website" for index/landing. Defaults to "website". */
  type?: "article" | "website";
  /** ISO publish date for articles, surfaces as article:published_time. */
  publishedTime?: string | null;
  /** Whether this is the home page (skip site-name suffix in title). */
  isHome?: boolean;
}

export default function PageHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  type = "website",
  publishedTime,
  isHome = false,
}: Props) {
  const fullTitle = isHome ? title : `${title} — ${SITE_NAME}`;
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  // Clip description to a sensible length (Google truncates ~155 chars).
  const desc = description.length > 300
    ? `${description.slice(0, 297).trimEnd()}...`
    : description;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook, LinkedIn, iMessage, Slack, etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Head>
  );
}
