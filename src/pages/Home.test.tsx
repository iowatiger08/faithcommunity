/**
 * Tests for the home page's recent-posts list: the three newest posts, each
 * linked under its own section.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import { makePost } from "~/test/post";
import Home from "./Home";

const { getAllPosts } = vi.hoisted(() => ({ getAllPosts: vi.fn() }));

vi.mock("~/lib/content", async (importOriginal) => ({
  ...(await importOriginal<typeof import("~/lib/content")>()),
  getAllPosts,
}));
vi.mock("~/components/PageHead", () => ({ default: () => null }));

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe("Home recent posts", () => {
  it("shows only the three newest posts", () => {
    getAllPosts.mockReturnValue(
      ["One", "Two", "Three", "Four"].map((title, i) => makePost({ slug: `p${i}`, title }))
    );
    renderHome();
    expect(screen.getByRole("heading", { name: "Three" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Four" })).toBeNull();
  });

  it("links each post under its own section", () => {
    getAllPosts.mockReturnValue([
      makePost({ slug: "w", title: "Litany", section: "worship_resources" }),
    ]);
    renderHome();
    expect(screen.getByRole("link", { name: /Litany/ }).getAttribute("href"))
      .toBe("/worship-resources/w");
  });

  it("shows the lectionary code next to the date when there is one", () => {
    getAllPosts.mockReturnValue([
      makePost({ slug: "a", title: "With code" }),
      makePost({ slug: "b", title: "Without code", lectionary_code: null }),
    ]);
    renderHome();
    const withCode = screen.getByRole("link", { name: /With code/ });
    const withoutCode = screen.getByRole("link", { name: /Without code/ });
    expect(withCode.textContent).toContain("· Lent 4B");
    expect(withoutCode.textContent).not.toContain("·");
  });
});

describe("Home lectionary links", () => {
  it("links this Sunday's readings and today's daily readings", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-10T12:00:00"));
    getAllPosts.mockReturnValue([]);
    renderHome();
    vi.useRealTimers();
    const sunday = screen.getByRole("link", { name: /This Sunday's readings: Proper 28, Year A/ });
    expect(sunday.getAttribute("href")).toBe(
      "https://lectionary.library.vanderbilt.edu/texts/?y=17134&z=p&d=85",
    );
    expect(screen.getByRole("link", { name: /Today's daily readings/ }).getAttribute("href")).toBe(
      "https://lectionary.library.vanderbilt.edu/daily-readings/",
    );
  });
});
