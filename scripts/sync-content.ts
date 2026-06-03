#!/usr/bin/env node
/**
 * Build the slim publishable content file the React app reads at build time.
 *
 * Joins extract.py's posts.json (full post bodies) with classify.py's
 * classified.jsonl (category + themes + summary + publish decision) and emits
 * data/published-content.json — only posts marked publish_decision="yes",
 * with just the fields the site renders.
 *
 * Posts whose title matches EXCLUDED_TITLE_PATTERNS are filtered out, even
 * when the classifier marked them publish=yes. These tend to be
 * congregation-specific worship bulletins that don't belong on a
 * ministry-wide site.
 *
 * Default source paths assume the tigersndragons sibling project at
 * ../tigersndragons. Override with --posts, --classified, --out.
 *
 * Usage:
 *   npm run sync-content
 *   npm run sync-content -- --posts /path/to/posts.json --classified /path/to/classified.jsonl
 */

import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_POSTS = "../tigersndragons/.scratch/blogger/posts.json";
const DEFAULT_CLASSIFIED = "../tigersndragons/.scratch/blogger/classified.jsonl";
const DEFAULT_OUT = "data/published-content.json";

const EXCLUDED_TITLE_PATTERNS = [
  "st john united church of christ",
  "st. john united church of christ",
  "st john ucc",
  "st. john ucc",
];

interface Post {
  slug: string;
  title: string;
  published_date: string | null;
  author: string | null;
  scripture_refs?: unknown[];
  scripture_in_title?: string[];
  liturgical_season?: unknown;
  lectionary_year_computed?: string | null;
  lectionary_code_title?: unknown;
  series?: unknown;
  blogger_labels?: string[];
  html_content?: string;
  text_length?: number;
}

interface Classification {
  category: string;
  publish_decision: "yes" | "no" | "maybe";
  publish_section: string | null;
  themes: string[];
  summary: string;
  confidence: "high" | "medium" | "low";
  notes?: string[];
}

interface ClassifiedRecord {
  slug: string;
  classification?: Classification;
}

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      out[a.slice(2)] = argv[i + 1] ?? "";
      i++;
    }
  }
  return out;
}

function loadPosts(path: string): Map<string, Post> {
  const data = JSON.parse(readFileSync(path, "utf8")) as { posts: Post[] };
  return new Map(data.posts.map((p) => [p.slug, p]));
}

function loadClassifications(path: string): Map<string, ClassifiedRecord> {
  const out = new Map<string, ClassifiedRecord>();
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const rec = JSON.parse(trimmed) as ClassifiedRecord;
    if (rec.classification) out.set(rec.slug, rec);
  }
  return out;
}

function isExcluded(post: Post): string | null {
  const title = (post.title || "").toLowerCase();
  return EXCLUDED_TITLE_PATTERNS.find((p) => title.includes(p)) ?? null;
}

interface PublishedPost {
  slug: string;
  title: string;
  published_date: string | null;
  author: string | null;
  category: string;
  section: string | null;
  themes: string[];
  summary: string;
  confidence: string;
  notes: string[];
  scripture_refs: unknown[];
  scripture_in_title: string[];
  liturgical_season: unknown;
  lectionary_year: string | null;
  lectionary_code: unknown;
  series: unknown;
  blogger_labels: string[];
  html_content: string;
  text_length: number;
}

function buildPublished(
  posts: Map<string, Post>,
  classifications: Map<string, ClassifiedRecord>,
): { published: PublishedPost[]; excluded: Array<{ title: string; reason: string }> } {
  const published: PublishedPost[] = [];
  const excluded: Array<{ title: string; reason: string }> = [];

  for (const [slug, c] of classifications) {
    const cls = c.classification!;
    if (cls.publish_decision !== "yes") continue;
    const post = posts.get(slug);
    if (!post) {
      console.warn(`WARN: classified post ${slug} not in posts.json`);
      continue;
    }
    const reason = isExcluded(post);
    if (reason) {
      excluded.push({ title: post.title, reason });
      continue;
    }
    published.push({
      slug,
      title: post.title,
      published_date: post.published_date,
      author: post.author,
      category: cls.category,
      section: cls.publish_section,
      themes: cls.themes,
      summary: cls.summary,
      confidence: cls.confidence,
      notes: cls.notes ?? [],
      scripture_refs: post.scripture_refs ?? [],
      scripture_in_title: post.scripture_in_title ?? [],
      liturgical_season: post.liturgical_season ?? null,
      lectionary_year: post.lectionary_year_computed ?? null,
      lectionary_code: post.lectionary_code_title ?? null,
      series: post.series ?? null,
      blogger_labels: post.blogger_labels ?? [],
      html_content: post.html_content ?? "",
      text_length: post.text_length ?? 0,
    });
  }

  published.sort((a, b) => (b.published_date ?? "").localeCompare(a.published_date ?? ""));
  return { published, excluded };
}

function main(): number {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const args = parseArgs(process.argv);
  const postsPath = resolve(repoRoot, args.posts ?? DEFAULT_POSTS);
  const clsPath = resolve(repoRoot, args.classified ?? DEFAULT_CLASSIFIED);
  const outPath = resolve(repoRoot, args.out ?? DEFAULT_OUT);

  let posts: Map<string, Post>;
  let classifications: Map<string, ClassifiedRecord>;
  try {
    posts = loadPosts(postsPath);
  } catch (e) {
    console.error(`ERROR: cannot read posts file at ${postsPath}: ${(e as Error).message}`);
    return 2;
  }
  try {
    classifications = loadClassifications(clsPath);
  } catch (e) {
    console.error(`ERROR: cannot read classified file at ${clsPath}: ${(e as Error).message}`);
    return 2;
  }

  const { published, excluded } = buildPublished(posts, classifications);

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(
    outPath,
    JSON.stringify({
      count: published.length,
      source_posts: postsPath,
      source_classified: clsPath,
      posts: published,
    }),
  );

  const sizeMb = statSync(outPath).size / 1024 / 1024;
  const bySection = new Map<string, number>();
  for (const p of published) {
    const k = p.section ?? "(none)";
    bySection.set(k, (bySection.get(k) ?? 0) + 1);
  }
  console.log(
    `Wrote ${published.length} published posts → ${relative(repoRoot, outPath)} (${sizeMb.toFixed(2)} MB)`,
  );
  for (const [s, n] of [...bySection.entries()].sort()) {
    console.log(`  ${String(n).padStart(3)}  /${s}`);
  }
  if (excluded.length) {
    console.log(`\nExcluded ${excluded.length} post(s) by title-pattern rule:`);
    for (const { title, reason } of excluded) {
      console.log(`  - ${JSON.stringify(title)}  (matched: ${JSON.stringify(reason)})`);
    }
  }
  return 0;
}

process.exit(main());
