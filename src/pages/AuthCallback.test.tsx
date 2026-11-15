import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import AuthCallback from "./AuthCallback";

const completeSignIn = vi.hoisted(() => vi.fn());
vi.mock("~/lib/auth", () => ({ completeSignIn }));
vi.mock("~/components/PageHead", () => ({ default: () => null }));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/auth/callback/"]}>
      <Routes>
        <Route path="/auth/callback/" element={<AuthCallback />} />
        <Route path="/sermons/x/" element={<p>Back on the post</p>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  completeSignIn.mockReset();
});

describe("AuthCallback", () => {
  it("returns to the post after sign-in", async () => {
    completeSignIn.mockResolvedValue("/sermons/x/");
    renderPage();
    expect(screen.getByText("Signing you in…")).toBeInTheDocument();
    expect(await screen.findByText("Back on the post")).toBeInTheDocument();
  });

  it("explains a failed sign-in", async () => {
    completeSignIn.mockRejectedValue(new Error("expired"));
    renderPage();
    expect(await screen.findByText("Sign-in didn't finish")).toBeInTheDocument();
  });
});
