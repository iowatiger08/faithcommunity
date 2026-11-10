/**
 * Tests for SermonDetail, which renders any post: sermons, worship resources
 * and reflections. PageHead is captured so the meta description can be checked.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { PublishedPost } from "~/lib/content";
import { makePost } from "~/test/post";
import SermonDetail from "./SermonDetail";

const { getPostBySlug, headProps } = vi.hoisted(() => ({
  getPostBySlug: vi.fn(),
  headProps: [] as Record<string, unknown>[],
}));

vi.mock("~/lib/content", async (importOriginal) => ({
  ...(await importOriginal<typeof import("~/lib/content")>()),
  getPostBySlug,
}));
vi.mock("~/components/PageHead", () => ({
  default: (props: Record<string, unknown>) => {
    headProps.push(props);
    return null;
  },
}));

function renderPost(post: PublishedPost | undefined, url = "/sermons/love-of-neighbor") {
  getPostBySlug.mockReturnValue(post);
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/:section/:slug" element={<SermonDetail />} />
        <Route path="/no-slug" element={<SermonDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

const lastHead = () => headProps[headProps.length - 1];

beforeEach(() => {
  getPostBySlug.mockReset();
  headProps.length = 0;
});

describe("SermonDetail", () => {
  it("renders the full header and body", () => {
    renderPost(makePost());
    expect(screen.getByRole("heading", { level: 1, name: "Love of Neighbor" })).toBeTruthy();
    expect(screen.getByText("By Tony E Hansen")).toBeTruthy();
    expect(screen.getByText("A sermon on loving the neighbor.")).toBeTruthy();
    expect(screen.getByText("Matthew 22:37-39")).toBeTruthy();
    expect(screen.getByText("love")).toBeTruthy();
    expect(screen.getByText("justice")).toBeTruthy();
    expect(screen.getByText("Body of the sermon.")).toBeTruthy();
    expect(screen.getByText(/· Lent 4B · Lent · Year B/)).toBeTruthy();
    expect(getPostBySlug).toHaveBeenCalledWith("love-of-neighbor");
  });

  it("builds the meta description from summary, scripture and lectionary", () => {
    renderPost(makePost());
    expect(lastHead()).toMatchObject({
      title: "Love of Neighbor",
      path: "/sermons/love-of-neighbor/",
      type: "article",
      publishedTime: "2024-03-10",
      description: "A sermon on loving the neighbor. Scripture: Matthew 22:37-39. Lent 4B, Year B.",
    });
  });

  it("drops the year from the lectionary line when there is none", () => {
    renderPost(makePost({ lectionary_year: null }));
    expect(lastHead().description).toMatch(/Lent 4B\.$/);
    expect(screen.getByText(/· Lent 4B · Lent$/)).toBeTruthy();
  });

  it("falls back to the title when there is nothing to describe", () => {
    renderPost(makePost({
      summary: "",
      scripture_in_title: [],
      lectionary_code: null,
      lectionary_year: null,
      liturgical_season: null,
      author: null,
      scripture_refs: [],
      themes: [],
    }));
    expect(lastHead().description).toBe("Love of Neighbor");
    expect(screen.queryByText(/^By /)).toBeNull();
    expect(screen.queryByText("Texts in this sermon")).toBeNull();
  });

  it("hides an empty author", () => {
    renderPost(makePost({ author: "" }));
    expect(screen.queryByText(/^By /)).toBeNull();
  });

  it("links to the RCL readings for the post's Sunday", () => {
    renderPost(makePost());
    const aside = screen.getByRole("complementary", { name: "Readings" });
    expect(aside.textContent).toContain("Fourth Sunday in Lent, Year B");
    const link = screen.getByRole("link", { name: /Read this Sunday's readings \(NRSVue\)/ });
    expect(link.getAttribute("href")).toBe(
      "https://lectionary.library.vanderbilt.edu/texts/?y=18921&z=l&d=28",
    );
    expect(link.getAttribute("target")).toBe("rcl-readings");
    expect(screen.getByRole("link", { name: /Today's daily readings/ }).getAttribute("href")).toBe(
      "https://lectionary.library.vanderbilt.edu/daily-readings/",
    );
  });

  it("follows a hand-set RCL day", () => {
    renderPost(makePost({ rcl_day: "Good Friday" }));
    expect(screen.getByRole("complementary", { name: "Readings" }).textContent).toContain(
      "Good Friday, Year B",
    );
  });

  it("lists every scripture reference once", () => {
    const refs = ["A 1:1", "B 2:2", "C 3:3", "D 4:4", "E 5:5", "F 6:6", "A 1:1"].map((ref) => ({
      book: ref[0], chapter: 1, verses: null, ref,
    }));
    renderPost(makePost({ scripture_refs: refs }));
    const items = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(items).toEqual(["A 1:1", "B 2:2", "C 3:3", "D 4:4", "E 5:5", "F 6:6"]);
  });

  it("shows only the texts when there is no RCL day", () => {
    renderPost(makePost({ rcl_day: "none" }));
    expect(screen.queryByRole("link", { name: /Read this Sunday's readings/ })).toBeNull();
    expect(screen.getByText("Matthew 22:37-39")).toBeTruthy();
  });

  it("leaves out the readings box when there is nothing to show", () => {
    renderPost(makePost({ rcl_day: "none", scripture_refs: [] }));
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it.each([
    ["sermons", "/sermons", "All sermons", "/sermons/love-of-neighbor/"],
    ["worship_resources", "/worship-resources", "All worship resources", "/worship-resources/love-of-neighbor/"],
    ["reflections", "/queer-resources", "Back to queer resources", "/reflections/love-of-neighbor/"],
  ] as const)("links a %s post back to %s", (section, href, label, path) => {
    renderPost(makePost({ section }));
    const back = screen.getByRole("link", { name: new RegExp(label) });
    expect(back.getAttribute("href")).toBe(href);
    expect(lastHead().path).toBe(path);
  });

  it("falls back to the sermons link for an unrecognised section", () => {
    renderPost(makePost({ section: "other" as PublishedPost["section"] }));
    expect(screen.getByRole("link", { name: /All sermons/ }).getAttribute("href")).toBe("/sermons");
  });

  it("shows not found for an unknown slug", () => {
    renderPost(undefined, "/sermons/missing");
    expect(screen.getByRole("heading", { level: 1, name: "Not found" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back to sermons" }).getAttribute("href")).toBe("/sermons");
    expect(lastHead()).toMatchObject({ title: "Not found", path: "/sermons/" });
  });

  it("shows not found without a lookup when there is no slug", () => {
    renderPost(makePost(), "/no-slug");
    expect(screen.getByRole("heading", { level: 1, name: "Not found" })).toBeTruthy();
    expect(getPostBySlug).not.toHaveBeenCalled();
  });
});
