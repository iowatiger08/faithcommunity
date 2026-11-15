/**
 * Handler tests. The data layer is replaced with an in-memory fake and outside
 * services with spies, so these exercise routing, authorization and the
 * moderation flow without AWS.
 */
import { vi, describe, it, expect, beforeEach } from "vitest";

const db = vi.hoisted(() => ({
  profiles: new Map(),
  comments: new Map(),
  reactions: new Map(),
  reports: new Map(),
  audit: [],
}));

vi.mock("./shared/store.mjs", () => ({
  getProfile: async (sub) => db.profiles.get(sub) ?? null,
  putProfile: async (p) => void db.profiles.set(p.sub, { ...p }),
  deleteProfile: async (sub) => void db.profiles.delete(sub),
  getComment: async (id) => db.comments.get(id) ?? null,
  putComment: async (c) => void db.comments.set(c.commentId, { ...c }),
  deleteComment: async (id) => void db.comments.delete(id),
  updateComment: async (id, fields) => {
    const c = { ...db.comments.get(id) };
    for (const [k, v] of Object.entries(fields)) {
      if (v === null) delete c[k];
      else c[k] = v;
    }
    db.comments.set(id, c);
    return c;
  },
  addReport: async (id) => {
    const c = db.comments.get(id);
    c.reportCount = (c.reportCount ?? 0) + 1;
    return { ...c };
  },
  listPostComments: async (slug) => [...db.comments.values()].filter((c) => c.postSlug === slug),
  listAuthorComments: async (sub, since) =>
    [...db.comments.values()].filter((c) => c.authorSub === sub && (!since || c.createdAt >= since)),
  listHeld: async () => [...db.comments.values()].filter((c) => c.status === "held"),
  putReport: async (commentId, reporterSub) => {
    const key = `${commentId}|${reporterSub}`;
    if (db.reports.has(key)) return false;
    db.reports.set(key, { commentId, reporterSub });
    return true;
  },
  listReportsBy: async (sub) => [...db.reports.values()].filter((r) => r.reporterSub === sub),
  deleteReport: async (commentId, sub) => void db.reports.delete(`${commentId}|${sub}`),
  listPostReactions: async (slug) => [...db.reactions.values()].filter((r) => r.postSlug === slug),
  listUserReactions: async (sub) => [...db.reactions.values()].filter((r) => r.sub === sub),
  putReaction: async (postSlug, sub, kind) =>
    void db.reactions.set(`${postSlug}|${sub}|${kind}`, { postSlug, sub, kind }),
  deleteReaction: async (postSlug, sub, kind) => void db.reactions.delete(`${postSlug}|${sub}|${kind}`),
  audit: async (entry) => void db.audit.push(entry),
}));

const services = vi.hoisted(() => ({
  screen: vi.fn(),
  notifyReview: vi.fn(),
  deleteAccount: vi.fn(),
  postExists: vi.fn(),
}));
vi.mock("./shared/services.mjs", () => services);

import { handler } from "./index.mjs";

const SLUG = "fear-of-talents-matthew-25-proper-28a";

function call(routeKey, { user, params = {}, body } = {}) {
  return handler({
    routeKey,
    pathParameters: params,
    body: body === undefined ? undefined : JSON.stringify(body),
    requestContext: user
      ? {
          authorizer: {
            jwt: {
              claims: {
                sub: user.sub,
                username: user.username ?? user.sub,
                ...(user.admin ? { "cognito:groups": "[admin]" } : {}),
              },
            },
          },
        }
      : {},
  }).then((res) => ({ status: res.statusCode, body: res.body ? JSON.parse(res.body) : null }));
}

const ruth = { sub: "ruth-sub" };
const sam = { sub: "sam-sub" };
const owner = { sub: "owner-sub", admin: true };

function postComment(user, text = "Thank you for this.", extra = {}) {
  return call("POST /posts/{slug}/comments", {
    user,
    params: { slug: SLUG },
    body: { section: "sermons", body: text, ...extra },
  });
}

