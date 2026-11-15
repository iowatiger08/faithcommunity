import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ApiError } from "~/lib/commentsApi";
import type { HeldComment } from "~/lib/commentsApi";
import Moderation from "./Moderation";

const auth = vi.hoisted(() => ({ signIn: vi.fn(), signOut: vi.fn(), getIdToken: vi.fn() }));
vi.mock("~/lib/ownerAuth", () => auth);
vi.mock("~/components/PageHead", () => ({ default: () => null }));

const api = vi.hoisted(() => ({ held: vi.fn(), moderate: vi.fn(), suspend: vi.fn() }));
vi.mock("~/lib/commentsApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("~/lib/commentsApi")>()),
  api,
}));

const heldComment = (overrides: Partial<HeldComment> = {}): HeldComment => ({
  commentId: "c1",
  postSlug: "a-post",
  section: "sermons",
  authorSub: "author-1",
  displayName: "Ruth",
  body: "Held words",
  heldReason: "reports",
  reportCount: 3,
  createdAt: "2026-11-15T12:00:00Z",
  ...overrides,
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <Moderation />
    </MemoryRouter>,
  );

beforeEach(() => {
  for (const fn of [...Object.values(api), ...Object.values(auth)]) fn.mockReset();
  auth.getIdToken.mockResolvedValue("tok");
  api.held.mockResolvedValue({ comments: [heldComment()] });
  api.moderate.mockResolvedValue({});
  api.suspend.mockResolvedValue({});
});

describe("Moderation", () => {
  it("asks for email and password when there is no session, then loads the queue", async () => {
    auth.getIdToken.mockResolvedValueOnce(null);
    auth.signIn.mockResolvedValue(undefined);
    renderPage();
    fireEvent.change(await screen.findByLabelText("Email"), { target: { value: "me@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "pw" } });
    expect(api.held).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(auth.signIn).toHaveBeenCalledWith("me@example.com", "pw");
    expect(await screen.findByText("Held words")).toBeInTheDocument();
  });

  it("shows why a sign-in failed", async () => {
    auth.getIdToken.mockResolvedValue(null);
    auth.signIn.mockRejectedValue(new Error("This page is for moderators."));
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("This page is for moderators.")).toBeInTheDocument();
    auth.signIn.mockRejectedValue("odd");
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Sign-in didn't work. Please try again.")).toBeInTheDocument();
  });

  it("shows nothing while checking for a session", () => {
    auth.getIdToken.mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("returns to the sign-in form when the server refuses the session", async () => {
    api.held.mockRejectedValue(new ApiError(403, "forbidden"));
    renderPage();
    expect(await screen.findByLabelText("Password")).toBeInTheDocument();
    expect(auth.signOut).toHaveBeenCalled();
  });

  it("returns to the sign-in form when the session ends before an action", async () => {
    renderPage();
    const restore = await screen.findByRole("button", { name: "Restore" });
    auth.getIdToken.mockResolvedValue(null);
    fireEvent.click(restore);
    expect(await screen.findByLabelText("Password")).toBeInTheDocument();
    expect(api.moderate).not.toHaveBeenCalled();
  });

  it("signs out", async () => {
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Sign out" }));
    expect(auth.signOut).toHaveBeenCalled();
    expect(await screen.findByLabelText("Password")).toBeInTheDocument();
  });

  it("lists held comments with the reason and a link to the post", async () => {
    renderPage();
    expect(await screen.findByText("Held words")).toBeInTheDocument();
    expect(screen.getByText(/Reported by readers · 3 reports/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View post" })).toHaveAttribute("href", "/sermons/a-post/");
  });

  it("labels single reports and unknown reasons", async () => {
    api.held.mockResolvedValue({
      comments: [heldComment({ reportCount: 1 }), heldComment({ commentId: "c2", heldReason: null, reportCount: 0 })],
    });
    renderPage();
    expect(await screen.findByText(/1 report ·/)).toBeInTheDocument();
    expect(screen.getByText(/^Held ·/)).toBeInTheDocument();
  });

  it("says when the queue is empty", async () => {
    api.held.mockResolvedValue({ comments: [] });
    renderPage();
    expect(await screen.findByText("Nothing is waiting for review.")).toBeInTheDocument();
  });

  it("restores, removes and suspends, reloading after each", async () => {
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Restore" }));
    await waitFor(() => expect(api.held).toHaveBeenCalledTimes(2));
    expect(api.moderate).toHaveBeenCalledWith("tok", "c1", "restore");

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    await waitFor(() => expect(api.moderate).toHaveBeenCalledWith("tok", "c1", "remove"));
    fireEvent.click(screen.getByRole("button", { name: "Suspend author" }));
    await waitFor(() => expect(api.suspend).toHaveBeenCalledWith("tok", "author-1", true));
  });

  it("shows errors from loading and from actions", async () => {
    api.moderate.mockRejectedValue(new Error("x"));
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Restore" }));
    expect(await screen.findByText("Something went wrong. Please try again.")).toBeInTheDocument();
  });

  it("shows a load error", async () => {
    api.held.mockRejectedValue(new Error("x"));
    renderPage();
    expect(await screen.findByText("Something went wrong. Please try again.")).toBeInTheDocument();
  });
});
