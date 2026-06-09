import published from "../../data/published-content.json";

export type Section = "sermons" | "reflections" | "worship_resources";
export type Category =
  | "sermon"
  | "reflection"
  | "worship_liturgy"
  | "tech"
  | "politics"
  | "meta"
  | "other";
export type Confidence = "high" | "medium" | "low";

export interface ScriptureRef {
  book: string;
  chapter: number;
  verses: string | null;
  ref: string;
}

export interface LiturgicalSeason {
  season: string;
  days_into_season: number;
  approx_week: number;
}

export interface LectionaryCode {
  day_name: string;
  week: number | null;
  year: "A" | "B" | "C" | null;
  raw: string;
}

export interface Series {
  base: string;
  part: string | null;
  week: number | null;
}

export interface PublishedPost {
  slug: string;
  title: string;
  published_date: string | null;
  author: string | null;
  category: Category;
  section: Section;
  themes: string[];
  summary: string;
  confidence: Confidence;
  notes: string[];
  scripture_refs: ScriptureRef[];
  scripture_in_title: string[];
  liturgical_season: LiturgicalSeason | null;
  lectionary_year: "A" | "B" | "C" | null;
  lectionary_code: LectionaryCode | null;
  series: Series | null;
  blogger_labels: string[];
  html_content: string;
  text_length: number;
}

interface PublishedFile {
  count: number;
  source_posts: string;
  source_classified: string;
  posts: PublishedPost[];
}

const data = published as PublishedFile;
const allPosts: PublishedPost[] = data.posts;
const bySlug = new Map(allPosts.map((p) => [p.slug, p]));

export function getAllPosts(): PublishedPost[] {
  return allPosts;
}

export function getPostsInSection(section: Section): PublishedPost[] {
  return allPosts.filter((p) => p.section === section);
}

export function getSermons(): PublishedPost[] {
  return getPostsInSection("sermons");
}

export function getWorshipResources(): PublishedPost[] {
  return getPostsInSection("worship_resources");
}

export function getPostBySlug(slug: string): PublishedPost | undefined {
  return bySlug.get(slug);
}

export function formatDate(iso: string | null): string {
  if (iso === null || iso === "") return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getThemeCounts(): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const p of allPosts) {
    for (const t of p.themes) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
