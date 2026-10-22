# Merge the forum page into Queer Resources

## Context

`/forum` was built for the Windsor Heights Lutheran Church forum on Sunday
2026-10-25 (see `docs/forum-qa-plan.md`). It does two jobs: a code-gated
question box, and a sourced research section on coming out, acceptance,
faith, work, aging and marriage. Once the forum is over, the question box has
no use. The research still does, and it belongs with the rest of the material
on `/queer-resources`.

Goal: move the research onto `/queer-resources`, leave
the question box behind, and retire `/forum`. The link that went out to the
congregation lands on a short "that page doesn't exist anymore" page rather
than a bare error.

Out of scope: rewriting the statistics. They move as they are, with their
sources.

## When

Not before the intake closes (`CLOSES_AT`, 2026-10-25 17:00 UTC). Phase 1 can
ship any time after that. Phase 2 waits until every question has been read
and deliberately deleted.

## Done ahead of the merge

The Iowa entries from the forum's `local` list are already on Queer
Resources: One Iowa, Iowa Safe Schools and Capital City Pride in a new
**In Iowa** section, which also lists the Eychaner Foundation's Matthew
Shepard Scholarship. The HRC coming-out guide sits under Community
resources. When the forum page is retired, its `local` list and
`ResourceList` go with it.

## Phase 1: move the content

### What moves

From `src/pages/Forum.tsx`:

- The `Stat` data arrays (`acceptance`, `rejection`, `scale`, `comingOut`,
  `faith`, `church`, `work`, `older`, `marriage`) and `StatList`.
- The research sections: "What the research says", "What acceptance does",
  "What rejection does", "Reality is", the crisis box, "At work", "Growing
  older", "What young people say about church", "Faith importance?",
  "Marriage".
- The sources note at the foot of the page.

Move the data and `StatList` into `src/components/research/` (for example
`stats.ts` and `StatList.tsx`) so the page file does not grow by 700 lines.
The comment about checking every figure against a primary source goes with
the data.

### What stays behind

- The access-code gate, the question form and all of its state, `API_BASE`,
  `CLOSES_AT`, `MAX_QUESTION_LENGTH`, and the honeypot.
- "ELCA stance". It was written for a Lutheran congregation's forum and is
  not needed on Queer Resources.
- The "work in progress" note.
- The Windsor Heights header and the Sunday-specific intro copy.
- "Ask a question" in the jump list.
- The "Where to find more" link back to `/queer-resources` (it would link to
  itself).

### Where it goes on `/queer-resources`

Suggested order:

1. Intro (unchanged)
2. What does it mean to be LGBTQ+?
3. Coming out (the existing prose, followed by the forum's coming-out
   figures)
4. **What the research says** (new): framing paragraph, acceptance,
   rejection, reality, crisis box, work, growing older, church, faith,
   marriage
5. Affirming organizations (unchanged: ReconcilingWorks, UCC Open and
   Affirming Coalition, The Episcopal Church)
6. Community resources and In Iowa (already live, see above)
7. Youth resources
8. Further reading (the reflections already appear here once)
9. Sources note, then the existing Care / Contact footer

Bring over the jump list and `BackToTop`. The page gets twice as long, and
the forum page showed they help. Give every section an `id`. The existing
"Coming out" prose and the forum's coming-out figures share one
`id="coming-out"`, so there is no duplicate anchor.

### Duplicates to resolve

- PFLAG, HRC and ReconcilingWorks are on both pages. Keep the Queer
  Resources entries. Add the HRC coming-out guide as its own line, since it
  is a different URL from the HRC home page.
- The Trevor Project is in the crisis box and in Youth resources. Keep both:
  the crisis box is for right now, the list is for reference.
- `ReflectionList` shows up once now, so the "must match the forum page"
  comments in `ReflectionList.tsx`, `content.ts` and
  `QueerResources.test.tsx` need rewording.

### Copy to review

The forum copy was written for one room on one Sunday. Before it goes onto
an indexed page, read every moved paragraph for:

- "Sunday", "this forum", "ahead of time", and first-person lines like "I do
  not require that".
- Any mention of the congregation by name. The public page should not tie
  the material to Windsor Heights.
- The prose rules in memory: plain wording, no blame assigned to groups, no
  sentences ending in prepositions.

### Retiring `/forum`

The forum page is retired once the merge ships. Replace `Forum.tsx` with a
small "gone" page in the style of `NotFound.tsx`:

- Heading along the lines of "Oops, that page doesn't exist anymore."
- One line saying the forum has finished, with links to Queer Resources and
  home.
- `PageHead` with `noindex`. No redirect.

It stays a real route (`/forum/index.html` from the SSG build) rather than
falling through to the catch-all. That way it serves with a 200 whatever
CloudFront's 404 handling does, and the people who have the link see a
friendly message rather than an S3 error.

### Tests (red-green-refactor)

Move into `QueerResources.test.tsx` the `Forum.test.tsx` cases that apply to
the public part: a source and year for every figure, the HRC faith figures
and their caveat, work, growing older, marriage, crisis resources next to
the risk figures, and the jump list with return links. New cases:

- The page has no question form, code field or textbox.
- The page never mentions Windsor Heights.
- Every jump-list target exists, and no `id` appears twice.

Rewrite `Forum.test.tsx` for the gone page: it says the page no longer
exists, links to Queer Resources and home, and has no form or code field. Delete the gate, anonymity,
submitting, bot-defense and cutoff tests along with the form.

Then run `npm run lint && npm run typecheck && npm test`.

## Phase 2: retire the intake and admin (after deletion)

Prerequisite: all questions read, then deleted with:

```bash
npx tsx scripts/forum-questions.ts --delete-all
```

The table has no DeletionProtection and no `DeletionPolicy: Retain`.
Removing it from `lambda/template.yaml` deletes it, along with anything still
in it. Run the delete-all first so the deletion is deliberate, not a side
effect of a stack update.

Then remove:

- `src/pages/ForumAdmin.tsx`, its test, and the `forum-admin` route in
  `src/main.tsx`.
- `src/lib/auth.ts`, and the `buffer` shim in `vite.config.ts` if nothing
  else imports it (today only ForumAdmin does).
- `lambda/forum-intake/`, `lambda/forum-admin/`, `lambda/forum-params.env.example`,
  and the forum parameters, table, functions, log groups and API events in
  `lambda/template.yaml`. The shared `tigersndragons-users` Cognito pool
  stays, since webtop and deutsch use it. Remove only this site's client or
  allowed-sub setting.
- `scripts/forum-questions.ts` and its npm script, plus the forum lines in
  `scripts/teardown.sh`, `scripts/deploy-lambda.sh` and `.env.example`.
- The forum paragraphs in `src/pages/Privacy.tsx` and the mention in
  `src/pages/Terms.tsx`, updated to say forum questions are no longer
  collected and the ones collected were deleted.

Deploy order: site first (so nothing calls the API), then
`scripts/deploy-lambda.sh`.

## Decisions

- ELCA stance is dropped, not moved. The ReconcilingWorks, UCC and Episcopal
  entries on Queer Resources stay as they are.
- `/forum` is retired and shows a "doesn't exist anymore" page. It does not
  redirect.

## Open questions

- Retire the member code now (rotate `ForumMemberCode`), or let Phase 2
  remove it?
