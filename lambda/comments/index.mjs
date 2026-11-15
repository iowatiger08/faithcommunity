// Comments and reactions API. One function behind an HTTP API; routes are
// matched on event.routeKey. Sign-in is enforced twice: by the API's JWT
// authorizer on every non-public route, and again here from the verified
// claims, so a misconfigured route can't open a write path.
import { randomUUID } from "node:crypto";
import * as store from "./shared/store.mjs";
import { screen, notifyReview, deleteAccount, postExists } from "./shared/services.mjs";
import {
  normalizeBody,
  normalizeDisplayName,
  isValidSlug,
  isValidSection,
  isReactionKind,
  rateLimit,
  initialStatus,
  shouldAutoHold,
  canModify,
  projectComment,
  tallyReactions,
} from "./shared/rules.mjs";

class HttpError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
  }
}

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

/** The caller, from claims the API authorizer already verified. Never from the body. */
function userFrom(event) {
  const claims = event.requestContext?.authorizer?.jwt?.claims;
  if (!claims?.sub) return null;
  return { sub: claims.sub, username: claims.username ?? claims["cognito:username"] ?? claims.sub };
}

function requireUser(event) {
  const user = userFrom(event);
  if (!user) throw new HttpError(401, "unauthorized");
  return user;
}

// Admin routes sit behind the owner's sign-in pool, and only the owner's
// account passes, so a valid token from that shared pool is not enough.
function requireAdmin(event) {
  const user = requireUser(event);
  if (!process.env.OWNER_SUB || user.sub !== process.env.OWNER_SUB) throw new HttpError(403, "forbidden");
  return user;
}

function parseBody(event) {
  try {
    return JSON.parse(event.body ?? "{}");
  } catch {
    throw new HttpError(400, "invalid_json");
  }
}

function slugParam(event) {
  const slug = event.pathParameters?.slug;
  if (!isValidSlug(slug)) throw new HttpError(400, "invalid_post");
  return slug;
}

async function requirePublished(section, slug) {
  if (!isValidSection(section)) throw new HttpError(400, "invalid_post");
  if (!(await postExists(section, slug))) throw new HttpError(404, "post_not_found");
}

async function requireActive(user) {
  const profile = await store.getProfile(user.sub);
  if (profile?.suspended) throw new HttpError(403, "suspended");
  return profile;
}

async function requireComment(id) {
  const comment = await store.getComment(id);
  if (!comment || comment.status === "removed") throw new HttpError(404, "comment_not_found");
  return comment;
}

const byCreated = (a, b) => a.createdAt.localeCompare(b.createdAt);

async function readPost(slug, viewer) {
  const [comments, reactions] = await Promise.all([
    store.listPostComments(slug),
    store.listPostReactions(slug),
  ]);
  return {
    comments: comments
      .sort(byCreated)
      .map((c) => projectComment(c, viewer))
      .filter(Boolean),
    reactions: tallyReactions(reactions, viewer?.sub),
  };
}

// ── Handlers ────────────────────────────────────────────────────────────────

async function createComment(event) {
  const user = requireUser(event);
  const slug = slugParam(event);
  const input = parseBody(event);
  const body = normalizeBody(input.body);
  if (!body) throw new HttpError(400, "invalid_body");
  await requirePublished(input.section, slug);

  const profile = await requireActive(user);
  if (!profile?.displayName) throw new HttpError(409, "display_name_required");

  const since = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
  const recent = await store.listAuthorComments(user.sub, since);
  if (!rateLimit(recent.map((c) => c.createdAt)).ok) throw new HttpError(429, "slow_down");

  let parentId;
  if (input.parentId) {
    const parent = await store.getComment(input.parentId);
    // One level of replies: a reply attaches to a top-level comment on this post.
    if (!parent || parent.postSlug !== slug || parent.parentId) throw new HttpError(400, "invalid_parent");
    parentId = parent.commentId;
  }

  const { status, heldReason } = initialStatus(await screen(body), body);
  const comment = {
    commentId: randomUUID(),
    postSlug: slug,
    section: input.section,
    ...(parentId ? { parentId } : {}),
    authorSub: user.sub,
    displayName: profile.displayName,
    body,
    status,
    ...(heldReason ? { heldReason } : {}),
    reportCount: 0,
    createdAt: new Date().toISOString(),
  };
  await store.putComment(comment);
  await store.audit({ action: "comment:create", actorSub: user.sub, target: comment.commentId });
  if (status === "held") await notifyReview(heldReason);
  return json(201, { comment: projectComment(comment, user) });
}

