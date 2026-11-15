# Plan: comments and reactions on posts

## Context

Each post page (sermons, worship resources, reflections) should get a comments and reactions section, much like Blogger or Facebook. Today the site has no accounts. It collects only contact-form messages, and the privacy notice says there are "no accounts to create" and that what people send is "never published". Comments mean collecting an email address (Google sign-in optional), showing a public display name, and publishing what people write. The privacy notice and terms have to change before the feature goes live.

The guardrails follow the neighborhood app (`~/projects/tigersndragons/infrastructure/neighborhood/functions/`): Comprehend screening, moderator hold and restore, flagged-content queue, suspension, audit log and an explicit deletion path. Two changes from it, both based on lessons from the earlier forum intake:
- Flagged text is **held for review, not rejected**.
- **No TTL or automatic expiry.** Nothing is removed until a person deletes it (see the no-auto-delete memory).

Decisions you made:
- A **new Cognito pool** just for this site.
- Comments **post right away; flagged ones are held**.
- Reactions require **sign-in**.
- Commenters appear under a **chosen display name**, and email is never shown.

## Approach

### 1. Auth: new Cognito pool (in `lambda/template.yaml`)
- `HopeAndTruthCommentersPool`. The username is the email address. Sign-in is **email one-time code** (passwordless, Essentials tier, no passwords to store or reset). Cognito sends its email through the SES identity that already exists for the domain (`SesEmailIdentity`).
- Managed login on a custom domain, `auth.hopeandtruthministry.com`. This needs an ACM certificate in us-east-1 and a Route 53 alias in the existing hosted zone parameter. A public SPA client with PKCE, with callback `/auth/callback/` on the apex and www domains, plus localhost for dev.
- **Phase 2: Google.** Add a Google identity provider to the same pool. You create the OAuth client in Google Cloud Console, and the client secret goes in as a `NoEcho` stack parameter. No code changes in the site beyond the button.
- A Cognito group `admin`, with your account as its only member. Every admin Lambda checks the group claim server-side.
- Front end: `react-oidc-context` plus `oidc-client-ts`, the same pattern as webtop's hosted UI. Sign-in loads only on the client, so SSG output stays static.

### 2. Data (DynamoDB, on-demand, PITR on, **no TTL attribute**)
- `Profiles`: PK `sub` → `displayName`, `createdAt`, `suspended`, `suspendedAt`.
- `Comments`: PK `postSlug`, SK `createdAt#commentId`.
  - Fields: `commentId`, `parentId` (one level of replies), `authorSub`, `displayName` (denormalized), `body`, `status` (`visible` | `held` | `removed`), `heldReason` (`screening` | `reports` | `moderator`), `reportCount`, `editedAt`.
  - GSI `byAuthor` (`authorSub`) for "my comments" and account deletion. GSI `byStatus` (`status`, `createdAt`) for the held queue.
- `Reactions`: PK `postSlug`, SK `sub#kind`. Counts come from a Query per post, which is fine at this volume. Kinds are a fixed allow-list: `pray`, `heart`, `amen`, `thanks`, finalized before the build.
- `Reports`: PK `commentId`, SK `reporterSub`, so each person can report a comment only once.
- `Audit`: PK `day`, SK `ts#id` → `action`, `actorSub`, `target`. Same shape as the neighborhood `audit()`.
- **No IP address is stored anywhere**, which keeps the current privacy promise. Rate limits key on `sub`.

### 3. API: new HTTP API with a Cognito JWT authorizer
Handlers go in `lambda/comments/` as `.mjs` files, matching `lambda/contact-form` and `lambda/blogger-proxy`. Pure decision logic goes in `lambda/comments/shared/` so it can be unit tested.

| Route | Auth | Does |
|---|---|---|
| `GET /posts/{slug}/comments` | none | Visible comments, plus your own held ones if a token is sent |
| `GET /posts/{slug}/reactions` | none | Counts, plus your own reactions if signed in |
| `POST /posts/{slug}/comments` | user | Create. Checks length ≤ 2000, plain text only, slug exists in published content, not suspended, rate limit (5 per 10 minutes, 30 per day), then screening |
| `PATCH /comments/{id}` / `DELETE /comments/{id}` | author | Edit (screened again) or hard delete your own comment |
| `PUT` / `DELETE /posts/{slug}/reactions/{kind}` | user | Add or remove one reaction |
| `POST /comments/{id}/report` | user | One report per person. At 3 reports the comment is auto-held and you're emailed |
| `GET/PUT /me` | user | Read or set display name (screened, 2–40 characters, unique not required) |
| `DELETE /me` | user | **Explicit self-serve account deletion**: their comments, reactions, reports and profile, then `AdminDeleteUser` |
| `GET /admin/held`, `PUT /admin/comments/{id}` (hold, restore, remove), `PUT /admin/users/{sub}` (suspend, unsuspend) | admin group | Moderation. Each action writes to `Audit` |

Screening means porting `shared/moderation.mjs` (`checkContent`, Comprehend `DetectToxicContent`) and changing the outcome. A flagged comment is saved with `status: held` and shown only to its author, marked "awaiting review". It still fails open on a Comprehend outage, as the neighborhood version does. Held and reported comments trigger an SES email to you, sending the link only, never the comment text.

