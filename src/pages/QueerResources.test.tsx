/**
 * Tests for the queer resources page.
 *
 * The reflection listing here has to match the one on the forum page: same
 * titles, same byline, same teaser, so the two pages never drift apart.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import QueerResources from "./QueerResources";
import { getComingOutReflections } from "~/lib/content";

vi.mock("~/components/PageHead", () => ({ default: () => null }));

function renderPage() {
  return render(
    <MemoryRouter>
      <QueerResources />
    </MemoryRouter>
  );
}

describe("the reflections", () => {
  it("credits Tony as the author of both pieces", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /Coming Out Day Reflection/ })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Pride of the Bullied/ })).toBeTruthy();
    expect(screen.getAllByText(/By Tony E Hansen/)).toHaveLength(2);
  });

  it("uses the same teasers as the published reflections themselves", () => {
    renderPage();
    for (const r of getComingOutReflections()) {
      expect(screen.getByText(r.summary)).toBeTruthy();
    }
  });
});

describe("Iowa resources", () => {
  it.each([
    ["One Iowa", "https://oneiowa.org/resources/hotlines-support/"],
    ["Iowa Safe Schools", "https://iowasafeschools.org/"],
    ["Capital City Pride", "https://capitalcitypride.org/resources/lgbtq-organizations/"],
    ["Matthew Shepard Scholarship", "https://eychanerfoundation.org/"],
  ])("links to %s", (name, href) => {
    renderPage();
    const link = screen.getByRole("link", { name: new RegExp(name) });
    expect(link.getAttribute("href")).toBe(href);
  });

  it("credits the Eychaner Foundation for the scholarship", () => {
    renderPage();
    expect(screen.getByText(/Eychaner Foundation/)).toBeTruthy();
  });

  it("links the HRC coming-out guide alongside the HRC home page", () => {
    renderPage();
    const link = screen.getByRole("link", { name: /coming out resources/i });
    expect(link.getAttribute("href")).toBe("https://www.hrc.org/resources/coming-out");
  });
});