async function editComment(event) {
  const user = requireUser(event);
  const comment = await requireComment(event.pathParameters?.id);
  if (!canModify(comment, user)) throw new HttpError(403, "forbidden");
  const body = normalizeBody(parseBody(event).body);
  if (!body) throw new HttpError(400, "invalid_body");

  const next = initialStatus(await screen(body), body);
  // A hold placed by reports or a moderator stays until a moderator lifts it.
  // Only a hold from automatic screening is re-decided by the new text.
  const keepHold = comment.status === "held" && !["screening", "links"].includes(comment.heldReason);
  const fields = keepHold
    ? { body, editedAt: new Date().toISOString() }
    : { body, editedAt: new Date().toISOString(), status: next.status, heldReason: next.heldReason ?? null };
  const updated = await store.updateComment(comment.commentId, fields);
  await store.audit({ action: "comment:edit", actorSub: user.sub, target: comment.commentId });
  if (!keepHold && next.status === "held") await notifyReview(next.heldReason);
  return json(200, { comment: projectComment(updated, user) });
}

async function removeOwnComment(event) {
  const user = requireUser(event);
  const comment = await requireComment(event.pathParameters?.id);
  if (!canModify(comment, user)) throw new HttpError(403, "forbidden");
  await store.deleteComment(comment.commentId);
  await store.audit({ action: "comment:delete", actorSub: user.sub, target: comment.commentId });
  return json(200, { ok: true });
}

async function react(event, add) {
  const user = requireUser(event);
  const slug = slugParam(event);
  const kind = event.pathParameters?.kind;
  if (!isReactionKind(kind)) throw new HttpError(400, "invalid_reaction");
  await requireActive(user);
  if (add) {
    await requirePublished(parseBody(event).section, slug);
    await store.putReaction(slug, user.sub, kind);
  } else {
    await store.deleteReaction(slug, user.sub, kind);
  }
  return json(200, { reactions: tallyReactions(await store.listPostReactions(slug), user.sub) });
}

async function report(event) {
  const user = requireUser(event);
  const comment = await requireComment(event.pathParameters?.id);
  if (comment.authorSub === user.sub) throw new HttpError(400, "own_comment");
  await requireActive(user);
  if (await store.putReport(comment.commentId, user.sub)) {
    const updated = await store.addReport(comment.commentId);
    await store.audit({ action: "comment:report", actorSub: user.sub, target: comment.commentId });
    if (shouldAutoHold(updated)) {
      await store.updateComment(comment.commentId, { status: "held", heldReason: "reports" });
      await notifyReview("reports");
    }
  }
  // Same answer for a repeat report, so reporting can't be used to probe counts.
  return json(200, { ok: true });
}

async function getMe(event) {
  const user = requireUser(event);
  const [profile, comments] = await Promise.all([
    store.getProfile(user.sub),
    store.listAuthorComments(user.sub),
  ]);
  return json(200, {
    displayName: profile?.displayName ?? null,
    suspended: Boolean(profile?.suspended),
    comments: comments
      .sort(byCreated)
      .map((c) => ({ ...projectComment(c, user), postSlug: c.postSlug, section: c.section }))
      .filter((c) => c.commentId),
  });
}

async function putMe(event) {
  const user = requireUser(event);
  const displayName = normalizeDisplayName(parseBody(event).displayName);
  if (!displayName) throw new HttpError(400, "invalid_name");
  if ((await screen(displayName)).flagged) throw new HttpError(400, "name_not_allowed");

  const existing = await store.getProfile(user.sub);
  await store.putProfile({
    sub: user.sub,
    createdAt: new Date().toISOString(),
    suspended: false,
    ...existing,
    displayName,
  });
  // Names are copied onto comments so a post page reads one table; keep them in step.
  for (const c of await store.listAuthorComments(user.sub)) {
    await store.updateComment(c.commentId, { displayName });
  }
  await store.audit({ action: "profile:name", actorSub: user.sub, target: user.sub });
  return json(200, { displayName });
}

