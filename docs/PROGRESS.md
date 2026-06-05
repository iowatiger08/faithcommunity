# Hope & Truth Ministry — progress & roadmap

Living notes so we don't have to reconstruct decisions or re-run work. Update
this as things land.

_Last updated: 2026-06-04._

## What this is

`hopeandtruthministry.com` — an online ministry ("a congregation of the whole").
RCL/lectionary-based **sermons + reflections** are the interface; the goal is to
gather online visitors, with care/support and giving as the ministry layer.
Built as a static site (Vite + React + `vite-react-ssg` + Tailwind) and deployed
to S3 + CloudFront. `tigersndragons.com` is **deprecated** — focus is here.

## Live site map

| Route | Page | Notes |
|-------|------|-------|
| `/` | Home | Hero, recent reflections, "Three ways in" → **/care** |
| `/sermons`, `/sermons/:slug` | Sermons | 247 published sermons from the archive |
| `/worship-resources`, `/.../:slug` | Worship | 19 worship resources |
| `/care` | **Care & support** | "You are not alone" — crisis lines, Stephen Ministry, recovery, mental health, affirming, local |
| `/give` | **Give & volunteer** | Venmo/PayPal (TODO), volunteer with UBFM-DSM / pantries |
| `/about` | About | Ministry framing, affiliations |
| `/subscribe` | Subscribe | **UI shell only — backend not wired yet** |

## Content pipeline (how sermons get on the site)

```
Google Takeout (blog export)
   └─ extract  → data/source/posts.json        (full posts + parsed scripture/lectionary fields)
   └─ classify → data/source/classified.jsonl   (category, themes, summary, publish decision)
        └─ scripts/sync-content.ts → data/published-content.json   (only publish=yes, minus excluded titles)
             └─ npm run build (SSG) → dist/ → scripts/deploy.sh → S3 + CloudFront
```

- **The corpus is now vendored in `data/source/`** (363 posts) so the build is
  self-contained — it no longer reaches into the deprecated `tigersndragons`
  sibling. `sync-content.ts` defaults point at `data/source/`.
- ⚠️ **The original `extract.py` / `classify.py` were never saved** (ran in an
  ephemeral scratch env). Only their outputs survive. Reconstructing them in TS
  is in progress — see the importer roadmap below.
- `sync-content` currently emits **267 published** posts (247 sermons,
  19 worship resources, 1 reflection); 4 "St John UCC" bulletins are excluded by
  title rule.

## Done (2026-06-04 session)

- **Decoupled** the content pipeline from `tigersndragons` (corpus vendored in
  `data/source/`).
- **Reconstructed the RCL liturgical calendar** in `src/lib/liturgical.ts`
  (Gregorian Easter / Advent / season / year A–B–C). Validated against all 363
  archived posts via `npm run validate-extract`: **RCL year 100%**, season 97.2%
  (only cosmetic Epiphany/Christmas edge labels differ).
- **Dynamic liturgical theme**: page accent + a faint background wash shift with
  the current season, computed client-side from today's date (set on `<html>` as
  `data-season` in `src/main.tsx`; palettes in `src/styles.css`). Header shows a
  **season badge** linking to Vanderbilt. Palette: Advent=violet, Christmas=blue,
  Epiphany/Ordinary=green, Lent=somber purple, Easter=gold, Pentecost=red.
- **Vanderbilt RCL links** on Home + About (site-level only, not per sermon).
- **Care page** (`/care`) and **Give page** (`/give`) added; Home's three panels
  now route to `/care`.

## Roadmap (not yet done)

### Importer — make new Blogger posts flow in automatically
1. **Extraction (in progress)** — finish porting `extract.py`: scripture-ref
   parser, `lectionary_code_title`, `series`, `sermon_signals`, `body_opening`,
   HTML→text. (Liturgical calendar already done + validated.)
2. **`scripts/lib/classify.ts`** — reproduce the classifier with the Anthropic
   SDK (Claude Haiku 4.5 + prompt caching) emitting the existing
   `classified.jsonl` schema. Controlled vocabularies are in `data/source/`.
3. **`npm run import`** — fetch recent Blogger posts (key in Secrets Manager),
   skip known slugs, extract + classify only new ones, merge, regenerate
   `published-content.json`. Run by hand first.
4. **Phase 2 — AWS auto-import**: wrap as an EventBridge-scheduled Lambda;
   corpus + sync-state in an S3 content prefix; on new posts trigger CodeBuild →
   `npm run build` → `deploy.sh`.

### Subscribe service — turn the dead `/subscribe` shell into a real "join the gathering"
- **Phase 3**: DynamoDB subscribers + API Gateway (`/subscribe`, `/confirm`,
  `/unsubscribe`) + Lambdas + SES double opt-in. Wire the real form into
  `src/pages/Subscribe.tsx` (currently a `// TODO` shell).
- **Phase 4**: NotifyLambda emails confirmed subscribers when a new sermon
  publishes (closes the loop with the importer).
- **SES (long pole)**: verify `hopeandtruthministry.com` sender domain (DKIM via
  Route 53), bounce/complaint handling, and request production access
  (~24h AWS review). Start early.

### Smaller TODOs
- **Give page**: set `VENMO_USERNAME` / `PAYPAL_URL` at the top of
  `src/pages/Give.tsx` — buttons activate automatically once filled.
- **Care page**: curate/confirm the resource lists (data arrays at top of
  `src/pages/Care.tsx`).
- **Tax language**: none on `/give` yet (legal status unknown) — add if 501(c)(3).
- **Theme**: optional no-flash first paint (inline/build-time `data-season`).
- **Direct contact**: no "reach out to a person" path yet; would ride on the
  Subscribe/SES backend.

## Key facts / infra

- **AWS**: account `166782860262`, region `us-west-2`, IAM user `tehansen`.
- **Hosting**: S3 bucket `hopeandtruthministry.com`, fronted by **two**
  CloudFront distributions — apex `E293YSKYXW91AL`, www `E3H69QTPS1KHB`
  (both must be invalidated). Deploy: `scripts/deploy.sh`.
- **Blog**: `tonyswebstudios.blogspot.com`, ID `8000554665921912318`. Blogger
  API key in Secrets Manager `prod/blogger`. Proxy Lambda: `lambda/blogger-proxy/`.
- **Anthropic API key** (for classify): local in `tigersndragons/.env.local`
  (`ANTHROPIC_API_KEY`); will move to Secrets Manager for the Lambda.

## Commands

```sh
npm run dev              # local dev (port 5173)
npm run typecheck        # tsc --noEmit
npm run build            # SSG build → dist/
npm run sync-content     # rebuild data/published-content.json from data/source/
npm run validate-extract # check the liturgical calendar against the archive
./scripts/deploy.sh      # build + S3 sync + CloudFront invalidate (DRY_RUN=1 to preview)
```
