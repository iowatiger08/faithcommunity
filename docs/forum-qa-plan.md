# Forum Q&A intake page for Windsor Heights Lutheran Church

## Context

Tony is facilitating a forum at Windsor Heights Lutheran Church (ELCA, Windsor Heights, IA) on **Sunday 2026-10-25** on "coming out" and being queer as a Christian. He wants a page on hopeandtruthministry.com where congregation members submit questions ahead of time, so he can prepare rather than field everything cold in the room — plus well-sourced statistics on coming out and on youth suicide risk as it relates to coming out and to faith identity, both as forum material and as grounding for participants.

Three things make this more than a contact form:

1. **Access must be limited to that congregation, and bots must not get in.** A shared access code announced from the front is the right instrument — no accounts to administer — validated server-side so it never ships in the JS bundle.
2. **Submissions close Sunday at noon.** The intake window is enforced server-side, not just hidden in the UI.
3. **The data is sensitive and the room is public.** Questions about coming out, submitted with a name and email inside a church, can out someone who isn't ready. And because questions get read aloud, a harassing or threatening submission must never reach the forum unreviewed. The design treats submissions as confidential disclosures held for pastoral review.

Deadline is four days, so the build reuses the already-working contact-form pipeline wherever possible.

## Decisions

| Question | Decision |
|---|---|
| Where submissions go | DynamoDB (system of record) + an SES notification to Tony; read via `/forum-admin` and a local script |
| Retention | **No auto-delete.** No TTL. Data persists until Tony deletes it deliberately |
| Submission window | Closes **Sunday 2026-10-25 at 12:00 CDT** (`2026-10-25T17:00:00Z`), enforced in the Lambda |
| Name / email | Required by default, with an "Ask this anonymously" checkbox; omission enforced **server-side** |
| Attribution | Names are withheld unless the submitter ticks "You may use my name" — unticked is the default, and an anonymous submission can never grant it |
| Harassment / threats | Narrow automated screening → **held for review**, never silently discarded |
| Statistics | Public — only the question form sits behind the access code |
| Route / visibility | `/forum`, unlisted (no nav/footer entry), `noindex`; admin at `/forum-admin` |
| This plan | Also saved into the repo at `docs/forum-qa-plan.md` |

Why not a Claude Artifact with shared storage: the `db` capability resolves `null` for signed-out viewers and serves only the owner's organization and invited guests, so congregation members could not use it.

## What already exists and gets reused

- `lambda/contact-form/index.mjs` — working handler: CORS origin allowlist, honeypot, email validation with a CRLF-injection guard, per-IP rate limiting, link-score and spam-phrase heuristics, Comprehend moderation, SES send.
- `lambda/template.yaml` — the single SAM template (stack `blogger-proxy-stack`, us-west-2). Already has `ContactHttpApi` with the right CORS allowlist (apex, www, localhost:5173/4173, POST+OPTIONS, `Content-Type` only), the SES domain identity with DKIM, and the 14-day log-group pattern.
- `src/pages/Contact.tsx` / `Contact.test.tsx` — frontend and test idiom: plain `useState`, `import.meta.env.VITE_*`, `fetch` POST, honeypot, success/error states; tests mock `global.fetch` and `~/components/PageHead` and wrap in `MemoryRouter`. No form or validation library in the repo — keep it that way.
- `lambda/contact-form/index.test.mjs` — ~30 tests. `vitest.config.ts` already runs `lambda/**/*.test.mjs` in the node env; no config change needed.
- `src/pages/Care.tsx` — the crisis-callout idiom (`rounded-lg border-2 border-accent/40 bg-accent/5 p-6`) and the `Resource[]` + `ResourceList` data pattern. The forum page links `/care#crisis` rather than restating crisis lines.
- `src/pages/QueerResources.tsx` — closest sibling page for tone and card idiom. Carries **no statistics at all** today, which is the gap this page fills.

Page conventions (`src/main.tsx`, `src/components/Layout.tsx`, `tailwind.config.ts`): flat route array, kebab-case paths with no leading slash, added before the `{ path: "*" }` catch-all; nav and footer are hard-coded JSX, so an omitted page ships unlinked (as `/community-sitting` and `/four-noble-truths` already do); `PageHead` takes `title`, `description`, `path` (trailing slash, because `dirStyle: "nested"`); use the `accent` / `ink` / `paper` tokens so liturgical theming keeps working; no Tailwind typography plugin and no `.btn` / `.card` class, so reuse the inline `border border-ink/10 rounded-lg p-6` card idiom.

## Keeping out bots and strangers

Layered, because no single one of these is strong:

1. **Server-side access code.** Compared with `timingSafeEqual` over SHA-256 digests (equal width, so no throw and no length leak) and **failing closed** — if `FORUM_MEMBER_CODE` is unset, every attempt is rejected rather than every attempt admitted.
2. **A separate `POST /forum/verify` route** that mints a short-lived HMAC token. Beyond the UX win (nobody types a paragraph about being disowned and *then* learns the code was wrong), this is what makes brute-force throttling tractable: `/forum/question` verifies a signature and never compares a code, so **all** code guessing funnels through one route instead of two.
   Token is deliberately not a JWT, zero dependencies: `"<expUnixSeconds>.<hmacSha256Hex(secret, "forum:" + forumId + ":" + exp)>"`, 2-hour TTL, `forumId` inside the signed string so a token can't be replayed against a different forum.
