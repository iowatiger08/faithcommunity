#!/usr/bin/env node
/**
 * Build data/rcl-vanderbilt.json: how to link an RCL day to its readings page
 * on the Vanderbilt Divinity Library lectionary site.
 *
 * A readings page is texts/?y=<year id>&z=<season>&d=<day id>. The day id is
 * the same in every RCL year; only the year id differs for A, B and C. Both
 * come from the site's own calendar pages, so rerun this when Vanderbilt
 * rolls its calendar forward and old year ids stop working.
 *
 * Usage:
 *   npx tsx scripts/rcl-vanderbilt.ts           # regenerate the map
 *   npx tsx scripts/rcl-vanderbilt.ts --check   # confirm every page still loads
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://lectionary.library.vanderbilt.edu/";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../data/rcl-vanderbilt.json");

interface RclMap {
  years: Record<string, number>;
  days: Record<string, { z: string; d: number }>;
}

async function get(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function build(): Promise<RclMap> {
  const home = await get(SITE);
  const calendars = [...new Set(home.match(/calendar\/\d{4}-\d{2}\//g) ?? [])];
  const years: Record<string, number> = {};
  const days: RclMap["days"] = {};

  for (const cal of calendars) {
    const html = await get(`${SITE}${cal}?season=all`);
    const letter = html.match(/<title>Year ([ABC]) /)?.[1];
    const links = [...html.matchAll(/texts\/\?y=(\d+)&(?:amp;)?z=([a-z])&(?:amp;)?d=(\d+)/g)];
    if (!letter || links.length === 0) continue;

    // The page's own year id is the one most of its links use.
    const counts = new Map<number, number>();
    for (const [, y] of links) counts.set(Number(y), (counts.get(Number(y)) ?? 0) + 1);
    years[letter] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];

    const season = new Map(links.map(([, , z, d]) => [Number(d), z]));
    // Day names live in small {"Name": id, …} objects in the page script.
    for (const [obj] of html.matchAll(/\{"[^{}]*":\d+[^{}]*\}/g)) {
      for (const [name, d] of Object.entries(JSON.parse(obj) as Record<string, number>)) {
        const z = season.get(d);
        if (z) days[name.trim()] = { z, d };
      }
    }
  }
  if (Object.keys(years).length !== 3) throw new Error(`found years ${JSON.stringify(years)}`);
  return { years, days };
}

async function check(map: RclMap): Promise<number> {
  let failed = 0;
  for (const [letter, y] of Object.entries(map.years)) {
    for (const [name, { z, d }] of Object.entries(map.days)) {
      const url = `${SITE}texts/?y=${y}&z=${z}&d=${d}`;
      const title = (await get(url).catch(() => "")).match(/<title>([^<]*)/)?.[1] ?? "";
      if (!title.startsWith(`Year ${letter} `)) {
        console.log(`FAIL ${letter} ${name}: ${url} (${title || "no page"})`);
        failed++;
      }
    }
  }
  console.log(failed ? `${failed} page(s) failed` : "All readings pages load");
  return failed ? 1 : 0;
}

async function main(): Promise<number> {
  if (process.argv.includes("--check")) {
    return check(JSON.parse(readFileSync(OUT, "utf8")) as RclMap);
  }
  const map = await build();
  writeFileSync(OUT, JSON.stringify(map, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(map.days).length} days for years ${JSON.stringify(map.years)}`);
  return 0;
}

process.exit(await main());
