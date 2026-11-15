// Typed client for the comments API.

export type ReactionKind = "pray" | "heart" | "amen" | "thanks";

export interface Comment {
  commentId: string;
  parentId: string | null;
  displayName: string;
  body: string;
  status: "visible" | "held";
  createdAt: string;
  editedAt: string | null;
  mine: boolean;
}

export interface Reactions {
  counts: Record<ReactionKind, number>;
  mine: ReactionKind[];
}

export interface PostThread {
  comments: Comment[];
  reactions: Reactions;
}

export interface Me {
  displayName: string | null;
  suspended: boolean;
  comments: (Comment & { postSlug: string; section: string })[];
}

export interface HeldComment {
  commentId: string;
  postSlug: string;
  section: string;
  authorSub: string;
  displayName: string;
  body: string;
  heldReason: string | null;
  reportCount: number;
  createdAt: string;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
  }
}

async function request<T>(
  path: string,
  { method = "GET", token, body }: { method?: string; token?: string | null; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (token != null) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(`${import.meta.env.VITE_COMMENTS_API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new ApiError(res.status, data.error ?? "request_failed");
  return data as T;
}

const enc = encodeURIComponent;

export const api = {
  thread: (slug: string, token: string | null) =>
    request<PostThread>(token != null ? `/posts/${enc(slug)}/mine` : `/posts/${enc(slug)}`, { token }),
  post: (token: string, slug: string, section: string, body: string, parentId?: string) =>
    request<{ comment: Comment }>(`/posts/${enc(slug)}/comments`, {
      method: "POST",
      token,
      body: { section, body, ...(parentId !== undefined ? { parentId } : {}) },
    }),
  edit: (token: string, id: string, body: string) =>
    request<{ comment: Comment }>(`/comments/${enc(id)}`, { method: "PATCH", token, body: { body } }),
  remove: (token: string, id: string) =>
    request<{ ok: true }>(`/comments/${enc(id)}`, { method: "DELETE", token }),
  report: (token: string, id: string) =>
    request<{ ok: true }>(`/comments/${enc(id)}/report`, { method: "POST", token, body: {} }),
  react: (token: string, slug: string, section: string, kind: ReactionKind, on: boolean) =>
    request<{ reactions: Reactions }>(`/posts/${enc(slug)}/reactions/${kind}`, {
      method: on ? "PUT" : "DELETE",
      token,
      body: on ? { section } : undefined,
    }),
  me: (token: string) => request<Me>("/me", { token }),
  setName: (token: string, displayName: string) =>
    request<{ displayName: string }>("/me", { method: "PUT", token, body: { displayName } }),
  deleteAccount: (token: string) => request<{ ok: true }>("/me", { method: "DELETE", token }),
  held: (token: string) => request<{ comments: HeldComment[] }>("/admin/held", { token }),
  moderate: (token: string, id: string, action: "hold" | "restore" | "remove") =>
    request<{ comment: { commentId: string; status: string } }>(`/admin/comments/${enc(id)}`, {
      method: "PUT",
      token,
      body: { action },
    }),
  suspend: (token: string, sub: string, suspended: boolean) =>
    request<{ ok: true }>(`/admin/users/${enc(sub)}`, { method: "PUT", token, body: { suspended } }),
};

/** Plain-language message for an API error code. */
export function errorMessage(err: unknown): string {
  const code = err instanceof ApiError ? err.code : "";
  switch (code) {
    case "slow_down":
      return "You've posted several comments in a short time. Please wait a few minutes and try again.";
    case "suspended":
      return "This account can't post or react right now. Use the contact page if you have questions.";
    case "invalid_body":
      return "Comments need some text and can be up to 2,000 characters.";
    case "invalid_name":
      return "Display names are 2 to 40 characters and can't include an email address or a link.";
    case "name_not_allowed":
      return "That display name can't be used. Please choose another.";
    default:
      return "Something went wrong. Please try again.";
  }
}