3. **Honeypot field — but not named `website`.** The contact form uses `website`, which Safari and 1Password will sometimes autofill; a false positive here silently eats a real question. Use `confirm_url`, with `tabIndex={-1}` and `autoComplete="off"` as `Contact.tsx:80-91` already does. Honeypot hits keep the silent `200` — a bot must not learn it was caught. This is the only place a silent success is still correct.
4. **Minimum compose time.** Reject a submission arriving under ~3 seconds after the token was minted; the token's mint time is already signed, so this costs nothing to check and no extra state.
5. **Per-IP throttles**, two independent limiters: ~10 failed verifies / 10 min, and ~20 submissions / hour. Only **failed** verifies count, because a congregation behind one church-wifi NAT shares a source IP and forty people typing the correct code must not lock each other out. Stated plainly: the limiter is per-container in-memory, so it resets on cold start and an attacker gets `limit × warm containers`. It is an abuse backstop, not the access control.
6. **Stage-level throttle** on `ContactHttpApi` (`DefaultRouteSettings: ThrottlingRateLimit: 10, ThrottlingBurstLimit: 20`), which also caps the SES and DynamoDB bill under attack. Note this applies to `/contact` too; 10 rps is orders of magnitude above this site's real traffic, so it engages only during an attack.
7. **Strong codes — the highest-value control, and free.** Member code ≥10 chars, mixed case and a digit, speakable for the bulletin. **Admin code ≥24 random chars from a password manager, unrelated to the member code.** A weak admin code defeats everything else on this list.

CORS is *not* on this list: it protects browsers, not the API, and `curl` ignores it. No code comment should imply otherwise. All secrets travel in the JSON body, never a custom header — so `AllowHeaders` stays `Content-Type` and **no CORS config changes are needed**.

## Preventing harassing or threatening posts

The goal is that nothing harassing or threatening reaches the forum floor. The mechanism must be a **review queue, not a filter**, for a specific reason:

The contact handler discards anything Comprehend scores above 0.75 on *any* label, and returns a fake `200 {ok:true}` (`index.mjs:182`). On this content domain that is actively dangerous. `DetectToxicContent` emits `HATE_SPEECH, GRAPHIC, HARASSMENT_OR_ABUSE, SEXUAL, VIOLENCE_OR_THREAT, INSULT, PROFANITY`, and a sincere question will routinely trip them: `SEXUAL` on any mention of orientation or celibacy; `HATE_SPEECH` or `INSULT` on *quoting what was said to them* ("my father called me a —", "my pastor told me gay people go to hell"); `PROFANITY` on reclaimed words like "queer" or "dyke". The classifier scores the quoted abuse, not the author's intent. Combined with the silent discard, the exact person this page exists for sees "Thank you, your question has been received", their question is deleted, and nobody ever finds out.

So:

- **Screen on two labels only** — `VIOLENCE_OR_THREAT` and `HARASSMENT_OR_ABUSE` — at a high threshold (0.9). Explicitly **not** `SEXUAL`, `PROFANITY`, `HATE_SPEECH`, or `INSULT`, which are the false-positive generators on queer testimony.
- **A hit sets `status: "held"` plus `flagReason`. The item is still stored in full and the submitter still gets a normal success response.** Nothing is ever discarded.
- **Held items are excluded from the default admin list** and shown in a separate "Held for review" section, so Tony cannot accidentally read one aloud, and the notification email says something was held.
- **Comprehend failures fail open to `"received"`, not to `"held"`** — an AWS blip must not quarantine a legitimate question.
- The real safeguard is still that Tony reads everything before the forum. The queue exists so that a deliberately abusive submission can't slip into a stack of printed questions.

Link-heavy submissions get a **visible, actionable `400`** ("Please remove any web links from your question") rather than a silent discard, so the person can fix it and their question survives. Drop `SPAM_PHRASES` entirely — it exists to filter open-internet commercial spam that the code gate already stops, and every phrase is a chance to reject a real question.

## Closing the window Sunday at noon

Env var `FORUM_CLOSES_AT=2026-10-25T17:00:00Z` (noon CDT; Iowa is still on CDT on Oct 25, since DST ends Nov 1, 2026).

- **Enforced server-side** in both `/forum/verify` and `/forum/question`: past the cutoff both return `403 {error: "Submissions for this forum are now closed."}`. A page left open in a tab, or a replayed token minted before noon, cannot submit after it.
- `/forum` renders a "submissions are closed" state instead of the gate once the cutoff passes. The statistics stay readable — they are the lasting value of the page.
- The admin route has **no** cutoff; Tony keeps reading after the forum.
- A date in an env var means the window can be extended with one `sam deploy` if the forum moves, with no code change.

## Backend

### Routes — added to the existing `ContactHttpApi`

Reuse the API rather than standing up a new one: its CORS allowlist is already exactly right, route additions are additive and cannot disturb the working `/contact` route, and it keeps one API ID in `.env`.

| Route | Request | Response |
|---|---|---|
| `POST /forum/verify` | `{ code, confirm_url }` | `200 {ok, token, expiresAt}` / `400` / `401` / `403` closed / `429` |
| `POST /forum/question` | `{ token, anonymous, name?, email?, question, confirm_url }` | `200 {ok, id}` / `400` / `401` expired → re-gate / `403` closed / `500` |
| `POST /forum/admin/questions` | `{ code }` | `200 {ok, count, questions, held}` / `400` / `401` / `429` / `500` |

Plus `OPTIONS` on each, following the `ContactPost` / `ContactOptions` pair at `template.yaml:170-181`. Admin listing is a **POST, not a GET**, so the admin code travels in the body — query strings land in access logs, browser history, and referrers. Admin responses carry `Cache-Control: no-store`.

The admin route gets no separate verify step: the list request *is* the verification.

### Two Lambda functions, not one

```
lambda/forum-intake/   POST /forum/verify, /forum/question   → PutItem + SendEmail only
lambda/forum-admin/    POST /forum/admin/questions           → Query only
```

Each with `index.mjs`, `index.test.mjs`, `package.json`, `.gitignore` (`node_modules/`).

