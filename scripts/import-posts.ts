#!/usr/bin/env node
/**
 * Fetch new posts from the Blogger feed and import them into the corpus.
 *
 * Checks the most recent posts against the existing slugs in posts.json.
 * Newly discovered posts are added to posts.json + classified.jsonl and
 * sync-content is run automatically so they appear on the next build.
 *
 * Usage:
 *   npm run import-posts               # import only
 *   npm run import-posts -- --deploy   # import + build + deploy to S3
 *   npm run import-posts -- --dry-run  # preview without writing
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import {
  parseDate,
  lectionaryYear,
  liturgicalSeason,
} from "../src/lib/liturgical.js";

const FEED_URL =
  "https://tonyswebstudios.blogspot.com/feeds/posts/default?alt=json&max-results=25&orderby=published";
const POSTS_PATH = "data/source/posts.json";
const CLS_PATH = "data/source/classified.jsonl";

// ── Bible book detection ──────────────────────────────────────────────────────

const BIBLE_BOOKS: [RegExp, string][] = [
  [/\bGenesis\b/i, "Genesis"],
  [/\bExodus\b/i, "Exodus"],
  [/\bLeviticus\b/i, "Leviticus"],
  [/\bNumbers\b/i, "Numbers"],
  [/\bDeuteronomy\b/i, "Deuteronomy"],
  [/\bJoshua\b/i, "Joshua"],
  [/\bJudges\b/i, "Judges"],
  [/\b1\s*Samuel\b/i, "1 Samuel"],
  [/\b2\s*Samuel\b/i, "2 Samuel"],
  [/\b1\s*Kings\b/i, "1 Kings"],
  [/\b2\s*Kings\b/i, "2 Kings"],
  [/\b1\s*Chronicles\b/i, "1 Chronicles"],
  [/\b2\s*Chronicles\b/i, "2 Chronicles"],
  [/\bEzra\b/i, "Ezra"],
  [/\bNehemiah\b/i, "Nehemiah"],
  [/\bEsther\b/i, "Esther"],
  [/\bJob\b/i, "Job"],
  [/\bPsalm[s]?\b/i, "Psalms"],
  [/\bProverbs\b/i, "Proverbs"],
  [/\bEcclesiastes\b/i, "Ecclesiastes"],
  [/\bIsaiah\b/i, "Isaiah"],
  [/\bJeremiah\b/i, "Jeremiah"],
  [/\bLamentations\b/i, "Lamentations"],
  [/\bEzekiel\b/i, "Ezekiel"],
  [/\bDaniel\b/i, "Daniel"],
  [/\bHosea\b/i, "Hosea"],
  [/\bJoel\b/i, "Joel"],
  [/\bAmos\b/i, "Amos"],
  [/\bMicah\b/i, "Micah"],
  [/\bZephaniah\b/i, "Zephaniah"],
  [/\bHaggai\b/i, "Haggai"],
  [/\bZechariah\b/i, "Zechariah"],
  [/\bMalachi\b/i, "Malachi"],
  [/\bMatthew\b/i, "Matthew"],
  [/\bMark\b/i, "Mark"],
  [/\bLuke\b/i, "Luke"],
  [/\bJohn\b/i, "John"],
  [/\bActs\b/i, "Acts"],
  [/\bRomans\b/i, "Romans"],
  [/\b1\s*Corinthians\b/i, "1 Corinthians"],
  [/\b2\s*Corinthians\b/i, "2 Corinthians"],
  [/\bGalatians\b/i, "Galatians"],
  [/\bEphesians\b/i, "Ephesians"],
  [/\bPhilippians\b/i, "Philippians"],
  [/\bColossians\b/i, "Colossians"],
  [/\b1\s*Thessalonians\b/i, "1 Thessalonians"],
  [/\b2\s*Thessalonians\b/i, "2 Thessalonians"],
  [/\b1\s*Timothy\b/i, "1 Timothy"],
  [/\b2\s*Timothy\b/i, "2 Timothy"],
  [/\bTitus\b/i, "Titus"],
  [/\bPhilemon\b/i, "Philemon"],
  [/\bHebrews\b/i, "Hebrews"],
  [/\bJames\b/i, "James"],
  [/\b1\s*Peter\b/i, "1 Peter"],
  [/\b2\s*Peter\b/i, "2 Peter"],
  [/\b1\s*John\b/i, "1 John"],
  [/\b2\s*John\b/i, "2 John"],
  [/\b3\s*John\b/i, "3 John"],
  [/\bJude\b/i, "Jude"],
  [/\bRevelation\b/i, "Revelation"],
];

// Matches "Book N", "Book N:V", "Book N:V-W", "Book N:V-N:W"
const REF_RE =
  /([1-3]\s*)?([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+(\d+)(?::(\d+(?:[-–]\d+(?::\d+)?)?))?\b/g;

interface ScriptureRef {
  book: string;
  chapter: number;
  verses: string | null;
  ref: string;
}

function parseScriptureRefs(text: string): ScriptureRef[] {
  const refs: ScriptureRef[] = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  REF_RE.lastIndex = 0;
  while ((m = REF_RE.exec(text)) !== null) {
    const prefix = (m[1] ?? "").trim();
    const bookName = m[2];
    const bookKey = (prefix + " " + bookName).trim();
    const match = BIBLE_BOOKS.find(([re]) => re.test(bookKey));
    if (!match) continue;
    const canonical = match[1];
    const chapter = parseInt(m[3], 10);
    const verses = m[4] ?? null;
    const ref = verses
      ? `${canonical} ${chapter}:${verses}`
      : `${canonical} ${chapter}`;
    if (seen.has(ref)) continue;
    seen.add(ref);
    refs.push({ book: canonical, chapter, verses, ref });
  }
  return refs;
}

function scriptureInTitle(title: string): string[] {
  return parseScriptureRefs(title).map((r) => r.ref);
}

// ── Lectionary code detection ─────────────────────────────────────────────────

interface LectionaryCode {
  day_name: string;
  week: number | null;
  year: "A" | "B" | "C" | null;
  raw: string;
}

const LECTIONARY_PATTERNS: Array<{
  re: RegExp;
  build: (m: RegExpMatchArray) => LectionaryCode;
}> = [
  {
    // "Proper 10 Year A" or "Proper 10A"
    re: /Proper\s+(\d+)\s+(?:Year\s+)?([ABC])\b/i,
    build: (m) => ({
      day_name: `Proper ${m[1]}`,
      week: parseInt(m[1]),
      year: m[2].toUpperCase() as "A" | "B" | "C",
      raw: m[0].trim(),
    }),
  },
  {
    // "Easter 6A" or "Easter 6 Year A"
    re: /Easter\s+(\d+)\s+(?:Year\s+)?([ABC])\b/i,
    build: (m) => ({
      day_name: `Easter ${m[1]}`,
      week: parseInt(m[1]),
      year: m[2].toUpperCase() as "A" | "B" | "C",
      raw: m[0].trim(),
    }),
  },
  {
    // "Lent 3A"
    re: /Lent\s+(\d+)\s+(?:Year\s+)?([ABC])\b/i,
    build: (m) => ({
      day_name: `Lent ${m[1]}`,
      week: parseInt(m[1]),
      year: m[2].toUpperCase() as "A" | "B" | "C",
      raw: m[0].trim(),
    }),
  },
  {
    // "Advent 2A"
    re: /Advent\s+(\d+)\s+(?:Year\s+)?([ABC])\b/i,
    build: (m) => ({
      day_name: `Advent ${m[1]}`,
      week: parseInt(m[1]),
      year: m[2].toUpperCase() as "A" | "B" | "C",
      raw: m[0].trim(),
    }),
  },
  {
    // "Epiphany 5A"
    re: /Epiphany\s+(\d+)\s+(?:Year\s+)?([ABC])\b/i,
    build: (m) => ({
      day_name: `Epiphany ${m[1]}`,
      week: parseInt(m[1]),
      year: m[2].toUpperCase() as "A" | "B" | "C",
      raw: m[0].trim(),
    }),
  },
  {
    // "Trinity Sunday Year A"
    re: /Trinity\s+Sunday(?:\s+Year\s+([ABC]))?\b/i,
    build: (m) => ({
      day_name: "Trinity Sunday",
      week: null,
      year: m[1] ? (m[1].toUpperCase() as "A" | "B" | "C") : null,
      raw: m[0].trim(),
    }),
  },
  {
    // "Palm Sunday" / "Palm"
    re: /Palm(?:\s+Sunday)?\b/i,
    build: (m) => ({
      day_name: "Palm Sunday",
      week: null,
      year: null,
      raw: m[0].trim(),
    }),
  },
  {
    // "Maundy Thursday"
    re: /Maundy\s+Thursday\b/i,
    build: (m) => ({
      day_name: "Maundy Thursday",
      week: null,
      year: null,
      raw: m[0].trim(),
    }),
  },
  {
    // "Baptism of the Lord" / "Baptism of Lord"
    re: /Baptism\s+of\s+(?:the\s+)?Lord\b/i,
    build: (m) => ({
      day_name: "Baptism of the Lord",
      week: null,
      year: null,
      raw: m[0].trim(),
    }),
  },
  {
    // "Christmas Eve" or "Christmas 2A"
    re: /Christmas\s+(?:Eve|(\d+)\s+(?:Year\s+)?([ABC]))\b/i,
    build: (m) => ({
      day_name: m[1] ? `Christmas ${m[1]}` : "Christmas Eve",
      week: m[1] ? parseInt(m[1]) : null,
      year: m[2] ? (m[2].toUpperCase() as "A" | "B" | "C") : null,
      raw: m[0].trim(),
    }),
  },
];

function parseLectionaryCode(title: string): LectionaryCode | null {
  for (const { re, build } of LECTIONARY_PATTERNS) {
    const m = title.match(re);
    if (m) return build(m);
  }
  return null;
}

// ── HTML → plain text ─────────────────────────────────────────────────────────

function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#?\w+;/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── Blogger feed types ────────────────────────────────────────────────────────

interface BloggerEntry {
  id: { $t: string };
  published: { $t: string };
  updated: { $t: string };
  title: { $t: string };
  content: { $t: string };
  link: Array<{ rel: string; href: string }>;
  author: Array<{ name: { $t: string } }>;
  category?: Array<{ term: string }>;
}

interface BloggerFeed {
  feed: {
    entry?: BloggerEntry[];
    "openSearch$totalResults": { $t: string };
  };
}

// ── Core importer ─────────────────────────────────────────────────────────────

function slugFromEntry(entry: BloggerEntry): string | null {
  const alt = entry.link.find((l) => l.rel === "alternate");
  if (!alt) return null;
  const m = alt.href.match(/\/([^/]+)\.html$/);
  return m ? m[1] : null;
}

function buildPost(entry: BloggerEntry) {
  const id = entry.id.$t;
  const title = entry.title.$t;
  const published = entry.published.$t;
  const updated = entry.updated.$t;
  const published_date = published.slice(0, 10);
  const author = entry.author[0]?.name.$t ?? "Tony E Hansen";
  const slug = slugFromEntry(entry)!;
  const labels = (entry.category ?? []).map((c) => c.term);
  const html_content = entry.content.$t;
  const text_content = htmlToText(html_content);
  const text_length = text_content.length;
  const body_opening = text_content.slice(0, 800);
  const alt = entry.link.find((l) => l.rel === "alternate")!;
  const urlPath = new URL(alt.href).pathname;

  const scripture_refs = parseScriptureRefs(body_opening);
  const scripture_in_title_val = scriptureInTitle(title);
  const scripture_in_body = parseScriptureRefs(body_opening).map((r) => r.ref);
  const lectionary_code = parseLectionaryCode(title);
  const lcInBody = parseLectionaryCode(body_opening);

  const d = parseDate(published_date);
  const lectionary_year_computed = lectionaryYear(d);
  const liturgical_season_val = liturgicalSeason(d);

  const signals = {
    scripture_in_title: scripture_in_title_val.length > 0,
    scripture_in_body_opening: scripture_in_body.length > 0,
    lectionary_code_in_title: lectionary_code !== null,
    lectionary_code_in_body: lcInBody !== null,
    lectionary_phrase_in_body: /\b(proper|ordinary time|advent|lent|easter|epiphany|pentecost)\b/i.test(body_opening),
  };
  const sermon_signal_count = Object.values(signals).filter(Boolean).length;

  return {
    id,
    slug,
    title,
    author,
    published,
    updated,
    published_date,
    blogger_filename: urlPath,
    blogger_labels: labels,
    blogger_meta_description: null,
    html_content,
    text_content,
    text_length,
    body_opening,
    scripture_refs,
    scripture_in_title: scripture_in_title_val,
    scripture_in_body_opening: scripture_in_body,
    lectionary_code_title: lectionary_code,
    lectionary_code_body: lcInBody,
    body_lectionary_phrases: [] as string[],
    lectionary_year_computed,
    liturgical_season: liturgical_season_val,
    series: null,
    sermon_signals: signals,
    sermon_signal_count,
  };
}

function classify(post: ReturnType<typeof buildPost>) {
  const isSermon =
    post.sermon_signals.scripture_in_title ||
    post.sermon_signals.lectionary_code_in_title;

  return {
    slug: post.slug,
    title: post.title,
    published_date: post.published_date,
    classification: {
      category: isSermon ? "sermon" : "other",
      themes: [] as string[],
      summary: "",
      publish_decision: isSermon ? "yes" : "maybe",
      publish_section: isSermon ? "sermons" : null,
      confidence: isSermon ? "high" : "low",
      notes: isSermon
        ? []
        : ["auto-imported — no scripture or lectionary code detected in title; review before publishing"],
    },
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const deploy = args.includes("--deploy");
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

  // Load existing slugs
  const postsData = JSON.parse(
    readFileSync(resolve(repoRoot, POSTS_PATH), "utf8"),
  ) as { count: number; posts: Array<{ slug: string }> };
  const existingSlugs = new Set(postsData.posts.map((p) => p.slug));

  const clsText = readFileSync(resolve(repoRoot, CLS_PATH), "utf8");
  const classifiedSlugs = new Set<string>();
  for (const line of clsText.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    try {
      classifiedSlugs.add(JSON.parse(t).slug as string);
    } catch {}
  }

  // Fetch feed
  console.log(`Fetching ${FEED_URL} …`);
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
  const feed = (await res.json()) as BloggerFeed;
  const entries = feed.feed.entry ?? [];
  console.log(`Feed returned ${entries.length} entries.\n`);

  const newPosts: ReturnType<typeof buildPost>[] = [];
  const newCls: ReturnType<typeof classify>[] = [];

  for (const entry of entries) {
    const slug = slugFromEntry(entry);
    if (!slug) continue;
    if (existingSlugs.has(slug)) continue;

    const post = buildPost(entry);
    const cls = classify(post);
    newPosts.push(post);
    newCls.push(cls);

    const decision = cls.classification.publish_decision;
    const section = cls.classification.publish_section ?? "(review needed)";
    console.log(`  NEW  ${slug}`);
    console.log(`       ${post.published_date}  →  ${decision} / ${section}`);
    if (cls.classification.notes.length) {
      for (const n of cls.classification.notes) console.log(`       ⚠  ${n}`);
    }
    console.log();
  }

  if (newPosts.length === 0) {
    console.log("No new posts found.");
    return;
  }

  if (dryRun) {
    console.log(`DRY RUN — would import ${newPosts.length} post(s). No files written.`);
    return;
  }

  // Write posts.json
  for (const p of newPosts) postsData.posts.push(p);
  postsData.count = postsData.posts.length;
  writeFileSync(
    resolve(repoRoot, POSTS_PATH),
    JSON.stringify(postsData, null, 2),
  );
  console.log(`Updated ${POSTS_PATH} (${postsData.count} total posts)`);

  // Append classified.jsonl
  const toAppend = newCls
    .filter((c) => !classifiedSlugs.has(c.slug))
    .map((c) => JSON.stringify(c))
    .join("\n");
  if (toAppend) {
    writeFileSync(resolve(repoRoot, CLS_PATH), clsText.trimEnd() + "\n" + toAppend + "\n");
    console.log(`Appended ${newCls.length} record(s) to ${CLS_PATH}`);
  }

  // Run sync-content
  console.log("\nRunning sync-content…");
  execSync("npm run sync-content", { stdio: "inherit", cwd: repoRoot });

  if (deploy) {
    console.log("\nRunning deploy…");
    execSync("./scripts/deploy.sh", { stdio: "inherit", cwd: repoRoot });
  } else {
    console.log(
      "\nDone. Run  npm run import-posts -- --deploy  to build and push to S3.",
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
