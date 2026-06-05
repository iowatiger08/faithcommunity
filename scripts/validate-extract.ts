/**
 * Validate the reconstructed extraction against the known-good posts.json.
 * Re-computes derived fields for every archived post and reports match rates.
 *
 *   npm run validate-extract
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseDate, lectionaryYear, liturgicalSeason } from "../src/lib/liturgical.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const posts = JSON.parse(
  readFileSync(resolve(repoRoot, "data/source/posts.json"), "utf8"),
).posts as Array<{
  slug: string;
  published_date: string | null;
  lectionary_year_computed: string | null;
  liturgical_season: { season: string } | null;
}>;

let yearTotal = 0,
  yearMatch = 0,
  seasonTotal = 0,
  seasonMatch = 0;
const yearMisses: string[] = [];
const seasonMisses: Array<[string, string, string]> = [];

for (const p of posts) {
  if (!p.published_date) continue;
  const d = parseDate(p.published_date);

  if (p.lectionary_year_computed) {
    yearTotal++;
    if (lectionaryYear(d) === p.lectionary_year_computed) yearMatch++;
    else yearMisses.push(`${p.slug} (${p.published_date}): got ${lectionaryYear(d)} want ${p.lectionary_year_computed}`);
  }
  if (p.liturgical_season?.season) {
    seasonTotal++;
    const got = liturgicalSeason(d).season;
    if (got === p.liturgical_season.season) seasonMatch++;
    else seasonMisses.push([p.published_date, got, p.liturgical_season.season]);
  }
}

const pct = (n: number, d: number) => (d ? ((100 * n) / d).toFixed(1) : "n/a");
console.log(`RCL year:  ${yearMatch}/${yearTotal} match (${pct(yearMatch, yearTotal)}%)`);
console.log(`Season:    ${seasonMatch}/${seasonTotal} match (${pct(seasonMatch, seasonTotal)}%)`);

if (yearMisses.length) {
  console.log(`\nYear misses (${yearMisses.length}):`);
  for (const m of yearMisses.slice(0, 15)) console.log("  " + m);
}
if (seasonMisses.length) {
  console.log(`\nSeason mismatches (${seasonMisses.length}) — date | got | want:`);
  const byPair = new Map<string, number>();
  for (const [, got, want] of seasonMisses) byPair.set(`${got}  ≠  ${want}`, (byPair.get(`${got}  ≠  ${want}`) ?? 0) + 1);
  for (const [pair, n] of [...byPair.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${pair}`);
}
