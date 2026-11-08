/**
 * Tests for the sermons index: posts grouped by year, newest year first.
 */
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import { makePost } from "~/test/post";
import SermonsIndex from "./SermonsIndex";

const { getSermons } = vi.hoisted(() => ({ getSermons: vi.fn() }));

vi.mock("~/lib/content", async (importOriginal) => ({
  ...(await importOriginal<typeof import("~/lib/content")>()),
  getSermons,
}));
vi.mock("~/components/PageHead", () => ({ default: () => null }));

function renderIndex() {
  return render(
    <MemoryRouter>
      <SermonsIndex />
    </MemoryRouter>
  );
}

describe("SermonsIndex", () => {
  it("groups sermons by year, newest year first", () => {
    getSermons.mockReturnValue([
      makePost({ slug: "a", title: "First", published_date: "2023-05-01" }),
      makePost({ slug: "b", title: "Second", published_date: "2024-02-01" }),
      makePost({ slug: "c", title: "Third", published_date: "2024-06-01" }),
    ]);
    renderIndex();
    const years = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(years).toEqual(["2024", "2023"]);
    const y2024 = screen.getByRole("heading", { level: 2, name: "2024" }).closest("section")!;
    expect(within(y2024).getAllByRole("heading", { level: 3 }).map((h) => h.textContent))
      .toEqual(["Second", "Third"]);
  });

  it("links each sermon to its page", () => {
    getSermons.mockReturnValue([makePost({ slug: "love-of-neighbor" })]);
    renderIndex();
    expect(screen.getByRole("link", { name: /Love of Neighbor/ }).getAttribute("href"))
      .toBe("/sermons/love-of-neighbor");
  });

  it("shows scripture and lectionary under the title", () => {
    getSermons.mockReturnValue([makePost()]);
    renderIndex();
    expect(screen.getByText("Matthew 22:37-39 · Lent 4B")).toBeTruthy();
  });

  it("shows scripture alone when there is no lectionary code", () => {
    getSermons.mockReturnValue([makePost({ lectionary_code: null })]);
    renderIndex();
    expect(screen.getByText("Matthew 22:37-39")).toBeTruthy();
  });

  it("omits the scripture line when the title has none", () => {
    getSermons.mockReturnValue([makePost({ scripture_in_title: [] })]);
    renderIndex();
    expect(screen.queryByText(/Matthew/)).toBeNull();
  });

  it("files an undated sermon under 'Undated', after the dated years", () => {
    getSermons.mockReturnValue([
      makePost({ slug: "a", published_date: null }),
      makePost({ slug: "b", published_date: "2019-05-01" }),
    ]);
    renderIndex();
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(["2019", "Undated"]);
  });
});
