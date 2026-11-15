import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Comment, PostThread } from "~/lib/commentsApi";
import { ApiError } from "~/lib/commentsApi";
import CommentsSection from "./CommentsSection";

const auth = vi.hoisted(() => ({
  state: { loading: false, token: null as string | null, isAdmin: false },
  signIn: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("~/lib/auth", () => ({
  useAuth: () => auth.state,
  signIn: auth.signIn,
  signOut: auth.signOut,
}));

const api = vi.hoisted(() => ({
  thread: vi.fn(),
  me: vi.fn(),
  setName: vi.fn(),
  post: vi.fn(),
  edit: vi.fn(),
  remove: vi.fn(),
  report: vi.fn(),
  react: vi.fn(),
}));
vi.mock("~/lib/commentsApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("~/lib/commentsApi")>()),
  api,
}));

function comment(overrides: Partial<Comment> = {}): Comment {
  return {
    commentId: "c1",
    parentId: null,
    displayName: "Ruth",
    body: "Thank you for this.",
    status: "visible",
    createdAt: "2026-11-15T12:00:00Z",
    editedAt: null,
    mine: false,
    ...overrides,
  };
}

function thread(comments: Comment[] = [], mine: PostThread["reactions"]["mine"] = []): PostThread {
  return { comments, reactions: { counts: { pray: 2, heart: 0, amen: 1, thanks: 0 }, mine } };
}

function renderSection() {
  return render(
    <MemoryRouter>
      <CommentsSection slug="a-post" section="sermons" />
    </MemoryRouter>,
  );
}

const signedIn = () => {
  auth.state = { loading: false, token: "tok", isAdmin: false };
};

beforeEach(() => {
  auth.state = { loading: false, token: null, isAdmin: false };
  for (const fn of [...Object.values(api), auth.signIn, auth.signOut]) fn.mockReset();
  api.thread.mockResolvedValue(thread([comment()]));
  api.me.mockResolvedValue({ displayName: "Sam", suspended: false, comments: [] });
});

describe("signed out", () => {
  it("shows comments and reaction counts, and invites sign-in", async () => {
    renderSection();
    expect(await screen.findByText("Thank you for this.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Comments (1)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Praying 2/ })).toHaveAttribute("aria-pressed", "false");
    expect(api.thread).toHaveBeenCalledWith("a-post", null);
    expect(screen.queryByRole("button", { name: "Report" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(auth.signIn).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: /Amen/ }));
    expect(auth.signIn).toHaveBeenCalledTimes(2);
    expect(api.react).not.toHaveBeenCalled();
  });

  it("says when there are no comments yet", async () => {
    api.thread.mockResolvedValue(thread([]));
    renderSection();
    expect(await screen.findByText("No comments yet.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Comments" })).toBeInTheDocument();
  });

  it("renders comment text as text, not HTML", async () => {
    api.thread.mockResolvedValue(thread([comment({ body: "<b>bold</b>" })]));
    const { container } = renderSection();
    expect(await screen.findByText("<b>bold</b>")).toBeInTheDocument();
    expect(container.querySelector("b")).toBeNull();
  });

  it("explains when comments can't load", async () => {
    api.thread.mockRejectedValue(new Error("down"));
    renderSection();
    expect(await screen.findByText(/couldn.t be loaded/)).toBeInTheDocument();
  });

  it("waits for sign-in state before loading", () => {
    auth.state = { loading: true, token: null, isAdmin: false };
    const { container } = renderSection();
    expect(api.thread).not.toHaveBeenCalled();
    expect(container).toBeEmptyDOMElement();
  });
});

describe("display name", () => {
  it("asks for a name with the guidelines before the first comment", async () => {
    signedIn();
    api.me.mockResolvedValue({ displayName: null, suspended: false, comments: [] });
    api.setName.mockResolvedValue({ displayName: "Naomi" });
    renderSection();

    expect(await screen.findByText("Before your first comment")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Display name/), { target: { value: "Naomi" } });
    fireEvent.click(screen.getByRole("button", { name: "Save name" }));
    expect(api.setName).toHaveBeenCalledWith("tok", "Naomi");
    expect(await screen.findByLabelText("Comment as Naomi")).toBeInTheDocument();
  });

  it("shows why a name was refused", async () => {
    signedIn();
    api.me.mockRejectedValue(new Error("x"));
    api.setName.mockRejectedValue(new ApiError(400, "name_not_allowed"));
    renderSection();
    fireEvent.change(await screen.findByLabelText(/Display name/), { target: { value: "Bad" } });
    fireEvent.click(screen.getByRole("button", { name: "Save name" }));
    expect(await screen.findByText(/can't be used/)).toBeInTheDocument();
  });
});

describe("signed in", () => {
  beforeEach(signedIn);

  it("loads the viewer's own view of the thread", async () => {
    renderSection();
    await screen.findByText("Thank you for this.");
    expect(api.thread).toHaveBeenCalledWith("a-post", "tok");
  });

  it("posts a comment and reloads", async () => {
    api.post.mockResolvedValue({ comment: comment() });
    renderSection();
    fireEvent.change(await screen.findByLabelText("Comment as Sam"), { target: { value: "Amen." } });
    fireEvent.click(screen.getByRole("button", { name: "Post comment" }));
    expect(api.post).toHaveBeenCalledWith("tok", "a-post", "sermons", "Amen.");
    await waitFor(() => expect(api.thread).toHaveBeenCalledTimes(2));
    expect(screen.getByLabelText("Comment as Sam")).toHaveValue("");
  });

  it("explains a rate limit", async () => {
    api.post.mockRejectedValue(new ApiError(429, "slow_down"));
    renderSection();
    fireEvent.change(await screen.findByLabelText("Comment as Sam"), { target: { value: "Again" } });
    fireEvent.click(screen.getByRole("button", { name: "Post comment" }));
    expect(await screen.findByText(/wait a few minutes/)).toBeInTheDocument();
    expect(screen.getByLabelText("Comment as Sam")).toHaveValue("Again");
  });

  it("marks the author's held comment as awaiting review", async () => {
    api.thread.mockResolvedValue(thread([comment({ status: "held", mine: true })]));
    renderSection();
    expect(await screen.findByText("Your comment is awaiting review.")).toBeInTheDocument();
  });

  it("replies to a top-level comment", async () => {
    api.post.mockResolvedValue({ comment: comment() });
    api.thread.mockResolvedValue(
      thread([comment(), comment({ commentId: "r1", parentId: "c1", body: "A reply", displayName: "Jo" })]),
    );
    renderSection();
    await screen.findByText("A reply");
    // Replies can't be replied to: only the top-level comment offers it.
    expect(screen.getAllByRole("button", { name: "Reply" })).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Reply" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Reply" }));
    fireEvent.change(screen.getByLabelText("Reply to Ruth"), { target: { value: "Me too" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Reply" }).at(-1)!);
    expect(api.post).toHaveBeenCalledWith("tok", "a-post", "sermons", "Me too", "c1");
    await waitFor(() => expect(screen.queryByLabelText("Reply to Ruth")).not.toBeInTheDocument());
  });

  it("groups replies whose parent was deleted", async () => {
    api.thread.mockResolvedValue(thread([comment({ commentId: "r1", parentId: "gone", body: "Orphan" })]));
    renderSection();
    expect(await screen.findByText("This comment was deleted.")).toBeInTheDocument();
    expect(screen.getByText("Orphan")).toBeInTheDocument();
  });

  it("edits the viewer's own comment", async () => {
    api.thread.mockResolvedValue(thread([comment({ mine: true, editedAt: "2026-11-15T13:00:00Z" })]));
    api.edit.mockResolvedValue({ comment: comment() });
    renderSection();
    expect(await screen.findByText(/edited/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Report" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Edit comment"), { target: { value: "Better words" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(api.edit).toHaveBeenCalledWith("tok", "c1", "Better words");
  });

  it("confirms before deleting", async () => {
    api.thread.mockResolvedValue(thread([comment({ mine: true })]));
    api.remove.mockResolvedValue({ ok: true });
    renderSection();
    fireEvent.click(await screen.findByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(api.remove).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, delete" }));
    expect(api.remove).toHaveBeenCalledWith("tok", "c1");
  });

  it("reports someone else's comment once", async () => {
    api.report.mockResolvedValue({ ok: true });
    renderSection();
    fireEvent.click(await screen.findByRole("button", { name: "Report" }));
    expect(api.report).toHaveBeenCalledWith("tok", "c1");
    expect(await screen.findByText("Reported. Thank you.")).toBeInTheDocument();
  });

  it("shows an error when a report fails", async () => {
    api.report.mockRejectedValue(new ApiError(403, "suspended"));
    renderSection();
    fireEvent.click(await screen.findByRole("button", { name: "Report" }));
    expect(await screen.findByText(/can't post or react/)).toBeInTheDocument();
  });

  it("toggles a reaction on and off", async () => {
    api.thread.mockResolvedValue(thread([], ["pray"]));
    api.react.mockResolvedValue({ reactions: { counts: { pray: 1, heart: 1, amen: 1, thanks: 0 }, mine: ["heart"] } });
    renderSection();
    const pray = await screen.findByRole("button", { name: /Praying/ });
    expect(pray).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(pray);
    expect(api.react).toHaveBeenCalledWith("tok", "a-post", "sermons", "pray", false);
    const love = await screen.findByRole("button", { name: /Love 1/ });
    expect(love).toHaveAttribute("aria-pressed", "true");
    await waitFor(() => expect(love).toBeEnabled());
    fireEvent.click(love);
    expect(api.react).toHaveBeenLastCalledWith("tok", "a-post", "sermons", "heart", false);
  });

  it("shows an error when a reaction fails", async () => {
    api.react.mockRejectedValue(new Error("x"));
    renderSection();
    fireEvent.click(await screen.findByRole("button", { name: /Praying/ }));
    expect(await screen.findByText("Something went wrong. Please try again.")).toBeInTheDocument();
  });

  it("signs out", async () => {
    renderSection();
    fireEvent.click(await screen.findByRole("button", { name: "Sign out" }));
    expect(auth.signOut).toHaveBeenCalled();
  });
});
