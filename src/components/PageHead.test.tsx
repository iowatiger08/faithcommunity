/**
 * Tests for PageHead: the title, description and social tags each page sets.
 */
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { describe, it, expect } from "vitest";
import PageHead from "./PageHead";

type Props = Parameters<typeof PageHead>[0];

function renderHead(props: Props) {
  render(
    <HelmetProvider>
      <PageHead {...props} />
    </HelmetProvider>
  );
}

const meta = (sel: string) => document.head.querySelector(sel)?.getAttribute("content");
const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute("href");

describe("PageHead", () => {
  it("suffixes the site name and builds the canonical URL", async () => {
    renderHead({ title: "Sermons", path: "/sermons/" });
    await waitFor(() => expect(document.title).toBe("Sermons — Hope and Truth Ministry"));
    expect(canonical()).toBe("https://hopeandtruthministry.com/sermons/");
    expect(meta('meta[property="og:url"]')).toBe("https://hopeandtruthministry.com/sermons/");
    expect(meta('meta[property="og:type"]')).toBe("website");
    expect(meta('meta[name="twitter:title"]')).toBe("Sermons — Hope and Truth Ministry");
  });

  it("leaves the home title alone", async () => {
    renderHead({ title: "Hope and Truth Ministry", path: "/", isHome: true });
    await waitFor(() => expect(document.title).toBe("Hope and Truth Ministry"));
  });

  it("adds a leading slash to a bare path", async () => {
    renderHead({ title: "About", path: "about/" });
    await waitFor(() => expect(canonical()).toBe("https://hopeandtruthministry.com/about/"));
  });

  it("falls back to the default description", async () => {
    renderHead({ title: "About", path: "/about/" });
    await waitFor(() => expect(meta('meta[name="description"]')).toMatch(/^Be hope, be love/));
  });

  it("keeps a description of 300 characters as is", async () => {
    const desc = "a".repeat(300);
    renderHead({ title: "T", path: "/", description: desc });
    await waitFor(() => expect(meta('meta[name="description"]')).toBe(desc));
  });

  it("clips a long description to 300 characters with an ellipsis", async () => {
    const desc = "word ".repeat(100);
    renderHead({ title: "T", path: "/", description: desc });
    await waitFor(() => {
      const got = meta('meta[name="description"]') ?? "";
      expect(got.endsWith("...")).toBe(true);
      expect(got.length).toBeLessThanOrEqual(300);
    });
    expect(meta('meta[property="og:description"]')).toBe(meta('meta[name="description"]'));
  });

  it("sets the published time on an article", async () => {
    renderHead({ title: "T", path: "/sermons/t/", type: "article", publishedTime: "2024-03-01" });
    await waitFor(() => expect(meta('meta[property="article:published_time"]')).toBe("2024-03-01"));
    expect(meta('meta[property="og:type"]')).toBe("article");
  });

  it("omits the published time when the article has no date", async () => {
    renderHead({ title: "Undated", path: "/x/", type: "article", publishedTime: null });
    await waitFor(() => expect(document.title).toBe("Undated — Hope and Truth Ministry"));
    expect(document.head.querySelector('meta[property="article:published_time"]')).toBeNull();
  });

  it("omits the published time on a non-article", async () => {
    renderHead({ title: "Site", path: "/y/", publishedTime: "2024-03-01" });
    await waitFor(() => expect(document.title).toBe("Site — Hope and Truth Ministry"));
    expect(document.head.querySelector('meta[property="article:published_time"]')).toBeNull();
  });

  it("adds noindex only when asked", async () => {
    renderHead({ title: "Indexed", path: "/i/" });
    await waitFor(() => expect(document.title).toBe("Indexed — Hope and Truth Ministry"));
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it("marks an unlisted page noindex", async () => {
    renderHead({ title: "Hidden", path: "/h/", noindex: true });
    await waitFor(() => expect(meta('meta[name="robots"]')).toBe("noindex, nofollow"));
  });
});
