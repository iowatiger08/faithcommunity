// @vitest-environment node
/**
 * Server-render tests. The SSG build renders every page in Node, where there
 * is no window; these components must render a stable, date-free first frame
 * there so hydration matches.
 */
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import SeasonBadge from "~/components/SeasonBadge";
import Forum from "~/pages/Forum";

vi.mock("~/components/PageHead", () => ({ default: () => null }));

describe("server render", () => {
  it("runs without a window", () => {
    expect(typeof window).toBe("undefined");
  });

  it("renders no season badge, so the build date never leaks into HTML", () => {
    expect(renderToString(<SeasonBadge />)).toBe("");
  });

  it("renders the forum page without reading the URL hash", () => {
    const html = renderToString(
      <MemoryRouter>
        <Forum />
      </MemoryRouter>
    );
    expect(html).toMatch(/doesn.*t exist anymore/);
    expect(html).toContain('href="/queer-resources"');
  });
});
