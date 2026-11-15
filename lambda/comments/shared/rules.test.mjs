import { describe, it, expect } from "vitest";
import {
  normalizeBody,
  normalizeDisplayName,
  isValidSlug,
  isValidSection,
  isReactionKind,
  rateLimit,
  countLinks,
  initialStatus,
  shouldAutoHold,
  canModify,
  projectComment,
  tallyReactions,
} from "./rules.mjs";

describe("normalizeBody", () => {
  it("trims and keeps ordinary text", () => {
    expect(normalizeBody("  Amen to this.  ")).toBe("Amen to this.");
  });

  it("rejects empty, non-string and over-long input", () => {
    expect(normalizeBody("   ")).toBeNull();
    expect(normalizeBody(undefined)).toBeNull();
    expect(normalizeBody(42)).toBeNull();
    expect(normalizeBody("a".repeat(2001))).toBeNull();
    expect(normalizeBody("a".repeat(2000))).toHaveLength(2000);
  });

  it("drops control characters and collapses runs of blank lines", () => {
    expect(normalizeBody("one\r\n\n\n\n\ntwo\u0000")).toBe("one\n\ntwo");
  });
});

describe("normalizeDisplayName", () => {
  it("accepts 2–40 characters and squeezes spaces", () => {
    expect(normalizeDisplayName("  Ruth   B ")).toBe("Ruth B");
    expect(normalizeDisplayName("Jo")).toBe("Jo");
  });

  it("rejects too short, too long, emails and links", () => {
    expect(normalizeDisplayName("J")).toBeNull();
    expect(normalizeDisplayName("x".repeat(41))).toBeNull();
    expect(normalizeDisplayName("me@example.com")).toBeNull();
    expect(normalizeDisplayName("visit www.spam.com")).toBeNull();
    expect(normalizeDisplayName("https://x.y")).toBeNull();
    expect(normalizeDisplayName(null)).toBeNull();
  });
});

describe("slug, section and reaction checks", () => {
  it("accepts post slugs and rejects anything path-like", () => {
    expect(isValidSlug("fear-of-talents-matthew-25-proper-28a")).toBe(true);
    expect(isValidSlug("../etc")).toBe(false);
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("a".repeat(201))).toBe(false);
    expect(isValidSlug(undefined)).toBe(false);
  });

  it("knows the three post sections", () => {
    expect(isValidSection("sermons")).toBe(true);
    expect(isValidSection("worship-resources")).toBe(true);
    expect(isValidSection("reflections")).toBe(true);
    expect(isValidSection("forum")).toBe(false);
  });

  it("allows only the fixed reaction kinds", () => {
    expect(isReactionKind("pray")).toBe(true);
    expect(isReactionKind("thumbsDown")).toBe(false);
  });
});

describe("rateLimit", () => {
  const now = Date.parse("2026-11-15T12:00:00Z");
  const minsAgo = (m) => new Date(now - m * 60_000).toISOString();

  it("allows a user under both limits", () => {
    expect(rateLimit([minsAgo(1), minsAgo(30)], now)).toEqual({ ok: true });
  });

  it("blocks the sixth comment inside ten minutes", () => {
    const recent = [1, 2, 3, 4, 5].map(minsAgo);
    expect(rateLimit(recent, now)).toEqual({ ok: false, window: "short" });
  });

  it("blocks the thirty-first comment inside a day", () => {
    const day = Array.from({ length: 30 }, (_, i) => minsAgo(20 + i * 30));
    expect(rateLimit(day, now)).toEqual({ ok: false, window: "day" });
  });

  it("ignores comments older than a day", () => {
    const old = Array.from({ length: 40 }, () => minsAgo(60 * 25));
    expect(rateLimit(old, now)).toEqual({ ok: true });
  });
});

