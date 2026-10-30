/**
 * Tests for the queer resources page.
 *
 * The research section moved here from the retired forum page. The sourcing
 * assertions are the ones that matter: every figure on a public page has to
 * name where it came from and when.
 */
import { render, screen, fireEvent } from "@testing-library/react";
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
  ])("links to %s", (name, href) => {
    renderPage();
    const link = screen.getByRole("link", { name: new RegExp(name) });
    expect(link.getAttribute("href")).toBe(href);
  });

  it("lists the Matthew Shepard Scholarship without a link", () => {
    renderPage();
    expect(screen.getByText("Matthew Shepard Scholarship")).toBeTruthy();
    expect(screen.getByText(/Eychaner Foundation/)).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Matthew Shepard/ })).toBeNull();
    expect(document.querySelector('a[href*="eychaner"]')).toBeNull();
  });

  it("links the HRC coming-out guide alongside the HRC home page", () => {
    renderPage();
    const link = screen.getByRole("link", { name: /coming out resources/i });
    expect(link.getAttribute("href")).toBe("https://www.hrc.org/resources/coming-out");
  });
});

describe("the research", () => {
  it("shows the research section and its figures", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /what the research says/i })).toBeTruthy();
    expect(screen.getAllByText("8.4×")).not.toHaveLength(0);
    expect(screen.getAllByText(/34% in Iowa/)).not.toHaveLength(0);
  });

  it("names a source and year for every statistic", () => {
    renderPage();
    expect(screen.getAllByText(/The Trevor Project, \d{4}/).length).toBeGreaterThan(5);
    expect(screen.getAllByText(/Family Acceptance Project/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/HRC Foundation, \d{4}/).length).toBeGreaterThan(4);
    expect(screen.getByText(/2013 survey/)).toBeTruthy();
    expect(screen.getAllByText(/PRRI 2025/).length).toBeGreaterThan(0);
  });

  it("shows the HRC figures on faith communities", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /what young people say about church/i })).toBeTruthy();
    expect(screen.getAllByText("63.1%")).not.toHaveLength(0);
    expect(screen.getAllByText("54.5%")).not.toHaveLength(0);
    expect(screen.getAllByText("20.1%")).not.toHaveLength(0);
    expect(screen.getAllByText("25.9%")).not.toHaveLength(0);
  });

  it("is explicit that the HRC faith figures describe Black and Latine youth", () => {
    renderPage();
    expect(screen.getByText(/describe those groups rather than all young people/i)).toBeTruthy();
    expect(screen.getAllByText(/Black and Latine LGBTQ\+ Youth Reports/).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/nothing about any particular church, denomination, or community/i)
    ).toBeTruthy();
  });

  it("puts the coming-out figures in the Coming out section", () => {
    const { container } = renderPage();
    const section = container.querySelector("section#coming-out");
    expect(section).toBeTruthy();
    expect(section!.textContent).toMatch(/one-and-done event/);
    expect(section!.textContent).toContain("82.7%");
    expect(section!.textContent).toContain("63% and 57%");
    expect(section!.textContent).toMatch(/August.September 2026/);
  });

  it("covers work, including what Iowa law still protects", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /^At work$/ })).toBeTruthy();
    expect(screen.getAllByText("47%")).not.toHaveLength(0);
    expect(screen.getAllByText("39% vs. 12%")).not.toHaveLength(0);
    expect(screen.getAllByText(/Williams Institute/).length).toBeGreaterThan(2);
    expect(screen.getByText(/Bostock v. Clayton County/)).toBeTruthy();
    expect(screen.getByText(/removed gender identity from the Iowa Civil Rights/i)).toBeTruthy();
    expect(screen.getByText(/Sexual orientation remains protected under Iowa law/i)).toBeTruthy();
  });

  it("covers growing older", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /^Growing older$/ })).toBeTruthy();
    expect(screen.getAllByText(/3 million/)).not.toHaveLength(0);
    expect(screen.getAllByText("2×")).not.toHaveLength(0);
    expect(screen.getAllByText("82%")).not.toHaveLength(0);
    expect(screen.getAllByText(/SAGE/).length).toBeGreaterThan(2);
  });

  it("covers marriage acceptance, including that it can move backwards", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /^Marriage$/ })).toBeTruthy();
    expect(screen.getAllByText("65%")).not.toHaveLength(0);
    expect(screen.getAllByText("87% / 67% / 37%")).not.toHaveLength(0);
    expect(screen.getAllByText(/Gallup/).length).toBeGreaterThan(2);
    expect(screen.getAllByText("76%", { ignore: "[aria-hidden=true]" })).toHaveLength(1);
  });

  it("puts crisis resources alongside the risk figures", () => {
    const { container } = renderPage();
    expect(container.querySelector("section#risk")!.textContent).toMatch(/Call or text 988/);
  });

  it("shows each figure on a card that flips to reveal its details", () => {
    renderPage();
    const card = screen.getByRole("button", { name: /more likely to have attempted suicide/ });
    expect(card.getAttribute("aria-pressed")).toBe("false");
    expect(card.textContent).toMatch(/family rejection/);
    fireEvent.click(card);
    expect(card.getAttribute("aria-pressed")).toBe("true");
  });

  it("closes with a note naming the sources", () => {
    renderPage();
    expect(screen.getByText(/Figures on this page are drawn from/)).toBeTruthy();
  });
});

describe("what did not come over from the forum", () => {
  it("has no question form, code field, or textbox", () => {
    const { container } = renderPage();
    expect(container.querySelector("form")).toBeNull();
    expect(screen.queryByLabelText(/access code/i)).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("never mentions Windsor Heights", () => {
    const { container } = renderPage();
    expect(container.textContent).not.toMatch(/Windsor Heights/i);
  });

  it("drops the forum-specific copy", () => {
    const { container } = renderPage();
    const text = container.textContent;
    expect(text).not.toMatch(/ELCA stance/);
    expect(text).not.toMatch(/work in progress/i);
    expect(text).not.toMatch(/this forum|ahead of time|Sunday/i);
  });
});

describe("navigation", () => {
  it("offers a jump list whose targets all exist, each with a way back", () => {
    const { container } = renderPage();
    const nav = container.querySelector('nav[aria-label="On this page"]');
    expect(nav).toBeTruthy();

    const targets = Array.from(nav!.querySelectorAll("a")).map((a) =>
      (a.getAttribute("href") ?? "").replace("#", "")
    );
    expect(targets).toEqual(
      expect.arrayContaining(["coming-out", "research", "risk", "lifetime", "church-faith"])
    );
    for (const id of targets) {
      expect(container.querySelector(`section#${id}`), `no section #${id}`).toBeTruthy();
    }
    expect(container.querySelectorAll('a[href="#top"]').length).toBe(targets.length);
    expect(container.querySelector("#top")).toBe(nav);
  });

  it("gives every section an id, and no id appears twice", () => {
    const { container } = renderPage();
    for (const section of Array.from(container.querySelectorAll("section"))) {
      expect(section.id, section.textContent.slice(0, 40)).not.toBe("");
    }
    const ids = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps the forum's section anchors, so shared links still land", () => {
    const { container } = renderPage();
    for (const id of ["acceptance", "rejection", "reality", "coming-out", "work", "older", "church", "faith", "marriage"]) {
      expect(container.querySelector(`#${id}`), `no #${id}`).toBeTruthy();
    }
  });
});