beforeEach(() => {
  for (const m of [db.profiles, db.comments, db.reactions, db.reports]) m.clear();
  db.audit.length = 0;
  services.screen.mockReset().mockResolvedValue({ flagged: false });
  services.notifyReview.mockReset().mockResolvedValue(undefined);
  services.deleteAccount.mockReset().mockResolvedValue(undefined);
  services.postExists.mockReset().mockResolvedValue(true);
  db.profiles.set(ruth.sub, { sub: ruth.sub, displayName: "Ruth" });
  db.profiles.set(sam.sub, { sub: sam.sub, displayName: "Sam" });
});

describe("routing and auth", () => {
  it("returns 404 for an unknown route", async () => {
    expect((await call("GET /nope")).status).toBe(404);
  });

  it("requires sign-in for writes even if a route is misconfigured", async () => {
    expect((await postComment(null)).status).toBe(401);
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await handler({
      routeKey: "PUT /me",
      body: "{not json",
      requestContext: { authorizer: { jwt: { claims: { sub: ruth.sub } } } },
    });
    expect(res.statusCode).toBe(400);
  });

  it("keeps admin routes to the admin group", async () => {
    expect((await call("GET /admin/held", { user: ruth })).status).toBe(403);
    expect((await call("GET /admin/held", { user: owner })).status).toBe(200);
  });

  it("does not trust an admin claim sent in the body", async () => {
    const res = await call("GET /admin/held", { user: ruth, body: { isAdmin: true } });
    expect(res.status).toBe(403);
  });

  it("accepts the groups claim as a real array too", async () => {
    const res = await handler({
      routeKey: "GET /admin/held",
      requestContext: { authorizer: { jwt: { claims: { sub: "o", "cognito:groups": ["admin"] } } } },
    });
    expect(res.statusCode).toBe(200);
  });
});

describe("posting comments", () => {
  it("posts a clean comment right away", async () => {
    const res = await postComment(ruth);
    expect(res.status).toBe(201);
    expect(res.body.comment).toMatchObject({ displayName: "Ruth", status: "visible", mine: true });
    expect(services.notifyReview).not.toHaveBeenCalled();
    expect(db.audit.at(-1)).toMatchObject({ action: "comment:create", actorSub: ruth.sub });
  });

  it("holds flagged text for review and tells the owner", async () => {
    services.screen.mockResolvedValue({ flagged: true, reason: "INSULT" });
    const res = await postComment(ruth, "something unkind");
    expect(res.status).toBe(201);
    expect(res.body.comment.status).toBe("held");
    expect(services.notifyReview).toHaveBeenCalledWith("screening");
    const stored = [...db.comments.values()][0];
    expect(stored.heldReason).toBe("screening");
  });

  it("validates the body, slug and section", async () => {
    expect((await postComment(ruth, "   ")).status).toBe(400);
    expect((await postComment(ruth, "ok", { section: "forum" })).status).toBe(400);
    const bad = await call("POST /posts/{slug}/comments", {
      user: ruth,
      params: { slug: "../x" },
      body: { section: "sermons", body: "hi" },
    });
    expect(bad.status).toBe(400);
  });

  it("refuses comments on posts that aren't published", async () => {
    services.postExists.mockResolvedValue(false);
    expect((await postComment(ruth)).status).toBe(404);
  });

  it("asks for a display name first", async () => {
    const res = await postComment({ sub: "new-sub" });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("display_name_required");
  });

  it("refuses suspended accounts", async () => {
    db.profiles.get(ruth.sub).suspended = true;
    expect((await postComment(ruth)).status).toBe(403);
  });

  it("rate limits fast posting", async () => {
    for (let i = 0; i < 5; i++) expect((await postComment(ruth, `n${i}`)).status).toBe(201);
    const res = await postComment(ruth, "one more");
    expect(res.status).toBe(429);
  });

  it("allows one level of replies on the same post", async () => {
    const parent = (await postComment(ruth)).body.comment;
    const reply = await postComment(sam, "Agreed.", { parentId: parent.commentId });
    expect(reply.status).toBe(201);
    expect(reply.body.comment.parentId).toBe(parent.commentId);

    const nested = await postComment(ruth, "deeper", { parentId: reply.body.comment.commentId });
    expect(nested.status).toBe(400);
    const missing = await postComment(ruth, "x", { parentId: "nope" });
    expect(missing.status).toBe(400);
  });
});

