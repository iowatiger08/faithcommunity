# Plan: Link each sermon to its RCL readings (Vanderbilt, NRSVue)

## Context
Sermon, worship-resource and reflection pages list scripture as plain text (`SermonDetail.tsx`, a "Scripture:" line showing only the first 5 refs). The only lectionary link is the general one to Vanderbilt's home page (`VANDERBILT_RCL` in `src/components/SeasonBadge.tsx`). Readers should be able to open that Sunday's readings in the NRSVue and read them next to the sermon. **No BibleGateway on sermon pages.**

The Vanderbilt RCL site has a "texts" page for each liturgical day. It shows every reading for that day **in full NRSVue text**, e.g. `https://lectionary.library.vanderbilt.edu/texts/?y=17134&z=p&d=84` (Year A, Proper 27). `y` selects the RCL year (A = 17134, B = 18921, C = 19342), `z` the season (a, c, e, l, h, s, p) and `d` the day. The readings repeat every three years, so a 2014 Year A Proper 27 sermon can link to the same Year A page. I checked all three Proper 27 pages.

Decisions made: readings **sidebar** layout. **Daily readings link** on Home instead of a verse of the day. Old in-body BibleGateway links are **switched from NRSV to NRSVUE** (those are the author's own links; we add no new BibleGateway links).

## Terms of use (Vanderbilt RCL FAQ)
- Linking: "May we link to your website…? Certainly. Please contact the library to let us know that you are linking to us." **Action for you:** email the Divinity Library with the site URL. I won't send it.
- Free for non-profit use by worship leaders and teachers. "Extensive portions of the NRSVue may not be quoted without permission." **Link only. Never copy reading text onto our pages.** Their site has no widget or iframe embed.
- Suggested citation: "The Revised Common Lectionary. Vanderbilt Divinity Library. https://lectionary.library.vanderbilt.edu/." Add it to `src/pages/Terms.tsx` next to the existing RCL copyright line, plus: "Readings links open the NRSVue text at the Vanderbilt Divinity Library."
- Future: free use is limited to non-profit use. If the paid ordination or consulting services launch, linking is still fine, but confirm with the library at that point.

## Matching a post to its liturgical day
- Only 98 of 289 posts have a `lectionary_code` parsed from the title, and some are wrong. For example, "Temptations – Lent 4A" was posted 2026-02-22, which is Lent 1. Most sermons are posted Sat/Sun (108 each).
- **Rule:** use the post date, moved forward to the next Sunday (same day if it's a Sunday), and compute the RCL day name and year with the existing helpers in `src/lib/liturgical.ts` (`easter`, `firstSundayOfAdvent`, `lectionaryYear`, `liturgicalSeason`). Propers use the RCL fixed date windows (Proper 4 = Sunday between May 29 and June 4, … Proper 29 / Reign of Christ). Sundays after Epiphany count up to Transfiguration (last Sunday before Lent).
- **Override:** an optional `rcl_day` field in `data/source/classified.jsonl` (e.g. `"Christmas Eve"`, `"Good Friday"`, `"none"`). `sync-content` copies it into `published-content.json`. Weekday feasts are matched only through this override.
- `sync-content` prints a short report of posts where the title code and the date-derived day disagree, so they can be fixed with `rcl_day`. It doesn't fail the build.

## Implementation (TDD: test first, then make it pass)

### 1. `src/lib/liturgical.ts` — `rclSunday(date)`
- Returns `{ name: "Proper 27", year: "A", season: "p", label: "Proper 27, Year A" }` or `null`.
- Tests in `liturgical.test.ts`: known Sundays across years (2026-11-08 → Proper 27A; 2026-02-22 → Lent 1A; 2025-11-30 → Advent 1A; Transfiguration; Easter Day; Pentecost; Trinity; Reign of Christ). Saturday → next day. Weekday → next Sunday.

### 2. `data/rcl-vanderbilt.json` + `scripts/rcl-vanderbilt.ts` (one-time generator)
- Fetches the three `calendar/…/?season=all` pages and writes a small map `{ "A": { "Proper 27": "texts/?y=17134&z=p&d=84", … }, "B": …, "C": … }`. It reads the day-name → `d` JSON already in each calendar page and maps Vanderbilt's names ("Proper 27 (32)", "Third Sunday in Lent") to our names.
- Check it into the repo. The build makes no network calls.
- `src/lib/rcl.ts`: `rclReadingsUrl(post): { url, label } | null`. Uses `rcl_day` override → else `rclSunday(published_date)` → lookup. Unit-tested against the checked-in map.
- `npm run check:rcl` (scripts/rcl-vanderbilt.ts `--check`) does a HEAD/GET of every URL in the map. Run it manually before deploys. Vanderbilt drops old calendar years (2013–2020 calendars now return 404), so if these ids stop working, rerun the generator.

### 3. `src/components/Readings.tsx` (new)
- `<aside aria-labelledby="readings-heading">`:
  - Heading "Readings", then the liturgical day label ("Proper 27, Year A").
  - Main link: **"Read this Sunday's readings (NRSVue)"** → Vanderbilt texts page, `target="rcl-readings" rel="noopener"`. The named target reuses one tab, so the reader can keep it next to the sermon. A visually hidden "(opens the Vanderbilt lectionary site)" goes with it.
  - The sermon's own `scripture_refs` (all of them, duplicates removed) as a plain list under "Texts in this sermon". They aren't linked, because Vanderbilt has no per-passage lookup.
  - Footer link: "Today's daily readings" → `https://lectionary.library.vanderbilt.edu/daily-readings/`.
- If there's no RCL match, show only the refs list. If there are no refs and no match, render nothing.

### 4. Layout in `src/pages/SermonDetail.tsx`
- Article width `max-w-3xl` → `lg:max-w-5xl`, with `lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-10`. The header and body go in column 1, `<Readings>` in column 2, `lg:sticky lg:top-6 lg:self-start`. `.sermon-body` stays at `max-w-prose`, so line length doesn't change.
- Under 1024px: `<Readings>` goes between the header and the body as a compact bordered box. A refs list longer than 4 goes in a `<details>` element, open by default. DOM order: header → readings → body (`lg:col-start-2 lg:row-start-1 lg:row-span-2`).
- Remove the old plain "Scripture:" line. Keep `scripture_in_title` in the meta description.
- Use the existing seasonal tokens (`text-accent`, `border-ink/10`). `print:hidden` on the aside.

### 5. Home page and constants
- `src/components/SeasonBadge.tsx`: add `VANDERBILT_RCL_DAILY`.
- `src/pages/Home.tsx` "From the lectionary" section: add two links, "This Sunday's readings" (`rclSunday(today())` → map) and "Today's daily readings". Compute them at render time on the client: `currentSeason()` already runs in the browser, and SSG HTML would go stale between deploys. Render the Sunday link after mount, with the general RCL link as the SSR fallback.
- No verse of the day.

### 6. Old in-body links: `scripts/sync-content.ts`
- When writing `published-content.json`, rewrite `biblegateway.com/passage/` hrefs in `html_content`: `version=NRSV` (exact match) → `NRSVUE`, and add `&version=NRSVUE` where the version is missing. Fix the `whats-your-story` typo (`John 17:6-190;src=link` → `John 17:6-19`). `posts.json` stays a faithful copy of Blogger. Unit test for the rewrite function.
- Also copy `rcl_day` through. Run `npm run sync-content` and commit the regenerated file.

### 7. Tests
- `SermonDetail.test.tsx` (reuse `makePost` from `src/test/post.ts`): the readings link points at the Vanderbilt texts URL for the post's date; the `rcl_day` override wins; no link when there's no match; refs list shows all refs; daily readings link present.
- `Home.test.tsx`: daily readings link present.
- `ssr.test.tsx` still passes.

## Files
- New: `src/lib/rcl.ts` (+ test), `src/components/Readings.tsx`, `data/rcl-vanderbilt.json`, `scripts/rcl-vanderbilt.ts`
- Edit: `src/lib/liturgical.ts` (+ test), `src/lib/content.ts` (`rcl_day?: string | null` on `PublishedPost`), `src/pages/SermonDetail.tsx` (+ test), `src/pages/Home.tsx` (+ test), `src/components/SeasonBadge.tsx`, `src/pages/Terms.tsx`, `scripts/sync-content.ts`, `package.json` (`check:rcl`), `data/published-content.json` (regenerated)
- Copy of this plan saved to `docs/rcl-readings-plan.md`

## Verification
1. `npm test`, `npm run typecheck`, `npm run lint`, `npm run check:rcl`.
2. `npm run dev`. Open `/sermons/are-you-prepared…/` at 1280px and 375px. Check that the sidebar stays in view on desktop and stacks above the body on phone. The link opens Vanderbilt **Year A – Proper 27** with NRSVue text, and a second click reuses the same tab. Spot-check an old Year B and Year C sermon, a Lent sermon, and "Temptations" (should be Lent 1A).
3. Review the mismatch report from `sync-content` and add `rcl_day` overrides where needed.
4. `npm run build`; `grep -c "lectionary.library.vanderbilt.edu/texts" dist/sermons/*/index.html`; `grep -rl "version=NRSV&" dist` returns nothing.
5. Deploy only when asked (CLAUDE.md flow). After deploying, email the Vanderbilt Divinity Library about the link (your action).
