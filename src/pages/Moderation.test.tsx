import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { HeldComment } from "~/lib/commentsApi";
import Moderation from "./Moderation";

const auth = vi.hoisted(() => ({
  state: { loading: false, token: null as string | null, isAdmin: false },
  signIn: vi.fn(),
}));
vi.mock("~/lib/auth", () => ({ useAuth: () => auth.state, signIn: auth.signIn }));
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
  auth.state = { loading: false, token: "tok", isAdmin: true };
  for (const fn of [...Object.values(api), auth.signIn]) fn.mockReset();
  api.held.mockResolvedValue({ comments: [heldComment()] });
  api.moderate.mockResolvedValue({});
  api.suspend.mockResolvedValue({});
});

describe("Moderation", () => {
  it("asks for sign-in and hides the queue from non-moderators", () => {
    auth.state = { loading: false, token: null, isAdmin: false };
    const { unmount } = renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(auth.signIn).toHaveBeenCalled();
    unmount();

    auth.state = { loading: false, token: "tok", isAdmin: false };
    renderPage();
    expect(screen.getByText("This page is for moderators.")).toBeInTheDocument();
    expect(api.held).not.toHaveBeenCalled();
  });

  it("shows nothing while sign-in state loads", () => {
    auth.state = { loading: true, token: null, isAdmin: false };
    renderPage();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
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