describe("reading a post", () => {
  it("shows visible comments and reaction counts to everyone", async () => {
    await postComment(ruth, "visible one");
    services.screen.mockResolvedValue({ flagged: true, reason: "INSULT" });
    await postComment(sam, "held one");
    db.reactions.set("x", { postSlug: SLUG, sub: sam.sub, kind: "pray" });

    const res = await call("GET /posts/{slug}", { params: { slug: SLUG } });
    expect(res.status).toBe(200);
    expect(res.body.comments.map((c) => c.body)).toEqual(["visible one"]);
    expect(res.body.reactions.counts.pray).toBe(1);
    expect(res.body.reactions.mine).toEqual([]);
  });

  it("shows a signed-in author their own held comment", async () => {
    services.screen.mockResolvedValue({ flagged: true, reason: "INSULT" });
    await postComment(sam, "held one");
    const mine = await call("GET /posts/{slug}/mine", { user: sam, params: { slug: SLUG } });
    expect(mine.body.comments).toHaveLength(1);
    expect(mine.body.comments[0]).toMatchObject({ status: "held", mine: true });
    const other = await call("GET /posts/{slug}/mine", { user: ruth, params: { slug: SLUG } });
    expect(other.body.comments).toHaveLength(0);
  });

  it("sorts comments oldest first", async () => {
    await postComment(ruth, "first");
    await postComment(sam, "second");
    const [a, b] = [...db.comments.values()];
    a.createdAt = "2026-11-15T10:00:00Z";
    b.createdAt = "2026-11-15T09:00:00Z";
    const res = await call("GET /posts/{slug}", { params: { slug: SLUG } });
    expect(res.body.comments.map((c) => c.body)).toEqual(["second", "first"]);
  });

  it("rejects a bad slug", async () => {
    expect((await call("GET /posts/{slug}", { params: { slug: "A B" } })).status).toBe(400);
  });
});

describe("editing and deleting", () => {
  it("lets the author edit, screening the new text", async () => {
    const { commentId } = (await postComment(ruth)).body.comment;
    services.screen.mockResolvedValue({ flagged: true, reason: "INSULT" });
    const res = await call("PATCH /comments/{id}", {
      user: ruth,
      params: { id: commentId },
      body: { body: "edited" },
    });
    expect(res.status).toBe(200);
    expect(res.body.comment).toMatchObject({ body: "edited", status: "held" });
    expect(res.body.comment.editedAt).toBeTruthy();
  });

  it("clears an old screening hold when the edit is clean", async () => {
    services.screen.mockResolvedValueOnce({ flagged: true, reason: "INSULT" });
    const { commentId } = (await postComment(ruth, "rough")).body.comment;
    const res = await call("PATCH /comments/{id}", {
      user: ruth,
      params: { id: commentId },
      body: { body: "kinder" },
    });
    expect(res.body.comment.status).toBe("visible");
    expect(db.comments.get(commentId).heldReason).toBeUndefined();
  });

  it("keeps a moderator or report hold in place through an edit", async () => {
    const { commentId } = (await postComment(ruth)).body.comment;
    db.comments.get(commentId).status = "held";
    db.comments.get(commentId).heldReason = "reports";
    const res = await call("PATCH /comments/{id}", {
      user: ruth,
      params: { id: commentId },
      body: { body: "edited" },
    });
    expect(res.body.comment.status).toBe("held");
  });

  it("does not let someone else edit or delete", async () => {
    const { commentId } = (await postComment(ruth)).body.comment;
    const opts = { user: sam, params: { id: commentId }, body: { body: "mine now" } };
    expect((await call("PATCH /comments/{id}", opts)).status).toBe(403);
    expect((await call("DELETE /comments/{id}", opts)).status).toBe(403);
  });

  it("returns 404 for a missing or removed comment and 400 for a bad body", async () => {
    expect((await call("DELETE /comments/{id}", { user: ruth, params: { id: "x" } })).status).toBe(404);
    const { commentId } = (await postComment(ruth)).body.comment;
    const bad = await call("PATCH /comments/{id}", { user: ruth, params: { id: commentId }, body: { body: "" } });
    expect(bad.status).toBe(400);
    db.comments.get(commentId).status = "removed";
    const gone = await call("PATCH /comments/{id}", { user: ruth, params: { id: commentId }, body: { body: "x" } });
    expect(gone.status).toBe(404);
  });

  it("deletes the author's own comment for good", async () => {
    const { commentId } = (await postComment(ruth)).body.comment;
    const res = await call("DELETE /comments/{id}", { user: ruth, params: { id: commentId } });
    expect(res.status).toBe(200);
    expect(db.comments.has(commentId)).toBe(false);
  });
});