One combined function would need both `PutItem` and `Query`, so the internet-facing submit path could read every submission in the table. Split, a path-matching or parameter-injection bug in the public route **cannot** become a data breach. That is a real trust boundary for one extra directory. `/verify` and `/question` stay together because they share the HMAC secret, CORS helper, limiters, and honeypot, and `/verify` touches no table — splitting them separates no privilege.

Deps — intake: `@aws-sdk/client-ses`, `@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`, `@aws-sdk/client-comprehend`, plus builtin `node:crypto`. Admin: the two DynamoDB packages. Use the DocumentClient, constructed with **`marshallOptions: { removeUndefinedValues: true }`** — otherwise omitting `name`/`email` on an anonymous submission throws.

Route inside intake on `event.requestContext?.http?.path` with `endsWith`, not `===`, so it is stage-prefix-agnostic.

Add `ForumIntakeLogGroup` and `ForumAdminLogGroup`, `RetentionInDays: 14`, matching `ContactFormLogGroup`.

### DynamoDB table — no TTL

```yaml
  # Single-partition table: one forum, dozens of items. Query (newest-first)
  # rather than Scan so the admin role never needs dynamodb:Scan.
  # No TTL by design — questions persist until deleted deliberately
  # (scripts/forum-questions.ts --delete-all). No PITR, so the data does not
  # accumulate extra copies outside that deliberate deletion.
  ForumQuestionsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub "${AWS::StackName}-forum-questions"
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - { AttributeName: forumId, AttributeType: S }
        - { AttributeName: sk,      AttributeType: S }
      KeySchema:
        - { AttributeName: forumId, KeyType: HASH }
        - { AttributeName: sk,      KeyType: RANGE }
```

- `forumId` is a constant per forum (`"windsor-heights-2026-10"`, from env). That constant partition is what makes the admin read a **`Query`** with `ScanIndexForward: false` — newest-first for free, and the admin role never needs `dynamodb:Scan`, which on a table of sensitive disclosures is a strictly broader capability than this feature needs. A future forum is a new partition, not a schema change.
- `sk` is `${ISO}#${8 hex}` — chronologically sortable, suffix guarantees uniqueness in the same millisecond. `submittedAt` is stored separately so the admin handler never parses the sort key.
- Attributes: `forumId`, `sk`, `questionId`, `submittedAt`, `anonymous` (BOOL), `allowName` (BOOL), `name`/`email` (**keys absent entirely** when anonymous — never `""`), `question`, `status` (`"received"` | `"held"`), `flagReason` (optional).
- **No `ttl` attribute and no `TimeToLiveSpecification`**, per the retention decision.
- **No IP address, ever.** An IP stored beside an anonymous submission re-identifies it.
- `PAY_PER_REQUEST` — tens of writes total; provisioned would cost ~$0.50/mo for unused capacity plus autoscaling to think about.
- Encryption at rest uses the default AWS-owned key. Note the CMK choice in a comment; don't add one for four days of benefit.
- **PITR off** and `DeletionProtectionEnabled` omitted: backups would silently outlive the retention promise made to submitters, and `scripts/teardown.sh` should be able to actually delete this data.

