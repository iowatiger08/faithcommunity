// Pure decisions for comments and reactions. Free of AWS SDK imports so every
// rule here is unit-testable without mocks.

export const MAX_BODY = 2000;
export const REACTION_KINDS = ["pray", "heart", "amen", "thanks"];
export const REPORT_HOLD_THRESHOLD = 3;

const SECTIONS = new Set(["sermons", "worship-resources", "reflections"]);
const SHORT_WINDOW_MS = 10 * 60_000;
const SHORT_LIMIT = 5;
const DAY_MS = 24 * 60 * 60_000;
const DAY_LIMIT = 30;
const MAX_LINKS = 1;

// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const LINK_RE = /https?:\/\/|www\./gi;
const OWN_LINK_RE = /https?:\/\/(?:www\.)?hopeandtruthministry\.com\S*/gi;

export function normalizeBody(text) {
  if (typeof text !== "string") return null;
  const cleaned = text
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_RE, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!cleaned || cleaned.length > MAX_BODY) return null;
  return cleaned;
}

export function normalizeDisplayName(name) {
  if (typeof name !== "string") return null;
  const cleaned = name.replace(CONTROL_RE, "").replace(/\s+/g, " ").trim();
  if (cleaned.length < 2 || cleaned.length > 40) return null;
  // A display name that is an email or a link would expose contact details or
  // advertise something, so neither is accepted.
  if (cleaned.includes("@") || countLinks(cleaned) > 0) return null;
  return cleaned;
}

export function isValidSlug(slug) {
  return typeof slug === "string" && /^[a-z0-9][a-z0-9-]{0,199}$/.test(slug);
}

export function isValidSection(section) {
  return SECTIONS.has(section);
}

export function isReactionKind(kind) {
  return REACTION_KINDS.includes(kind);
}

/** `createdAt` ISO strings of the user's recent comments → may they post one more? */
export function rateLimit(createdAts, now = Date.now()) {
  const ages = createdAts.map((t) => now - Date.parse(t));
  if (ages.filter((a) => a < SHORT_WINDOW_MS).length >= SHORT_LIMIT) {
    return { ok: false, window: "short" };
  }
  if (ages.filter((a) => a < DAY_MS).length >= DAY_LIMIT) return { ok: false, window: "day" };
  return { ok: true };
}

export function countLinks(text) {
  return (text.replace(OWN_LINK_RE, " ").match(LINK_RE) ?? []).length;
}

/** Screening result + body → status for a new or edited comment. Never rejects. */
export function initialStatus(screening, body) {
  if (screening.flagged) return { status: "held", heldReason: "screening" };
  if (countLinks(body) > MAX_LINKS) return { status: "held", heldReason: "links" };
  return { status: "visible" };
}

export function shouldAutoHold(comment) {
  return comment.status === "visible" && comment.reportCount >= REPORT_HOLD_THRESHOLD;
}

export function canModify(comment, user) {
  return Boolean(user) && comment.authorSub === user.sub;
}

/** Public shape of a comment for a viewer, or null when they may not see it. */
export function projectComment(comment, viewer) {
  const mine = Boolean(viewer) && comment.authorSub === viewer.sub;
  if (comment.status === "removed") return null;
  if (comment.status === "held" && !mine) return null;
  return {
    commentId: comment.commentId,
    parentId: comment.parentId ?? null,
    displayName: comment.displayName,
    body: comment.body,
    status: comment.status,
    createdAt: comment.createdAt,
    editedAt: comment.editedAt ?? null,
    mine,
  };
}

export function tallyReactions(items, viewerSub) {
  const counts = Object.fromEntries(REACTION_KINDS.map((k) => [k, 0]));
  const mine = [];
  for (const { sub, kind } of items) {
    if (!isReactionKind(kind)) continue;
    counts[kind] += 1;
    if (viewerSub && sub === viewerSub) mine.push(kind);
  }
  return { counts, mine };
}
