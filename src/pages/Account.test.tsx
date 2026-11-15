import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ApiError } from "~/lib/commentsApi";
import Account from "./Account";

const auth = vi.hoisted(() => ({
  state: { loading: false, token: null as string | null, isAdmin: false },
  signIn: vi.fn(),
  signOut: vi.fn(),
  forgetUser: vi.fn(),
}));
vi.mock("~/lib/auth", () => ({
  useAuth: () => auth.state,
  signIn: auth.signIn,
  signOut: auth.signOut,
  forgetUser: auth.forgetUser,
}));
vi.mock("~/components/PageHead", () => ({ default: () => null }));

const api = vi.hoisted(() => ({ me: vi.fn(), setName: vi.fn(), deleteAccount: vi.fn() }));
vi.mock("~/lib/commentsApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("~/lib/commentsApi")>()),
  api,
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <Account />
    </MemoryRouter>,
  );

beforeEach(() => {
  auth.state = { loading: false, token: "tok", isAdmin: false };
  for (const fn of [...Object.values(api), auth.signIn, auth.signOut, auth.forgetUser]) fn.mockReset();
  api.me.mockResolvedValue({
    displayName: "Ruth",
    suspended: false,
    comments: [
      {
        commentId: "c1",
        postSlug: "a-post",
        section: "sermons",
        body: "My words",
        status: "held",
        parentId: null,
        displayName: "Ruth",
        createdAt: "2026-11-15T12:00:00Z",
        editedAt: null,
        mine: true,
      },
    ],
  });
});

describe("Account", () => {
  it("asks a signed-out visitor to sign in", () => {
    auth.state = { loading: false, token: null, isAdmin: false };
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(auth.signIn).toHaveBeenCalled();
  });

  it("renders nothing extra while sign-in state loads", () => {
    auth.state = { loading: true, token: null, isAdmin: false };
    renderPage();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("lists the user's comments with links back to the post", async () => {
    renderPage();
    expect(await screen.findByText("My words")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View post" })).toHaveAttribute("href", "/sermons/a-post/");
    expect(screen.getByText(/awaiting review/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Display name/)).toHaveValue("Ruth");
  });

  it("says when there are no comments", async () => {
    api.me.mockResolvedValue({ displayName: null, suspended: false, comments: [] });
    renderPage();
    expect(await screen.findByText(/haven.t commented yet/)).toBeInTheDocument();
  });

  it("updates the display name", async () => {
    api.setName.mockResolvedValue({ displayName: "Ruth B" });
    renderPage();
    fireEvent.change(await screen.findByLabelText(/Display name/), { target: { value: "Ruth B" } });
    fireEvent.click(screen.getByRole("button", { name: "Save name" }));
    expect(api.setName).toHaveBeenCalledWith("tok", "Ruth B");
  });

  it("shows an error when the account can't load", async () => {
    api.me.mockRejectedValue(new ApiError(500, "server_error"));
    renderPage();
    expect(await screen.findByText("Something went wrong. Please try again.")).toBeInTheDocument();
  });

  it("deletes the account only after confirmation", async () => {
    api.deleteAccount.mockResolvedValue({ ok: true });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Delete my account" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete my account" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, delete everything" }));
    expect(await screen.findByText(/have been deleted/)).toBeInTheDocument();
    expect(api.deleteAccount).toHaveBeenCalledWith("tok");
    expect(auth.forgetUser).toHaveBeenCalled();
  });

  it("reports a failed deletion", async () => {
    api.deleteAccount.mockRejectedValue(new Error("x"));
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Delete my account" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, delete everything" }));
    expect(await screen.findByText("Something went wrong. Please try again.")).toBeInTheDocument();
  });

  it("signs out", async () => {
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Sign out" }));
    expect(auth.signOut).toHaveBeenCalled();
  });
});
