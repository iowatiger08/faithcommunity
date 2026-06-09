# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server at http://localhost:5173
npm run build        # SSG build → dist/
npm run preview      # Preview dist/ locally
npm run typecheck    # tsc --noEmit

npm test             # Run all tests (vitest + pytest)
npm run test:watch   # Vitest in watch mode
npm run test:py      # Python tests only (scripts/)

npm run lint         # ESLint (src/) + ruff (scripts/)
npm run lint:fix     # Auto-fix both
npm run lint:ts      # ESLint only
npm run lint:py      # ruff only

npm run sync-content # Rebuild data/published-content.json from source files
npm run import-posts # Fetch new posts from Blogger feed + run sync-content
npm run import-posts -- --deploy   # Fetch + sync + build + deploy to S3
npm run import-posts -- --dry-run  # Preview without writing

./scripts/deploy.sh  # Build + S3 sync + CloudFront invalidation
SKIP_BUILD=1 ./scripts/deploy.sh   # Deploy current dist/ without rebuilding
DRY_RUN=1 ./scripts/deploy.sh      # Dry run only
```

## Architecture

### Static site generation

The site uses **vite-react-ssg** — Vite + React Router v6 + SSG. Routes are defined as a flat array in `src/main.tsx` and passed to `ViteReactSSG`. Dynamic routes (sermons, worship-resources) use `getStaticPaths` callbacks that call `getAllPosts()` at build time to enumerate all slugs. The build emits nested `index.html` files (`/sermons/slug/index.html`) so paths serve cleanly on S3 without `.html` extensions.

### Content pipeline

Posts originate from a Blogger blog. The data pipeline has three layers:

1. **`data/source/posts.json`** — raw post corpus (HTML, metadata, scripture refs, liturgical season). Managed by `scripts/import-posts.ts`, which fetches the Blogger JSON feed and appends new entries.
2. **`data/source/classified.jsonl`** — one JSON record per line with `publish_decision` ("yes"/"no"/"maybe"), `section` ("sermons"/"worship_resources"/"reflections"), `themes`, and `summary`. Maintained manually or by `import-posts.ts` (heuristic initial classification).
3. **`data/published-content.json`** — the live file the React app imports. Built by `npm run sync-content`, which joins posts.json + classified.jsonl, keeps only `publish_decision=yes`, filters excluded titles (St. John UCC bulletins), sorts by date, and writes minified JSON. **This file must be regenerated any time the source files change.**

`src/lib/content.ts` loads published-content.json at build time and exports typed accessors (`getAllPosts`, `getPostBySlug`, `getSermons`, etc.).

### Liturgical theming

`src/lib/liturgical.ts` implements the Revised Common Lectionary (RCL) calendar:
- `currentSeason()` — returns the current liturgical season + RCL year letter, based on today's date
- `src/main.tsx` sets `document.documentElement.dataset.season` (e.g. `"advent"`) before hydration
- `src/styles.css` maps each `[data-season="…"]` attribute to CSS custom properties (`--accent-rgb`, `--paper-rgb`, `--bookend-rgb`), giving the site a seasonal color theme that changes automatically

### Path alias

`~` resolves to `src/`. Import as `~/lib/content`, `~/components/Layout`, etc.

### Deployment

S3 bucket: `hopeandtruthministry.com` (us-west-2), fronted by two CloudFront distributions (apex `E293YSKYXW91AL` + www `E3H69QTPS1KHB`). `deploy.sh` syncs hashed assets with long cache headers, then re-syncs HTML with `no-cache` headers, then invalidates both distributions. Requires `aws-cli v2` authenticated.

### Legacy code

The `legacy/` directory contains an old Angular version of the site — it is not used and should be ignored.

## Content rules

- Author name is **Tony E Hansen** — never use "Tony Dillon Hansen"
- Scripture citations must use specific verse references (e.g., Proverbs 18:13, Matthew 15:14), not vague labels