describe("countLinks", () => {
  it("counts schemes and www prefixes but not the site's own domain", () => {
    expect(countLinks("see https://a.com and www.b.com")).toBe(2);
    expect(countLinks("read https://hopeandtruthministry.com/sermons/x")).toBe(0);
    expect(countLinks("no links here")).toBe(0);
  });
});

describe("initialStatus", () => {
  it("posts clean comments right away", () => {
    expect(initialStatus({ flagged: false }, "plain words")).toEqual({ status: "visible" });
  });

  it("holds flagged text for review rather than rejecting it", () => {
    expect(initialStatus({ flagged: true, reason: "HATE_SPEECH" }, "x")).toEqual({
      status: "held",
      heldReason: "screening",
    });
  });

  it("holds comments with more than one outside link", () => {
    expect(initialStatus({ flagged: false }, "https://a.com https://b.com")).toEqual({
      status: "held",
      heldReason: "links",
    });
    expect(initialStatus({ flagged: false }, "https://a.com")).toEqual({ status: "visible" });
  });
});

describe("shouldAutoHold", () => {
  it("holds a visible comment once three people report it", () => {
    expect(shouldAutoHold({ status: "visible", reportCount: 3 })).toBe(true);
    expect(shouldAutoHold({ status: "visible", reportCount: 2 })).toBe(false);
  });

  it("leaves held and removed comments alone", () => {
    expect(shouldAutoHold({ status: "held", reportCount: 9 })).toBe(false);
    expect(shouldAutoHold({ status: "removed", reportCount: 9 })).toBe(false);
  });
});

describe("canModify", () => {
  const comment = { authorSub: "author-1" };

  it("lets only the author change a comment", () => {
    expect(canModify(comment, { sub: "author-1" })).toBe(true);
    expect(canModify(comment, { sub: "someone", isAdmin: true })).toBe(false);
  });

  it("refuses anyone else", () => {
    expect(canModify(comment, { sub: "someone" })).toBe(false);
    expect(canModify(comment, null)).toBe(false);
  });
});

describe("projectComment", () => {
  const base = {
    commentId: "c1",
    postSlug: "p",
    parentId: undefined,
    authorSub: "author-1",
    displayName: "Ruth",
    body: "Thank you.",
    status: "visible",
    createdAt: "2026-11-15T12:00:00Z",
    reportCount: 1,
  };

  it("shows visible comments to everyone without the author's id", () => {
    const out = projectComment(base, null);
    expect(out).toEqual({
      commentId: "c1",
      parentId: null,
      displayName: "Ruth",
      body: "Thank you.",
      status: "visible",
      createdAt: "2026-11-15T12:00:00Z",
      editedAt: null,
      mine: false,
    });
    expect(JSON.stringify(out)).not.toContain("author-1");
  });

  it("marks the viewer's own comments", () => {
    expect(projectComment(base, { sub: "author-1" }).mine).toBe(true);
  });

  it("shows a held comment only to its author", () => {
    const held = { ...base, status: "held" };
    expect(projectComment(held, null)).toBeNull();
    expect(projectComment(held, { sub: "someone" })).toBeNull();
    expect(projectComment(held, { sub: "author-1" }).status).toBe("held");
  });

  it("never shows removed comments", () => {
    expect(projectComment({ ...base, status: "removed" }, { sub: "author-1" })).toBeNull();
  });
});

describe("tallyReactions", () => {
  it("counts each kind and lists the viewer's own", () => {
    const items = [
      { sub: "a", kind: "pray" },
      { sub: "b", kind: "pray" },
      { sub: "a", kind: "heart" },
    ];
    expect(tallyReactions(items, "a")).toEqual({
      counts: { pray: 2, heart: 1, amen: 0, thanks: 0 },
      mine: ["pray", "heart"],
    });
    expect(tallyReactions([], null).mine).toEqual([]);
  });

  it("ignores kinds that are no longer allowed", () => {
    expect(tallyReactions([{ sub: "a", kind: "old" }], "a").counts.pray).toBe(0);
  });
});