IAM, scoped to the table ARN rather than `"*"` (the existing `ses:SendEmail` statement keeps `"*"`, matching `ContactFormFunction`, because SES doesn't support resource-level ARNs for that action):

```yaml
# ForumIntakeFunction — write-only; cannot read any submission
- { Effect: Allow, Action: [dynamodb:PutItem], Resource: !GetAtt ForumQuestionsTable.Arn }
- { Effect: Allow, Action: [ses:SendEmail], Resource: "*" }
- { Effect: Allow, Action: [comprehend:DetectToxicContent], Resource: "*" }
# ForumAdminFunction — read-only, Query only, no Scan
- { Effect: Allow, Action: [dynamodb:Query], Resource: !GetAtt ForumQuestionsTable.Arn }
```

### Permission to use a name

Separate from anonymity. A submitter who gives their name may also tick "You may use my name if you raise this"; unticked is the default, so doing nothing keeps them unattributed. Phrased as permission rather than refusal precisely so the safe answer is also the default answer.

```js
// Requires a literal true: absent, "true", 1 all withhold. An anonymous
// submission can never grant it — there is no name to use, and the admin
// view must not offer to attribute one.
const allowName = !anonymous && body.allowName === true;
```

Stored as `allowName` and surfaced in `/forum-admin` as "name may be used" or a bolded "do not use name" beside each question, so it cannot be missed while reading aloud. Three places must agree on this and are covered by tests: the notice above the form, the success message, and the privacy page.

### Server-side anonymity enforcement — the single most important rule

```js
// Read the flag FIRST. Only read name/email at all when it is false.
const anonymous = body.anonymous === true;
const name  = anonymous ? undefined : body.name;
const email = anonymous ? undefined : body.email;
```

Never trust the client to have cleared the fields. A React bug where state isn't reset when the checkbox is ticked would silently de-anonymize someone who explicitly asked not to be identified. Two tests guard this.

### Email: notify, don't duplicate

The notification is **content-free by default**: subject `Forum question #a1b2c3d4` (or `#a1b2c3d4 — HELD for review`), body a timestamp and a link to `/forum-admin`. Tony still gets pinged the moment something arrives, but the only copy of the disclosure stays in the table rather than living forever in a Gmail inbox, synced to a phone, outside any retention decision. It is also less code than formatting the content.

Make it a deploy-time toggle, `EMAIL_INCLUDE_CONTENT`, default `"false"`, so flipping it needs no code change.

- **The subject must never contain question text** — a lock-screen preview showing the first line of someone's coming-out question is a real leak.
- **Omit `ReplyToAddresses` entirely** (the contact form sets it; don't copy that here), so anonymous and named notifications have byte-identical shape.
- SES sandbox is satisfied: `ToAddresses` stays the fixed verified `hopeandtruthministry@gmail.com`, `Source` stays `noreply@hopeandtruthministry.com`. **Nothing is ever emailed to the submitter.**
- **SES failure must still return `200` with the item stored.** DynamoDB is the system of record; a failed notification must not lose someone's question. Conversely a `PutItem` failure returns `500` and must not claim success.

### Logging — submissions must never reach CloudWatch

`lambda/blogger-proxy/index.mjs:38` is `console.log('Received event:', JSON.stringify(event, null, 2))`. That is exactly the line that would dump names, emails, and coming-out narratives into CloudWatch, and an implementer told to "follow the existing lambda pattern" may well copy it. **Do not.**

Rules for both new files: never log `event`, `body`, `question`, `name`, `email`, the codes, or the token. Log only route, status, `questionId`, and a hashed actor hint (`sha256(ip + forumId).slice(0, 8)`) so rate-limit debugging stays possible without recording who visited a page about coming out. Error paths log `err.message` only, never `err`. `ContactHttpApi` has no `AccessLogSettings` today — leave access logging off, since it would record source IPs for `/forum/*`.

### Deliberate duplication — do not refactor the contact form

SAM packages one `CodeUri` directory per function, so a sibling `lambda/shared/` is not bundled without either a Lambda layer, a move to `CodeUri: .` with nested handler paths, or a copy step. All three are new packaging mechanics, and the second means redeploying the **working contact form** — the site's only inbound channel — on a different code root, four days out. Not worth it.

Copy verbatim (with their comments, which explain non-obvious reasoning): `ALLOWED_ORIGINS` + `corsHeaders` (`24-40`), the origin-enforcement block that allows a *missing* Origin (`136-139`), `EMAIL_RE` + `MAX_EMAIL_LENGTH` and the CRLF comment (`15-19` — the most security-critical lines in the existing codebase), the JSON parse guard (`141-146`), and the `console.error(err.message)` shape.

Copy and improve: `checkRateLimit` (`42-50`) becomes `makeRateLimiter({ limit, windowMs })` returning a closure, so intake can hold two independent limiters.

Copy and deliberately change: `linkScore` kept but returning a visible `400`; `SPAM_PHRASES` dropped; `isToxic` narrowed to two labels and used to hold, not discard.

Don't copy: `VALID_CATEGORIES`, `sendEmail`.

Header comment in both new files noting the duplication is intentional and time-boxed, naming the Lambda-layer extraction as the post-event follow-up.

### Testability gotcha

`contact-form/index.mjs` reads `process.env` at module load (lines 7–14), so tests can't set the codes before the import is evaluated. **Read the codes, HMAC secret, and cutoff lazily** via small accessors (`memberCode()`, `adminCode()`, `hmacSecret()`, `closesAt()`) called inside the handler. Costs nothing, makes tests trivial, and allows rotation without a cold start. Numeric tunables can stay module-level.

## Frontend

### `src/pages/Forum.tsx` (new)

One component, four states; no router nesting.

1. **Public, always visible** — intro naming the forum, date and congregation; the statistics; sources; links to `/care#crisis` and `/queer-resources`.
2. **Gate** — access-code input → `POST /forum/verify`. Wrong code shows a plain message; the form stays hidden.
3. **Form** — name, email, question, "Ask this anonymously" checkbox, hidden `confirm_url` honeypot (`aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`). Ticking anonymous disables, clears, and un-requires name/email and omits both keys from the payload. On `401` from submit, drop back to the gate with "your session expired" **and preserve the typed question** — losing two hours of composition on this subject is a real failure, not a polish issue.
4. **Closed** — past the cutoff, replace the gate with a "submissions are closed" note; statistics still render.

Privacy copy above the form, not buried: who reads submissions (Tony only), that questions are raised in the forum **without attribution**, that the anonymous option exists, and that submissions are kept only until he deletes them after the event.

Never persist the token to `localStorage` or `sessionStorage` — React state only.

### `src/pages/ForumAdmin.tsx` (new)

Admin code input, then submissions newest-first: timestamp, name/email or "Anonymous", question text. A separate **"Held for review"** section below for `status: "held"` items, each showing its `flagReason` **and the full question text** — held means "read this carefully before using it", not "hidden from Tony". Read-only, unlisted, `noindex`, admin code never persisted to storage.

### `src/components/PageHead.tsx` (modify)

Add an optional `noindex?: boolean` rendering `<meta name="robots" content="noindex, nofollow" />`. There is no robots support anywhere in the repo today (no prop, no `public/robots.txt`, no sitemap), so this is small and additive.

**Do not create `public/robots.txt`.** A `Disallow: /forum-admin` line would *advertise* the admin path to anyone who reads robots.txt — the first thing a scanner fetches. `noindex` keeps the page out of results without publishing the path. This is the reflex to resist.

### `src/main.tsx` (modify)

Add `{ path: "forum", Component: Forum }` and `{ path: "forum-admin", Component: ForumAdmin }` before the catch-all. **No `Layout.tsx` nav or footer entry.** Note `vite-react-ssg` prerenders every route, so `/forum/index.html` will exist in the public bucket — fine, it holds only the gate — but "unlisted" means not linked and not indexed, **not secret**.

## Statistics content

All figures verified against primary sources during planning. Each renders with its source and year inline — this is a church forum where numbers will be challenged, so an unsourced figure is worse than none.

**Framing rules** (safe-messaging practice, since this section concerns suicide): lead with protective factors, not risk numbers; state plainly that LGBTQ+ young people are not at higher risk *because* of who they are but because of how they are treated (the Trevor Project's own framing); no method details anywhere; crisis resources in the same screenful as the risk figures, via the `/care#crisis` callout idiom.

### Group 1 — What acceptance does (lead with this)

- **At least one accepting adult**: **40% lower odds** of a past-year suicide attempt (17% vs. over 25%) — Trevor Project, 2019.
- **At least one LGBTQ-affirming space**: **35% reduced odds**; for trans and nonbinary youth a gender-affirming space, **25% reduced odds** — Trevor Project brief, 2020 data. *The single most relevant statistic for a congregation deciding what it wants to be.*
- **6%** attempted suicide in very accepting communities vs. **18%** in very unaccepting ones — Trevor Project 2025 survey (16,000+ youth, 13–24).
- Among trans and nonbinary youth: **7%** where everyone at home respected their pronouns vs. **18%** where no one did — same survey.

### Group 2 — What rejection does

- Family Acceptance Project (Ryan et al., SF State): high family rejection in adolescence → **8.4× more likely** to have attempted suicide, **5.9×** high depression, **3.4×** illegal drug use.
- **65.5% vs. 49.6%** screened positive for depression among transgender and gender-expansive youth whose families *never* use their correct pronouns against those whose families *always* do; correct name moves anxiety from 72.1% to 61.9% — HRC Foundation 2023 LGBTQ+ Youth Report (12,615 youth ages 13–18).
- **13%** of LGBTQ+ young people have been threatened with or subjected to **conversion therapy** (Trevor Project 2024). Of 1,320+ practitioners identified across 48 states, **54% operate in a ministerial or religious capacity**. Exposure is associated with **more than double** the likelihood of a past-year attempt. *Name this directly — it is the harm a church is most likely to be implicated in.*

### Group 3 — The scale of the risk

- **36%** seriously considered suicide in the past year (40% of trans and nonbinary youth); **1 in 10** attempted — Trevor Project 2025.
- **59%** of LGBTQ+ youth 13–17 were bullied in the past year, with more than three times the attempt rate among those who were — same survey.
- **Iowa**: **34%** seriously considered suicide (42% of trans and nonbinary); **9%** attempted (13%) — Trevor Project 2024 50-state report.
- **51%** screened positive for depression and **67%** for anxiety, **30%** for severe psychological distress — HRC Foundation 2023 LGBTQ+ Youth Report.

### Group 4 — Coming out

- **96%** of LGBTQ adults have told someone; **77%** are out to their parents, so **23% are not** — Pew, January 2025.
- **46%** say their parents are accepting — 52% of gay and lesbian adults, 44% of bisexual, **31% of transgender** — Pew 2025.
- From Pew's **2013** survey (label the year; no newer equivalent): **56%** had told their mother, **39%** their father; **one-third** of religiously affiliated LGBT adults reported a conflict between their beliefs and their identity.
- **82.7%** of LGBTQ+ youth are out to at least one immediate family member, but only **26.4%** to all of them and **40.9%** to all parents/guardians — coming out is a long series of conversations, rarely finished. HRC Foundation 2023 LGBTQ+ Youth Report.
- **63.1%** reported at least one supportive parental response and **57.4%** at least one rejecting one — overlapping majorities, so most young people get both from the same family. HRC Foundation 2023 LGBTQ+ Youth Report.
- **85%** of LGBTQ+ adults are at least somewhat open; **33%** more open than two years ago, **22%** less, and **78%** think acceptance of transgender and nonbinary people has fallen — HRC Community Insights, 9,328 adults, August–September 2026. Outness is not a one-way door.

### Group 5 — At work

Added because the forum is not only about teenagers — most of the congregation is of working age, and these figures describe a decision adults make every week.

- **47%** of LGBTQ workers have experienced discrimination or harassment at work at some point; **34%** have been fired, not hired, or passed over for promotion; **17%** in the past year — Williams Institute, UCLA, survey of 1,902 LGBTQ workers, 2023.
- **46%** are not out to their current supervisor; **21%** are not out to any coworker.
- **39% vs. 12%** reported discrimination among those out at work against those out to no one — more than triple. Being known carries a cost and people price it accurately.
- **33%** have left a job over an employer's treatment of their orientation or gender identity.

Legal framing stated on the page, and it must stay precise: *Bostock v. Clayton County* (2020) made firing someone for being gay or transgender illegal nationwide under Title VII. Separately, in **February 2025 Iowa removed gender identity from the Iowa Civil Rights Act**, effective July 2025 — the first state to repeal such a protection rather than never having had one. **Sexual orientation remains protected under Iowa law and the federal employment protection still stands**; what transgender Iowans lost were the state-level housing, wage, and public-accommodation protections. Overstating that repeal would be its own misinformation, and a test asserts the qualifier stays on the page.

### Group 6 — Growing older

Nearly all research on this subject concerns young people, which misleads a congregation whose members are mostly not young.

- **~3 million** LGBT adults over 50 in the US, expected to reach **~7 million by 2030** — SAGE and the National Resource Center on LGBT Aging.
- **2×** as likely to live alone and **4×** less likely to have children: the assumed care network of spouse and nearby grown children is far less likely to exist.
- **59%** report a lack of companionship and **53%** feeling isolated; a quarter of SAGE's New York care-management clients had **no one to call in an emergency**.
- **34%** worry about hiding who they are to get into senior housing; **88%** would feel more comfortable in long-term care with LGBT-trained staff. Some people re-closet themselves in order to be cared for.
- **82%** report at least one instance of victimization and about two-thirds three or more; more than half report employment or housing discrimination.

The page draws the conclusion explicitly: what these elders lack is not money or medicine but the ordinary web of people who notice when you don't turn up — which is close to a definition of what a congregation is for.

### Group 7 — What young people say about church (HRC)

The most directly relevant group on the page for a congregation. These questions were asked in HRC's reports on Black and Latine LGBTQ+ youth, so the figures describe those populations — the page states that scope explicitly rather than implying they cover all young people.

- **63.1%** of Black LGBTQ+ youth raised in a religion said that religion was **unfriendly to LGBTQ+ people**; **60.3%** among Latine LGBTQ+ youth — HRC Foundation 2024 Black LGBTQ+ Youth Report (~1,200 youth, with the University of Connecticut) and 2024 Latine LGBTQ+ Youth Report (~2,200 youth).
- **54.5%** said their **religious beliefs triggered guilt and shame when they came out** (52.1% of Latine youth). *This is the figure a church is directly responsible for.*
- **20.1%** — one in five — are out to even some members of their faith community, making the congregation **the place they are least likely to be out**, behind family, friends, and school.
- **25.9%** said their faith community leaders support and include them (20% among Latine youth).

Pair the third figure with Group 1's affirming-space finding: one affirming space is associated with 35% lower odds of a suicide attempt, and church is the place these young people are least likely to be known. That gap is the argument for the forum, and the page makes it explicitly.

### Group 8 — Faith and the queer community

- **21%** of LGBTQ youth say religion or spirituality is important or very important (26% of those 18–24); **23%** pray or reflect at least weekly — Trevor Project brief, December 2022.
- That brief found valuing religion associated with slightly lower depression (55% vs. 58%) but **no significant relationship with suicidality** — faith on its own is neither protective nor harmful here; what matters is whether the community is affirming. State it that way rather than overclaiming in either direction.
- **72%** of Americans support LGBTQ nondiscrimination protections, **65%** favor same-sex marriage, **76%** of white mainline Protestants favor same-sex marriage — PRRI 2025 American Values Atlas (22,000+ adults).

### Group 9 — Marriage

Placed immediately before the ELCA section, because marriage is precisely what the ELCA has been reconsidering.

- **65%** of Americans favor legal same-sex marriage — down from a **71%** peak in 2022–23, up from **27%** in 1996 — Gallup Values and Beliefs survey, May 1–17 2026 (1,001 adults, ±4).
- **87% / 67% / 37%** among Democrats, independents, and Republicans; Republican support was 55% in 2021–22, so nearly all the recent decline sits in one column.
- **62%** say gay or lesbian relations are morally acceptable — the lowest since 2016. Acceptance is not a ratchet that turns only one way.
- **76%** of white mainline Protestants support same-sex marriage, above the national figure; **72%** of all Americans back nondiscrimination protections. In this tradition welcome is the majority position, not the brave one. (PRRI 2025 — moved here from the faith group, where it sat awkwardly.)

### Group 10 — Lutheran and ELCA context

- The **2009 ELCA Churchwide Assembly** voted to let congregations ordain partnered gay clergy and recognize same-sex relationships.
- The 2022 Assembly authorized reconsidering the 2009 social statement *Human Sexuality: Gift and Trust*. The first reconsideration (Section IV, marriage and family language) was **adopted at the 2025 Churchwide Assembly by a two-thirds vote, 724–46**, and is now the official text. A **second reconsideration, on "bound conscience," is still underway** — worth naming, because it is the live question in the ELCA right now and this forum sits inside it.
- **ReconcilingWorks' Reconciling in Christ (RIC)** program has been the public way for Lutheran congregations to declare themselves welcoming **since 1983**. Already linked from `QueerResources.tsx`.

### Local resources to add (not on the site today)

One Iowa (oneiowa.org), Iowa Safe Schools (iowasafeschools.org), Capital City Pride (capitalcitypride.org), and the **LGBT National Youth Talkline** 1-800-246-7743. The Trevor Project (1-866-488-7386, text START to 678-678) and 988 are already on `/care`.

## Implementation order

Test-first throughout, per the repo's red-green-refactor practice.

**Phase 0 — confirm before coding:** the two codes (generated into a password manager), the `FORUM_ID` string, and Windsor Heights Lutheran's own domain if it should be added to `OWN_DOMAIN_RE` so people can cite the church site without tripping `linkScore`.

1. `docs/forum-qa-plan.md` — save this plan into the repo.
2. `lambda/forum-intake/` — `package.json`, `.gitignore`, then `index.test.mjs` → `index.mjs`, in this test order: routing and OPTIONS; verify (correct, wrong, missing, 5000-char, **fail-closed on unset code**, trim-but-case-sensitive, 429 on 11th failure, other IP unaffected); token round-trip, forged HMAC, expired, wrong-secret; **cutoff passed → 403 on both routes**; submit validation (missing/malformed email, **newline in email → 400 with no SES and no PutItem**, blank question, >5000 chars, name >100, honeypot → 200 with neither PutItem nor SES, link → visible 400); item shape (`sk` matches `/#[0-9a-f]{8}$/`, `status: "received"`, **no `ttl` attribute**); **`anonymous: true` → no `name`/`email` keys even when supplied**, and neither value in the SES body; held path (`VIOLENCE_OR_THREAT` over 0.9 → `status: "held"` and still stored and still `200`; Comprehend throw → `"received"`, not `"held"`; `SEXUAL`/`PROFANITY` hits do **not** hold); **SES throws → still 200 and item stored**; **PutItem throws → 500 and no success claim**; origin/CORS (reflected, unknown → `""`, disallowed → 403, missing → allowed); and last, **the log-sentinel test** — submit distinctive sentinels and assert no `console.log`/`console.error` argument contains any of them.
3. `lambda/forum-admin/` — same shape. Tests: correct code → 200; wrong code → 401 with `QueryCommand` **not** called; **member code → 401** (codes not interchangeable); unset admin code → 401; `ScanIndexForward: false` passed *and* output order asserted; `QueryCommand` used and `ScanCommand` never constructed; held items returned separately with full text; anonymous items have no `name`/`email`; `Cache-Control: no-store`; 429 on 21st attempt; Query throws → 500 with no partial data; log sentinels.
4. `lambda/template.yaml` — `ForumQuestionsTable`; `ForumIntakeFunction` + `ForumAdminFunction` + their log groups and route/OPTIONS event pairs; `NoEcho: true` parameters `ForumMemberCode`, `ForumAdminCode`, `ForumTokenSecret` (no defaults) plus `ForumId`, `ForumClosesAt`; `DefaultRouteSettings` throttle on `ContactHttpApi`; `ForumApiBase` output. Then `sam validate --template lambda/template.yaml --region us-west-2` (read-only).
5. `src/vite-env.d.ts` — add `readonly VITE_FORUM_API_BASE: string;` (one base; pages append `/verify`, `/question`, `/admin/questions`).
6. `src/components/PageHead.tsx` — the `noindex` prop.
7. `src/pages/Forum.test.tsx` → `src/pages/Forum.tsx`. Cover: statistics render with no code; **no rendered text or attribute contains an access code**; correct code POSTs to `/forum/verify`; 200 reveals the form; 401 keeps it hidden; anonymous checkbox clears and un-requires name/email; **anonymous submit sends `anonymous: true` and no `name`/`email` keys**; named submit sends all fields plus the honeypot key; success state; **401 on submit re-gates and preserves the typed question**; submit disabled in flight; honeypot inside `aria-hidden="true"`; closed state past the cutoff; **`localStorage` and `sessionStorage` both untouched**.
8. `src/pages/ForumAdmin.test.tsx` → `src/pages/ForumAdmin.tsx`. Cover: gate; correct code renders each question; anonymous renders as "Anonymous" with no email; 401; empty state; **held items appear in their own section with the reason and the full text**; code not persisted.
9. `src/main.tsx` — the two routes before the catch-all. No `Layout.tsx` change, no `robots.txt`.
10. `scripts/forum-questions.ts` — local reader using Tony's existing aws-cli credentials (`tsx`, following `scripts/import-posts.ts`). Subcommands: default list, `--held`, and `--delete-all` with a typed-name confirmation like `scripts/teardown.sh`. **This is the recommended primary way to read submissions** — it exposes no public endpoint to the sensitive data. The `/forum-admin` page stays in scope because it is what lets Tony read questions from his phone at church; if it were dropped, `/forum/admin/questions` and the admin code would go with it.
11. `npm run lint && npm run typecheck && npm test`.

### Where the codes must not go

Both `.env` and `lambda/samconfig.toml` are **tracked in git** (`.gitignore` covers only `.env.local` and `.env.*.local`; `.env` has been committed since `f53a4f2`).

- `VITE_FORUM_API_BASE` goes in `.env` — a URL, not a secret, matching the already-committed `VITE_CONTACT_API_URL`.
- The three secrets go in **neither**. Put them in untracked `lambda/forum-params.env` and add `/lambda/forum-params.env` to `.gitignore`.
- **SAM gotcha:** a CLI `--parameter-overrides` **replaces** `samconfig.toml`'s `parameter_overrides` rather than merging, and the SAM CLI has no `UsePreviousValue`, so parameters without a `Default` must be supplied on *every* deploy. Patch `scripts/deploy-lambda.sh` (~8 lines) to build one overrides array from the two existing params plus `forum-params.env`, failing loudly if the file is missing — otherwise `./scripts/deploy.sh --with-lambda` breaks the moment these parameters exist. Add `npm install --omit=dev` lines for both new function dirs while in there.
- Honest about `NoEcho`: it keeps values out of `describe-stacks` but they remain **plaintext Lambda environment variables**, readable by anyone with `lambda:GetFunctionConfiguration`. It does not encrypt. Secrets Manager is the rigorous answer and the pattern already exists in this repo (`blogger-proxy/index.mjs:1-7`, `template.yaml:81-86`), but it adds an out-of-band secret, an IAM statement, and a cold-start call. For a four-day single-event feature where the only principal with Lambda read access is Tony's own account, env vars are acceptable — stated explicitly rather than glossed over, and listed as a post-event follow-up.
- Also worth doing here: add `.env` to `.gitignore` and commit `.env.example` with variable names only. The committed value is just a public API URL so nothing needs rotating, but `.env` is the obvious place a secret gets added by accident next time.
- Update the `scripts/teardown.sh` banner: `sam delete` now also destroys `blogger-proxy-stack-forum-questions` and every submitted question.

## Verification

1. `npm run lint`, `npm run typecheck`, `npm test` all clean — new Lambda tests (node env) and page tests (jsdom) alongside the existing suites.
2. `npm run dev`, then exercise `/forum` by hand: wrong code rejected; correct code reveals the form; anonymous checkbox clears and omits name/email; submit succeeds; honeypot submission silently accepted but not stored; a sub-3-second submission rejected; `/forum-admin` lists it.
3. After `npm run build`, **`grep -r` the access code against `dist/` and confirm it is absent.** This check must not be skipped.
4. Confirm `<meta name="robots" content="noindex, nofollow">` in `dist/forum/index.html` and `dist/forum-admin/index.html`, and that no `robots.txt` was created.
5. `DRY_RUN=1 ./scripts/deploy-lambda.sh` to eyeball the command, then `./scripts/deploy.sh --with-lambda`.
6. Live smoke test in order: wrong code → 401; right code → token; token → submit → 200; forged token → 401; **member code on the admin route → 401**; admin code → list contains the submission; `curl` the admin route with no Origin header to confirm the gate is the code, not CORS.
7. `aws dynamodb query` one item: confirm **no `ttl` attribute**, and that an anonymous item has **no** `name`/`email` attributes.
8. **Read both new CloudWatch log groups and confirm no submission text appears anywhere.**
9. Confirm the notification email arrived with a content-free subject.
10. Submit a plainly threatening test question and confirm it lands in the held section rather than the main list; submit a question containing "queer" and a quoted slur and confirm it is **not** held.
11. Just before the forum: confirm the cutoff by temporarily setting `ForumClosesAt` to a past instant, checking both routes return 403, then restoring it.
12. After the forum: read everything, then delete deliberately with `scripts/forum-questions.ts --delete-all`, and rotate or retire the member code.

## Source URLs for the citations

- Trevor Project 2025 National Survey — https://www.thetrevorproject.org/survey-2025/
- Trevor Project 2024 Iowa 50-state report — https://storage.googleapis.com/trevor-web-public/2025/02/2024-50-State-Report-Iowa.pdf
- Accepting adults (2019) — https://www.thetrevorproject.org/research-briefs/accepting-adults-reduce-suicide-attempts-among-lgbtq-youth/
- LGBTQ-affirming spaces (2020 data) — https://www.thetrevorproject.org/research-briefs/lgbtq-gender-affirming-spaces/
- Religion & spirituality brief (Dec 2022) — https://www.thetrevorproject.org/research-briefs/religion-and-spirituality-among-lgbtq-youth-dec-2022/
- Conversion therapy prevalence & practitioners — https://www.thetrevorproject.org/blog/new-report-reveals-alarming-prevalence-of-conversion-therapy-with-over-1300-active-practitioners-across-the-u-s/
- Family Acceptance Project — https://familyproject.sfsu.edu/family-rejection-lesbian-gay-and-bisexual-adolescents-negative-health-outcomes
- Pew, out to someone (Oct 2025) — https://www.pewresearch.org/short-reads/2025/10/08/more-than-9-in-10-lgbtq-adults-in-the-us-are-out-to-someone/
- Pew, acceptance & discrimination (May 2025) — https://www.pewresearch.org/social-trends/2025/05/29/personal-experiences-with-acceptance-and-discrimination/
- Pew 2013, coming out chapter — https://www.pewresearch.org/social-trends/2013/06/13/chapter-3-the-coming-out-experience/
- PRRI 2025 American Values Atlas — https://prri.org/research/americans-support-for-key-lgbtq-rights-continues-to-tick-upward/
- Gallup, U.S. Support for LGBTQ+ Issues Remains Down From Peak (May 2026) — https://news.gallup.com/poll/710810/support-lgbtq-issues-remains-down-peak.aspx
- Williams Institute, LGBTQ workplace discrimination and harassment — https://williamsinstitute.law.ucla.edu/publications/lgbt-workplace-discrimination/
- SAGE / National Resource Center on LGBT Aging, Facts on LGBT Aging — https://www.sageusa.org/
- Iowa Senate File 418 (gender identity removed from the Iowa Civil Rights Act, 2025) — https://en.wikipedia.org/wiki/Iowa_Senate_File_418
- HRC 2023 LGBTQ+ Youth Report — https://reports.hrc.org/2023-lgbtq-youth-report
- HRC 2024 Black LGBTQ+ Youth Report — https://www.hrc.org/press-releases/human-rights-campaign-report-releases-new-data-on-experiences-of-black-queer-youth
- HRC 2024 Latine LGBTQ+ Youth Report — https://www.hrc.org/press-releases/out-proud-latine-new-report-finds-that-nearly-90-of-latine-lgbtq-youth-are-proud-of-their-identity-but-many-still-struggle-with-challenges-surrounding-being-queer-or-trans
- HRC Community Insights, outness and visibility (2026) — https://communityinsights.hrc.org/research/ncod26-outness-and-visibility
- HRC coming-out resources — https://www.hrc.org/resources/coming-out
- ELCA 2025 Churchwide Assembly — https://www.elca.org/news/2025-elca-churchwide-assembly-meets-under-the-theme-for-the-life-of-the-world
- ELCA *Gift and Trust* reconsideration — https://www.elca.org/publications/2026-human-sexuality-theological-discernment-current-project
- ReconcilingWorks / RIC — https://www.reconcilingworks.org/
- One Iowa hotlines & support — https://oneiowa.org/resources/hotlines-support/
- Iowa Safe Schools — https://iowasafeschools.org/

A note on the aging figures: SAGE's fact sheet compiles research spanning roughly 2010–2018 (AARP's Maintaining Dignity, Fredriksen-Goldsen's Aging and Health, SAGE's Out & Visible). It is the best accessible compilation, but it is not fresh data, and the page credits SAGE rather than implying a current survey.

A fourth note: the HRC faith figures (religion unfriendly, guilt and shame, outness to a congregation, leader support) come from the **Black and Latine** youth reports specifically, because that is where the questions were asked. Do not restate them as applying to all LGBTQ+ youth; the page names the scope on the figures themselves. The **56%/70%** "political climate made me less open" figures that circulate from HRC's 2026 survey could not be confirmed on HRC's own page — only the 85 / 33 / 22 / 45 / 78 / 65 figures were — so they are left out.

Three notes for whoever writes the copy: the Pew mother/father split and the "one-third report a conflict" figure are from **2013** and must carry that year; the affirming-spaces percentages are from **2020** data; and a "5% named a place of worship as affirming" figure that circulates from the 2025 survey summary could **not** be confirmed in the underlying brief — leave it out.

## Post-event follow-ups (file, don't start now)

- Extract `lambda/shared/` as a Lambda layer; migrate contact-form onto it.
- Move the three secrets to Secrets Manager.
- Fix `lambda/blogger-proxy/index.mjs:38`, which logs the full request event for the public blog proxy.
- Rotate `ForumAdminCode` once Tony has finished reading, and delete the questions deliberately.

## Open item

Tony supplies the member code, admin code, and HMAC secret at deploy time via untracked `lambda/forum-params.env` — deliberately not written into this plan, the repo, or `.env`.
