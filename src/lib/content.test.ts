import { describe, it, expect } from "vitest";
import {
  getAllPosts,
  getSermons,
  getWorshipResources,
  getPostBySlug,
  getPostsInSection,
  formatDate,
  getThemeCounts,
} from "./content";

describe("getAllPosts", () => {
  it("returns a non-empty array", () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it("each post has required fields", () => {
    for (const p of getAllPosts()) {
      expect(typeof p.slug).toBe("string");
      expect(typeof p.title).toBe("string");
      expect(["sermons", "reflections", "worship_resources"]).toContain(p.section);
    }
  });
});

describe("getSermons", () => {
  it("returns only sermon-section posts", () => {
    const sermons = getSermons();
    expect(sermons.length).toBeGreaterThan(0);
    for (const s of sermons) {
      expect(s.section).toBe("sermons");
    }
  });
});

describe("getWorshipResources", () => {
  it("returns only worship_resources-section posts", () => {
    const resources = getWorshipResources();
    expect(resources.length).toBeGreaterThan(0);
    for (const r of resources) {
      expect(r.section).toBe("worship_resources");
    }
  });
});

describe("getPostsInSection", () => {
  it("filters correctly", () => {
    const sermons = getPostsInSection("sermons");
    const worship = getPostsInSection("worship_resources");
    expect(sermons.length + worship.length).toBeLessThanOrEqual(getAllPosts().length);
    for (const p of worship) {
      expect(p.section).toBe("worship_resources");
    }
  });
});

describe("getPostBySlug", () => {
  it("returns the post for a valid slug", () => {
    const first = getAllPosts()[0];
    const found = getPostBySlug(first.slug);
    expect(found).toBeDefined();
    expect(found!.slug).toBe(first.slug);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getPostBySlug("does-not-exist-xyz")).toBeUndefined();
  });
});

describe("formatDate", () => {
  it("formats a valid ISO date", () => {
    const result = formatDate("2024-03-31");
    expect(result).toContain("2024");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns empty string for null", () => {
    expect(formatDate(null)).toBe("");
  });
});

describe("getThemeCounts", () => {
  it("returns sorted pairs", () => {
    const counts = getThemeCounts();
    expect(Array.isArray(counts)).toBe(true);
    if (counts.length > 1) {
      expect(counts[0][1]).toBeGreaterThanOrEqual(counts[1][1]);
    }
  });
});