describe("reactions", () => {
  const react = (user, kind, method = "PUT") =>
    call(`${method} /posts/{slug}/reactions/{kind}`, {
      user,
      params: { slug: SLUG, kind },
      body: method === "PUT" ? { section: "sermons" } : undefined,
    });

  it("adds and removes one reaction per kind per person", async () => {
    await react(ruth, "pray");
    const again = await react(ruth, "pray");
    expect(again.body.reactions.counts.pray).toBe(1);
    expect(again.body.reactions.mine).toEqual(["pray"]);
    const removed = await react(ruth, "pray", "DELETE");
    expect(removed.body.reactions.counts.pray).toBe(0);
  });

  it("rejects unknown kinds, unpublished posts and suspended accounts", async () => {
    expect((await react(ruth, "thumbsDown")).status).toBe(400);
    services.postExists.mockResolvedValueOnce(false);
    expect((await react(ruth, "pray")).status).toBe(404);
    db.profiles.get(ruth.sub).suspended = true;
    expect((await react(ruth, "pray")).status).toBe(403);
  });

  it("lets someone without a display name react", async () => {
    expect((await react({ sub: "new-sub" }, "heart")).status).toBe(200);
  });
});

describe("reports", () => {
  const report = (user, id) => call("POST /comments/{id}/report", { user, params: { id } });

  it("counts one report per person and auto-holds at three", async () => {
    const { commentId } = (await postComment(ruth)).body.comment;
    expect((await report(sam, commentId)).body).toEqual({ ok: true });
    await report(sam, commentId);
    expect(db.comments.get(commentId).reportCount).toBe(1);

    db.profiles.set("a", { sub: "a" });
    db.profiles.set("b", { sub: "b" });
    await report({ sub: "a" }, commentId);
    expect(services.notifyReview).not.toHaveBeenCalled();
    await report({ sub: "b" }, commentId);
    expect(db.comments.get(commentId)).toMatchObject({ status: "held", heldReason: "reports" });
    expect(services.notifyReview).toHaveBeenCalledWith("reports");
  });

  it("ignores reports on your own or missing comments", async () => {
    const { commentId } = (await postComment(ruth)).body.comment;
    expect((await report(ruth, commentId)).status).toBe(400);
    expect((await report(sam, "nope")).status).toBe(404);
  });

  it("refuses reports from suspended accounts", async () => {
    const { commentId } = (await postComment(ruth)).body.comment;
    db.profiles.get(sam.sub).suspended = true;
    expect((await report(sam, commentId)).status).toBe(403);
  });
});