### 4. Front end
- `src/components/comments/` holds `Comments.tsx` (list, reply, report, edit, delete), `Reactions.tsx` and `CommentForm.tsx`. They're mounted at the bottom of `src/pages/SermonDetail.tsx`, which serves all three sections. They load on the client only, after hydration, so the pre-rendered HTML doesn't change. Comment bodies render as plain text, never through `dangerouslySetInnerHTML`.
- `src/lib/auth.ts` holds the OIDC provider config. `src/lib/commentsApi.ts` holds a typed fetch wrapper.
- New routes in `src/main.tsx`:
  - `/auth/callback/` (noindex)
  - `/account/` for display name, "my comments" and delete account (noindex)
  - `/moderation/` for the held queue and suspend controls, admin group only (noindex)
- The first time someone comments they're asked for a display name, with the community guidelines shown above the form.
- UI copy is plain and never names Cognito, AWS, Comprehend or other infrastructure. A held comment reads "Your comment is awaiting review."

### 5. Privacy notice and terms (`src/pages/Privacy.tsx`, `src/pages/Terms.tsx`)
Both pages get "Last updated: November 2026". Wording stays plain and neutral, and I'll show you the drafts before deploying.
- **Privacy, What is collected:** add "Comments and reactions" covering:
  - email address, used to sign in and nothing else, no mailing list
  - display name
  - Google basic profile (email and name) if Google is used
  - comments and reactions, stored with the account
- **Privacy:** rewrite the lines that are no longer true: "no accounts to create" and "never published". Make clear that comments are **public under the display name** and that contact messages stay private.
- **Privacy, Who can see it:** comments are public; email is never shown. Explain that comments are screened automatically for abusive content by a service running in the same cloud provider, plus moderator review.
- **Privacy, How long it is kept:** until deleted. Users can delete any comment or the whole account themselves at `/account`. Nothing expires automatically.
- **Privacy:** add an age line: accounts are for people 13 and older.
- **Terms:** a new "Comments" section covering:
  - community guidelines: no harassment, threats, hate, explicit content, spam or outing other people
  - you keep copyright in what you write and grant the ministry permission to display it here
  - the existing no-AI-training restriction applies
  - comments can be held or removed, and accounts suspended

### 6. Tests (red-green-refactor, TDD memory)
- Vitest for the Lambda decision logic, modeled on the neighborhood `*.test.mjs` files:
  - rate limit math
  - screening produces `held` rather than rejection
  - report threshold
  - author and admin authorization (claims from the authorizer only, never from the body)
  - deletion scope
- Component tests next to the existing `SermonDetail.test.tsx` and `Privacy.test.tsx`:
  - the page renders with comments disabled during SSG
  - a held comment is visible only to its author
  - no `innerHTML` rendering
- `npm test`, `npm run lint` and `npm run typecheck` all pass.

### 7. Rollout
1. Save this plan to `docs/comments-plan.md`, on a new branch `feat/comments` (per the plans-to-docs memory).
2. Deploy the stack (pool, tables, API) with the UI behind `VITE_ENABLE_COMMENTS`, off in production.
3. Update the privacy notice and terms, and get your approval on the wording.
4. Turn the flag on and deploy the site.
5. Phase 2: Google sign-in.

## Critical files
- `lambda/template.yaml` gets the pool, domain, tables, HTTP API and functions. `lambda/deploy.sh` and `samconfig.toml` stay as they are.
- New code in `lambda/comments/*.mjs` and `lambda/comments/shared/{moderation,limits,authz}.mjs`.
- `src/pages/SermonDetail.tsx`, `src/main.tsx`, new `src/components/comments/*`, `src/lib/auth.ts`, `src/lib/commentsApi.ts`, new pages `Account.tsx`, `Moderation.tsx` and `AuthCallback.tsx`.
- `src/pages/Privacy.tsx`, `src/pages/Terms.tsx`.
- Code to reuse from the neighborhood app: `shared/moderation.mjs` (`checkContent`), the `audit()`, `parseUser` and `errorResponse` helpers in `shared/utils.mjs`, the `messages/hold.mjs` hold and restore flow, and `messages/react.mjs` (an allow-listed reaction kind validated server-side).

## Verification
- Unit and component tests as in section 6.
- `sam deploy` to the stack, then from dev (`npm run dev` with the flag on):
  1. sign in with an email code
  2. set a display name
  3. post a comment
  4. react, then un-react
  5. reply
  6. edit, then delete
  7. post a deliberately abusive test comment: it shows as held to the author only, and you get the email
  8. report a comment from 3 test accounts: it's auto-held
  9. restore it from `/moderation/`
  10. suspend a test account: posting returns an error
  11. delete a test account from `/account/`: its rows and the Cognito user are gone
- Check that a non-admin token gets 403 on every `/admin/*` route, and that a token from the neighborhood pool is rejected by the authorizer.
- `npm run build`: the pre-rendered sermon HTML has no comment markup and no auth code in the critical path.
- After deploy, load a live sermon page. Comments and reactions load, and the Privacy and Terms pages show the new sections.