async function deleteMe(event) {
  const user = requireUser(event);
  for (const c of await store.listAuthorComments(user.sub)) await store.deleteComment(c.commentId);
  for (const r of await store.listUserReactions(user.sub)) {
    await store.deleteReaction(r.postSlug, user.sub, r.kind);
  }
  for (const r of await store.listReportsBy(user.sub)) await store.deleteReport(r.commentId, user.sub);
  await store.deleteProfile(user.sub);
  await store.audit({ action: "account:delete", actorSub: user.sub, target: user.sub });
  await deleteAccount(user.username);
  return json(200, { ok: true });
}

async function listHeld(event) {
  requireAdmin(event);
  const held = (await store.listHeld()).sort(byCreated);
  return json(200, {
    comments: held.map((c) => ({
      commentId: c.commentId,
      postSlug: c.postSlug,
      section: c.section,
      authorSub: c.authorSub,
      displayName: c.displayName,
      body: c.body,
      heldReason: c.heldReason ?? null,
      reportCount: c.reportCount ?? 0,
      createdAt: c.createdAt,
    })),
  });
}

const MODERATION = {
  hold: { status: "held", heldReason: "moderator" },
  restore: { status: "visible", heldReason: null },
  remove: { status: "removed" },
};

async function moderateComment(event) {
  const admin = requireAdmin(event);
  const { action } = parseBody(event);
  if (!Object.hasOwn(MODERATION, action)) throw new HttpError(400, "invalid_action");
  const comment = await store.getComment(event.pathParameters?.id);
  if (!comment) throw new HttpError(404, "comment_not_found");
  const updated = await store.updateComment(comment.commentId, MODERATION[action]);
  await store.audit({ action: `admin:${action}`, actorSub: admin.sub, target: comment.commentId });
  return json(200, {
    comment: { commentId: updated.commentId, status: updated.status, heldReason: updated.heldReason ?? null },
  });
}

async function setSuspended(event) {
  const admin = requireAdmin(event);
  const { suspended } = parseBody(event);
  if (typeof suspended !== "boolean") throw new HttpError(400, "invalid_body");
  const sub = event.pathParameters?.sub;
  const existing = await store.getProfile(sub);
  await store.putProfile({
    sub,
    displayName: null,
    createdAt: new Date().toISOString(),
    ...existing,
    suspended,
    suspendedAt: suspended ? new Date().toISOString() : null,
  });
  await store.audit({ action: suspended ? "admin:suspend" : "admin:unsuspend", actorSub: admin.sub, target: sub });
  return json(200, { ok: true });
}

const ROUTES = {
  "GET /posts/{slug}": async (e) => json(200, await readPost(slugParam(e), null)),
  "GET /posts/{slug}/mine": async (e) => json(200, await readPost(slugParam(e), requireUser(e))),
  "POST /posts/{slug}/comments": createComment,
  "PATCH /comments/{id}": editComment,
  "DELETE /comments/{id}": removeOwnComment,
  "PUT /posts/{slug}/reactions/{kind}": (e) => react(e, true),
  "DELETE /posts/{slug}/reactions/{kind}": (e) => react(e, false),
  "POST /comments/{id}/report": report,
  "GET /me": getMe,
  "PUT /me": putMe,
  "DELETE /me": deleteMe,
  "GET /admin/held": listHeld,
  "PUT /admin/comments/{id}": moderateComment,
  "PUT /admin/users/{sub}": setSuspended,
};

export const handler = async (event) => {
  const route = ROUTES[event.routeKey];
  if (!route) return json(404, { error: "not_found" });
  try {
    return await route(event);
  } catch (err) {
    if (err instanceof HttpError) return json(err.status, { error: err.message });
    console.error(`${event.routeKey} failed:`, err);
    return json(500, { error: "server_error" });
  }
};
