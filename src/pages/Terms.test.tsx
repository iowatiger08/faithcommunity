import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, afterEach } from "vitest";
import Terms from "./Terms";

vi.mock("~/components/PageHead", () => ({ default: () => null }));

const flags = vi.hoisted(() => ({ comments: false }));
vi.mock("~/lib/auth", () => ({
  get commentsEnabled() {
    return flags.comments;
  },
}));

const renderTerms = () =>
  render(
    <MemoryRouter>
      <Terms />
    </MemoryRouter>,
  ).container.textContent;

afterEach(() => {
  flags.comments = false;
});

describe("Terms", () => {
  it("has no comment rules before comments are turned on", () => {
    const text = renderTerms();
    expect(text).not.toMatch(/Community guidelines/);
    expect(text).toMatch(/Last updated: October 2026/);
  });

  it("sets out guidelines, permission to display and moderation once they are on", () => {
    flags.comments = true;
    const text = renderTerms();
    expect(text).toMatch(/Community guidelines/);
    expect(text).toMatch(/whether\s+someone is out/);
    expect(text).toMatch(/permission to show it on this site/);
    expect(text).toMatch(/may not be used to train\s+AI models/);
    expect(text).toMatch(/may be suspended/);
    expect(text).toMatch(/Comments are the exception/);
    expect(text).toMatch(/Last updated: November 2026/);
  });
});