describe("account", () => {
  it("reads the profile and the user's comments", async () => {
    await postComment(ruth);
    const res = await call("GET /me", { user: ruth });
    expect(res.body.displayName).toBe("Ruth");
    expect(res.body.comments).toHaveLength(1);
    expect(res.body.comments[0]).toMatchObject({ postSlug: SLUG, section: "sermons" });
    const fresh = await call("GET /me", { user: { sub: "new-sub" } });
    expect(fresh.body).toEqual({ displayName: null, suspended: false, comments: [] });
  });

  it("sets a display name and updates it on past comments", async () => {
    await postComment(ruth);
    const res = await call("PUT /me", { user: ruth, body: { displayName: "Ruth B" } });
    expect(res.status).toBe(200);
    expect([...db.comments.values()][0].displayName).toBe("Ruth B");
  });

  it("creates a profile for a new user", async () => {
    const res = await call("PUT /me", { user: { sub: "new-sub" }, body: { displayName: "Naomi" } });
    expect(res.status).toBe(200);
    expect(db.profiles.get("new-sub")).toMatchObject({ displayName: "Naomi", suspended: false });
  });

  it("rejects names that are invalid or flagged", async () => {
    expect((await call("PUT /me", { user: ruth, body: { displayName: "x" } })).status).toBe(400);
    services.screen.mockResolvedValue({ flagged: true, reason: "PROFANITY" });
    const res = await call("PUT /me", { user: ruth, body: { displayName: "Rude Name" } });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("name_not_allowed");
  });

  it("deletes everything the account owns, then the account", async () => {
    const { commentId } = (await postComment(ruth)).body.comment;
    const samComment = (await postComment(sam)).body.comment.commentId;
    db.reactions.set(`${SLUG}|${ruth.sub}|pray`, { postSlug: SLUG, sub: ruth.sub, kind: "pray" });
    await call("POST /comments/{id}/report", { user: ruth, params: { id: samComment } });

    const res = await call("DELETE /me", { user: { ...ruth, username: "ruth@example.com" } });
    expect(res.status).toBe(200);
    expect(db.comments.has(commentId)).toBe(false);
    expect(db.comments.has(samComment)).toBe(true);
    expect([...db.reactions.values()].some((r) => r.sub === ruth.sub)).toBe(false);
    expect([...db.reports.values()].some((r) => r.reporterSub === ruth.sub)).toBe(false);
    expect(db.profiles.has(ruth.sub)).toBe(false);
    expect(services.deleteAccount).toHaveBeenCalledWith("ruth@example.com");
  });
});

describe("moderation", () => {
  it("lists held comments with the details needed to review them", async () => {
    services.screen.mockResolvedValue({ flagged: true, reason: "INSULT" });
    await postComment(ruth, "held");
    const res = await call("GET /admin/held", { user: owner });
    expect(res.body.comments[0]).toMatchObject({
      body: "held",
      authorSub: ruth.sub,
      postSlug: SLUG,
      heldReason: "screening",
    });
  });

  it("holds, restores and removes a comment, with an audit entry each time", async () => {
    const { commentId } = (await postComment(ruth)).body.comment;
    const act = (action) =>
      call("PUT /admin/comments/{id}", { user: owner, params: { id: commentId }, body: { action } });

    expect((await act("hold")).body.comment).toMatchObject({ status: "held", heldReason: "moderator" });
    expect((await act("restore")).body.comment.status).toBe("visible");
    expect(db.comments.get(commentId).heldReason).toBeUndefined();
    expect((await act("remove")).body.comment.status).toBe("removed");
    expect(db.audit.filter((a) => a.action.startsWith("admin:")).length).toBe(3);
    expect((await act("explode")).status).toBe(400);
  });

  it("returns 404 when moderating a missing comment", async () => {
    const res = await call("PUT /admin/comments/{id}", {
      user: owner,
      params: { id: "nope" },
      body: { action: "hold" },
    });
    expect(res.status).toBe(404);
  });

  it("suspends and unsuspends an account", async () => {
    const res = await call("PUT /admin/users/{sub}", {
      user: owner,
      params: { sub: ruth.sub },
      body: { suspended: true },
    });
    expect(res.status).toBe(200);
    expect(db.profiles.get(ruth.sub).suspended).toBe(true);
    await call("PUT /admin/users/{sub}", { user: owner, params: { sub: ruth.sub }, body: { suspended: false } });
    expect(db.profiles.get(ruth.sub).suspended).toBe(false);
    const bad = await call("PUT /admin/users/{sub}", { user: owner, params: { sub: ruth.sub }, body: {} });
    expect(bad.status).toBe(400);
  });

  it("can suspend someone who never set a profile", async () => {
    await call("PUT /admin/users/{sub}", { user: owner, params: { sub: "ghost" }, body: { suspended: true } });
    expect(db.profiles.get("ghost")).toMatchObject({ suspended: true, displayName: null });
  });
});

describe("unexpected failures", () => {
  it("returns 500 without leaking the error", async () => {
    services.postExists.mockRejectedValue(new Error("boom secret"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await postComment(ruth);
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain("secret");
    spy.mockRestore();
  });
});
